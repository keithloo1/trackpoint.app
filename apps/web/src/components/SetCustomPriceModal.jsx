
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/context/AuthContext.jsx';
import { toast } from 'sonner';
import { formatMYR } from '@/lib/utils.js';

const priceSchema = z.object({
  custom_price: z.coerce.number().min(0, 'Price cannot be negative')
});

const SetCustomPriceModal = ({ open, onOpenChange, service, client, existingPricing, onSuccess }) => {
  const { currentUser } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(priceSchema),
    defaultValues: {
      custom_price: 0
    }
  });

  useEffect(() => {
    if (open && service) {
      reset({
        custom_price: existingPricing ? existingPricing.custom_price : service.base_price
      });
    }
  }, [open, service, existingPricing, reset]);

  const onSubmit = async (data) => {
    try {
      if (existingPricing) {
        await pb.collection('client_pricing').update(existingPricing.id, {
          custom_price: data.custom_price
        }, { $autoCancel: false });
      } else {
        await pb.collection('client_pricing').create({
          client_id: client.id,
          service_id: service.id,
          custom_price: data.custom_price,
          owner: currentUser.id
        }, { $autoCancel: false });
      }
      toast.success('Custom price saved');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving custom price:', error);
      toast.error('Failed to save custom price');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Custom Price</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-slate-500 mb-4">
            Setting custom price for <strong>{client?.name || client?.clientName}</strong> on <strong>{service?.name}</strong>.
            Base price is {formatMYR(service?.base_price)}.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="custom_price">Custom Price (RM)</Label>
              <Input id="custom_price" type="number" step="0.01" {...register('custom_price')} className={errors.custom_price ? 'border-destructive' : ''} />
              {errors.custom_price && <p className="text-sm text-destructive">{errors.custom_price.message}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Price'}</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SetCustomPriceModal;
