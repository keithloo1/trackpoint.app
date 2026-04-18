
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const serviceSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  sessions_count: z.coerce.number().int().min(1, 'Must be at least 1 session'),
  base_price: z.coerce.number().min(0, 'Price cannot be negative'),
  discount_percentage: z.coerce.number().min(0).max(100).optional().default(0)
});

const EditServiceModal = ({ service, open, onOpenChange, onSuccess }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      sessions_count: 1,
      base_price: 0,
      discount_percentage: 0
    }
  });

  useEffect(() => {
    if (service && open) {
      reset({
        name: service.name,
        sessions_count: service.sessions_count,
        base_price: service.base_price,
        discount_percentage: service.discount_percentage || 0
      });
    }
  }, [service, open, reset]);

  const onSubmit = async (data) => {
    try {
      await pb.collection('services').update(service.id, data, { $autoCancel: false });
      toast.success('Service updated successfully');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Failed to update service');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Service Name</Label>
            <Input id="edit-name" {...register('name')} className={errors.name ? 'border-destructive' : ''} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-sessions_count">Sessions</Label>
              <Input id="edit-sessions_count" type="number" {...register('sessions_count')} className={errors.sessions_count ? 'border-destructive' : ''} />
              {errors.sessions_count && <p className="text-sm text-destructive">{errors.sessions_count.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-base_price">Base Price</Label>
              <Input id="edit-base_price" type="number" step="0.01" {...register('base_price')} className={errors.base_price ? 'border-destructive' : ''} />
              {errors.base_price && <p className="text-sm text-destructive">{errors.base_price.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-discount_percentage">Discount Percentage (%)</Label>
            <Input id="edit-discount_percentage" type="number" {...register('discount_percentage')} className={errors.discount_percentage ? 'border-destructive' : ''} />
            {errors.discount_percentage && <p className="text-sm text-destructive">{errors.discount_percentage.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditServiceModal;
