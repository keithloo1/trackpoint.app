
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { useClientManagement } from '../context/ClientManagementContext.jsx';
import DatePicker from './DatePicker.jsx';
import CSVImporter from './CSVImporter.jsx';
import { cn } from '@/lib/utils.js';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const addClientSchema = z.object({
  name: z.string().min(1, 'Client name is required'),
  email: z.string().email('Valid email is required').optional().or(z.literal('')),
  phone: z.string().optional(),
  unlimited: z.boolean().default(false),
  packageSize: z.coerce.number().int().min(1, 'Package size must be at least 1').optional(),
  paymentStatus: z.enum(['paid', 'pending']),
  amountReceived: z.coerce.number().min(0, 'Amount cannot be negative').optional(),
  memberStatus: z.enum(['member', 'non-member']),
  clientType: z.enum(['PT', 'Group', 'PT and Group'])
});

const AddClientModal = ({ open, onOpenChange }) => {
  const { refreshClients } = useClientManagement();
  const [activeTab, setActiveTab] = useState('single');
  const [expiryDate, setExpiryDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  const [birthday, setBirthday] = useState(null);
  const [datePaid, setDatePaid] = useState(null);
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue, watch } = useForm({
    resolver: zodResolver(addClientSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      unlimited: false,
      packageSize: 10,
      paymentStatus: 'pending',
      amountReceived: 0,
      memberStatus: 'non-member',
      clientType: 'PT and Group'
    }
  });

  const paymentStatus = watch('paymentStatus');
  const memberStatus = watch('memberStatus');
  const clientType = watch('clientType');
  const isUnlimited = watch('unlimited');

  const onSubmit = async (data) => {
    try {
      const payload = {
        clientName: data.name,
        email: data.email || "",
        phone: data.phone || "",
        unlimited: data.unlimited,
        totalSessions: data.unlimited ? 1 : (data.packageSize || 10),
        sessionsRemaining: data.unlimited ? 0 : (data.packageSize || 10),
        expiryDate: expiryDate.toISOString(),
        memberStatus: data.memberStatus,
        clientType: data.clientType,
        userId: pb.authStore.model?.id,
        attendance_count: 0
      };

      if (birthday) {
        payload.birthday = birthday.toISOString();
      }

      if (datePaid) {
        payload.date_paid = datePaid.toISOString();
      }

      const clientRecord = await pb.collection('clients').create(payload, { $autoCancel: false });

      if (data.amountReceived > 0 || data.paymentStatus === 'paid') {
        await pb.collection('history').create({
          clientId: clientRecord.id,
          actionType: 'addition',
          sessionsChanged: data.unlimited ? 1 : data.packageSize,
          actionDate: new Date().toISOString(),
          paymentStatus: data.paymentStatus,
          amount: data.amountReceived || 0,
          userId: pb.authStore.model?.id
        }, { $autoCancel: false });
      }

      toast.success(`${data.name} was successfully added!`);
      
      refreshClients();
      reset();
      setExpiryDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
      setBirthday(null);
      setDatePaid(null);
      onOpenChange(false);
      
    } catch (error) {
      console.error('Error creating client:', error);
      toast.error(error.message || 'Failed to add client. Please check the details and try again.');
    }
  };

  const handleCSVSuccess = () => {
    refreshClients();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        reset();
        setDatePaid(null);
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent className={cn(
        "transition-all duration-300 max-h-[90vh] overflow-y-auto overflow-x-hidden p-4 sm:p-6 rounded-2xl", 
        activeTab === 'import' ? "sm:max-w-[750px]" : "sm:max-w-[500px]"
      )}>
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl font-bold">Add Clients</DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            {activeTab === 'single' ? "Enter the details for your new client." : "Import clients and historical data from CSV."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-2 mb-4 h-10 sm:h-11 bg-slate-100/80 p-1 rounded-xl">
            <TabsTrigger value="single" className="text-sm rounded-lg data-[state=active]:shadow-sm">Add Single Client</TabsTrigger>
            <TabsTrigger value="import" className="text-sm rounded-lg data-[state=active]:shadow-sm">Import CSV</TabsTrigger>
          </TabsList>
          
          <TabsContent value="single" className="focus-visible:outline-none">
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 sm:gap-4 py-2">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2 col-span-2">
                  <Label htmlFor="name">Client Name</Label>
                  <Input id="name" placeholder="e.g. Jane Doe" {...register('name')} className={cn("h-11 sm:h-10 rounded-xl", errors.name && "border-destructive")} />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-1.5 sm:space-y-2 col-span-2 sm:col-span-1">
                  <Label htmlFor="email">Email Address <span className="text-slate-400 font-normal">(Optional)</span></Label>
                  <Input id="email" type="email" placeholder="jane@example.com" {...register('email')} className={cn("h-11 sm:h-10 rounded-xl", errors.email && "border-destructive")} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-1.5 sm:space-y-2 col-span-2 sm:col-span-1">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+60 12-345 6789" {...register('phone')} className="h-11 sm:h-10 rounded-xl" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4 border-t border-slate-100 pt-3 sm:pt-4 mt-1 sm:mt-2">
                <div className="space-y-2 sm:space-y-3 col-span-2 sm:col-span-1">
                  <Label>Membership Status</Label>
                  <RadioGroup value={memberStatus} onValueChange={(val) => setValue('memberStatus', val)} className="flex flex-row gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="member" id="r1" className="h-5 w-5" />
                      <Label htmlFor="r1" className="font-normal cursor-pointer text-sm">Member</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="non-member" id="r2" className="h-5 w-5" />
                      <Label htmlFor="r2" className="font-normal cursor-pointer text-sm">Non-Member</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-1.5 sm:space-y-2 col-span-2 sm:col-span-1">
                  <Label>Client Type</Label>
                  <Select value={clientType} onValueChange={(val) => setValue('clientType', val)}>
                    <SelectTrigger className={cn("h-11 sm:h-10 rounded-xl", errors.clientType && "border-destructive")}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PT">PT</SelectItem>
                      <SelectItem value="Group">Group</SelectItem>
                      <SelectItem value="PT and Group">PT and Group</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.clientType && <p className="text-xs text-destructive">{errors.clientType.message}</p>}
                </div>

                <div className="space-y-1.5 sm:space-y-2 col-span-2">
                  <Label>Birthday (Optional)</Label>
                  <div className="min-h-[44px] sm:min-h-[40px]">
                    <DatePicker 
                      value={birthday} 
                      onChange={setBirthday} 
                      placeholder="Select birth date" 
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4 border-t border-slate-100 pt-3 sm:pt-4 mt-1 sm:mt-2">
                <div className="space-y-1.5 sm:space-y-2 col-span-2 flex items-center justify-between rounded-xl border border-slate-200 p-4 shadow-sm bg-slate-50/50">
                  <div className="space-y-0.5">
                    <Label className="text-base">Unlimited Package</Label>
                    <p className="text-xs text-slate-500">Client has unlimited sessions</p>
                  </div>
                  <Switch checked={isUnlimited} onCheckedChange={(val) => setValue('unlimited', val)} />
                </div>

                {!isUnlimited && (
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="packageSize">Initial Package Size</Label>
                    <Input id="packageSize" type="number" {...register('packageSize')} className={cn("h-11 sm:h-10 rounded-xl", errors.packageSize && "border-destructive")} />
                    {errors.packageSize && <p className="text-xs text-destructive">{errors.packageSize.message}</p>}
                  </div>
                )}

                <div className={cn("space-y-1.5 sm:space-y-2", isUnlimited ? "col-span-2" : "")}>
                  <Label>Expiry Date</Label>
                  <div className="min-h-[44px] sm:min-h-[40px]">
                    <DatePicker 
                      value={expiryDate} 
                      onChange={setExpiryDate} 
                      placeholder="Select expiry date" 
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 border-t border-slate-100 pt-3 sm:pt-4 mt-1 sm:mt-2">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label>Payment Status</Label>
                  <Select value={paymentStatus} onValueChange={(val) => setValue('paymentStatus', val)}>
                    <SelectTrigger className={cn("h-11 sm:h-10 rounded-xl", errors.paymentStatus && "border-destructive")}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="amountReceived">Amount Received</Label>
                  <Input id="amountReceived" type="number" step="0.01" placeholder="0.00" {...register('amountReceived')} className={cn("h-11 sm:h-10 rounded-xl", errors.amountReceived && "border-destructive")} />
                  {errors.amountReceived && <p className="text-xs text-destructive">{errors.amountReceived.message}</p>}
                </div>

                <div className="space-y-1.5 sm:space-y-2 col-span-2">
                  <Label>Date Paid (Optional)</Label>
                  <div className="min-h-[44px] sm:min-h-[40px]">
                    <DatePicker 
                      value={datePaid} 
                      onChange={setDatePaid} 
                      placeholder="Select payment date" 
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-4 sm:mt-6 gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-11 sm:h-10 w-full sm:w-auto rounded-xl">Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="h-11 sm:h-10 w-full sm:w-auto rounded-xl bg-slate-900 hover:bg-slate-800 text-white">{isSubmitting ? 'Saving...' : 'Save Client'}</Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="import" className="focus-visible:outline-none py-2">
            <CSVImporter onSuccess={handleCSVSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientModal;
