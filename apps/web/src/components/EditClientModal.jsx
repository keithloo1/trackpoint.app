import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import DatePicker from './DatePicker.jsx';
import { useClientManagement } from '@/context/ClientManagementContext.jsx';

const editSchema = z.object({
  clientName: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').or(z.literal('')),
  phone: z.string().optional(),
  unlimited: z.boolean().default(false),
  totalSessions: z.coerce.number().min(1, 'Must be at least 1').optional(),
  sessionsRemaining: z.coerce.number().min(0, 'Cannot be negative').optional(),
  memberStatus: z.enum(['member', 'non-member'])
});

const EditClientModal = ({ client, open, onOpenChange }) => {
  const { refreshClients } = useClientManagement();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [birthday, setBirthday] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(editSchema),
    defaultValues: {
      clientName: '',
      email: '',
      phone: '',
      unlimited: false,
      totalSessions: 10,
      sessionsRemaining: 10,
      memberStatus: 'non-member'
    }
  });

  const memberStatus = watch('memberStatus');
  const isUnlimited = watch('unlimited');

  useEffect(() => {
    if (client && open) {
      reset({
        clientName: client.name || client.clientName || '',
        email: client.email || '',
        phone: client.phone || '',
        unlimited: client.unlimited || false,
        totalSessions: client.packageSize || client.totalSessions || 10,
        sessionsRemaining: client.currentSessions || client.sessionsRemaining || 0,
        memberStatus: client.memberStatus || 'non-member'
      });
      setBirthday(client.birthday ? new Date(client.birthday) : null);
      setExpiryDate(client.expiryDate ? new Date(client.expiryDate) : new Date());
    }
  }, [client, open, reset]);

  const onSubmit = async (data) => {
    if (!expiryDate) {
      toast.error('Expiry date is required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await pb.collection('clients').update(client.id, {
        clientName: data.clientName,
        email: data.email,
        phone: data.phone,
        unlimited: data.unlimited,
        totalSessions: data.unlimited ? 1 : data.totalSessions,
        sessionsRemaining: data.unlimited ? 0 : data.sessionsRemaining,
        expiryDate: expiryDate.toISOString(),
        memberStatus: data.memberStatus,
        birthday: birthday ? birthday.toISOString() : ''
      }, { $autoCancel: false });
      
      toast.success('Client updated successfully');
      refreshClients();
      onOpenChange(false);
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update client');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Client Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Full Name</Label>
            <Input id="clientName" {...register('clientName')} />
            {errors.clientName && <p className="text-sm text-destructive">{errors.clientName.message}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register('phone')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div className="space-y-3">
              <Label>Membership Status</Label>
              <RadioGroup value={memberStatus} onValueChange={(val) => setValue('memberStatus', val)} className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="member" id="edit-r1" />
                  <Label htmlFor="edit-r1" className="font-normal cursor-pointer">Member</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non-member" id="edit-r2" />
                  <Label htmlFor="edit-r2" className="font-normal cursor-pointer">Non-Member</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Birthday</Label>
              <DatePicker 
                value={birthday} 
                onChange={setBirthday} 
                placeholder="Select date" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div className="space-y-2 col-span-2 flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label>Unlimited Package</Label>
                <p className="text-sm text-muted-foreground">Client has unlimited sessions</p>
              </div>
              <Switch checked={isUnlimited} onCheckedChange={(val) => setValue('unlimited', val)} />
            </div>

            {!isUnlimited && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="totalSessions">Package Size</Label>
                  <Input id="totalSessions" type="number" {...register('totalSessions')} />
                  {errors.totalSessions && <p className="text-sm text-destructive">{errors.totalSessions.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionsRemaining">Remaining</Label>
                  <Input id="sessionsRemaining" type="number" {...register('sessionsRemaining')} />
                  {errors.sessionsRemaining && <p className="text-sm text-destructive">{errors.sessionsRemaining.message}</p>}
                </div>
              </>
            )}
          </div>

          <div className="space-y-2">
            <Label>Expiry Date</Label>
            <DatePicker 
              value={expiryDate} 
              onChange={setExpiryDate} 
              placeholder="Select expiry date" 
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientModal;