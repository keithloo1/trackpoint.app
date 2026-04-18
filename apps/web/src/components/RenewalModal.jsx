
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { addDays } from 'date-fns';
import { useClientManagement } from '../context/ClientManagementContext.jsx';
import DatePicker from './DatePicker.jsx';
import { toast } from 'sonner';

const renewalSchema = z.object({
  packageId: z.string().min(1, 'Please select a package'),
  packageSize: z.coerce.number().int().min(1, 'Must be at least 1 session'),
  amount: z.coerce.number().min(0, 'Amount cannot be negative'),
  paymentStatus: z.enum(['paid', 'pending'])
});

const RenewalModal = ({ clientId, clientName, currentExpiryDate, open, onOpenChange, onRenewalComplete }) => {
  const { packages, renewClient } = useClientManagement();
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    resolver: zodResolver(renewalSchema),
    defaultValues: {
      packageId: '',
      packageSize: 10,
      amount: 0,
      paymentStatus: 'paid'
    }
  });

  const selectedPackageId = watch('packageId');
  const paymentStatus = watch('paymentStatus');

  useEffect(() => {
    if (open) {
      reset({
        packageId: '',
        packageSize: 10,
        amount: 0,
        paymentStatus: 'paid'
      });
      
      const currentExpiry = currentExpiryDate ? new Date(currentExpiryDate) : new Date();
      const baseDate = currentExpiry > new Date() ? currentExpiry : new Date();
      setExpiryDate(addDays(baseDate, 30));
    }
  }, [open, reset, currentExpiryDate]);

  const handlePackageChange = (val) => {
    setValue('packageId', val);
    const pkg = packages?.find(p => p.id === val);
    if (pkg) {
      setValue('packageSize', pkg.sessions);
      setValue('amount', pkg.price);
    } else if (val === 'custom') {
      setValue('packageSize', 10);
      setValue('amount', 0);
    }
  };

  const onSubmit = async (data) => {
    if (!expiryDate) {
      toast.error('Please select an expiry date');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await renewClient(
        clientId, 
        data.packageId, 
        data.packageSize, 
        data.amount, 
        data.paymentStatus, 
        expiryDate.toISOString()
      );
      
      toast.success('Renewal processed successfully');
      
      if (onRenewalComplete) {
        onRenewalComplete();
      }
      onOpenChange(false);
      
    } catch (error) {
      console.error('Renewal error:', error);
      toast.error(error.message || 'Failed to process renewal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Renew Package</DialogTitle>
          <DialogDescription>
            Record a new package renewal for {clientName}.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Package</Label>
            <Select value={selectedPackageId} onValueChange={handlePackageChange}>
              <SelectTrigger className={errors.packageId ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select a package" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom Package</SelectItem>
                {packages?.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.packageName} ({p.sessions} sessions)</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.packageId && <p className="text-sm text-destructive">{errors.packageId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="packageSize">Sessions</Label>
              <Input id="packageSize" type="number" {...register('packageSize')} className={errors.packageSize ? 'border-destructive' : ''} />
              {errors.packageSize && <p className="text-sm text-destructive">{errors.packageSize.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (RM)</Label>
              <Input id="amount" type="number" step="0.01" {...register('amount')} className={errors.amount ? 'border-destructive' : ''} />
              {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Payment Status</Label>
              <Select value={paymentStatus} onValueChange={(val) => setValue('paymentStatus', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>New Expiry Date</Label>
              <DatePicker 
                value={expiryDate} 
                onChange={setExpiryDate} 
                placeholder="Select date" 
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : 'Confirm Renewal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RenewalModal;
