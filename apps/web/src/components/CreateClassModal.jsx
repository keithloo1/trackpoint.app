
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/context/AuthContext.jsx';

const createClassSchema = z.object({
  className: z.string().min(1, 'Class name is required'),
  classDate: z.string().min(1, 'Date is required'),
  classTime: z.string().min(1, 'Time is required'),
  capacity: z.coerce.number().int().min(1, 'Capacity must be at least 1'),
  description: z.string().optional()
});

const CreateClassModal = ({ open, onOpenChange }) => {
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(createClassSchema),
    defaultValues: {
      className: '',
      classDate: '',
      classTime: '',
      capacity: 10,
      description: ''
    }
  });

  const onSubmit = async (data) => {
    if (!currentUser) return;
    setIsSubmitting(true);
    
    try {
      // Create UTC normalized date to avoid timezone offset issues in PocketBase
      const localDate = new Date(`${data.classDate}T12:00:00Z`);
      
      await pb.collection('classes').create({
        className: data.className,
        classDate: localDate.toISOString(),
        classTime: data.classTime,
        capacity: data.capacity,
        description: data.description,
        userId: currentUser.id
      }, { $autoCancel: false });

      toast.success('Class created successfully');
      reset();
      onOpenChange(false);
    } catch (err) {
      console.error('Failed to create class:', err);
      toast.error('Failed to create class. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) reset();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Class</DialogTitle>
          <DialogDescription>
            Schedule a new class session. Clients will be able to book this via their portal.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="className">Class Name</Label>
            <Input id="className" placeholder="e.g. HIIT Bootcamp" {...register('className')} />
            {errors.className && <p className="text-sm text-destructive">{errors.className.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="classDate">Date</Label>
              <Input id="classDate" type="date" {...register('classDate')} />
              {errors.classDate && <p className="text-sm text-destructive">{errors.classDate.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="classTime">Time</Label>
              <Input id="classTime" type="time" {...register('classTime')} />
              {errors.classTime && <p className="text-sm text-destructive">{errors.classTime.message}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="capacity">Total Capacity</Label>
            <Input id="capacity" type="number" min="1" {...register('capacity')} />
            {errors.capacity && <p className="text-sm text-destructive">{errors.capacity.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea id="description" placeholder="Any details for the clients..." {...register('description')} className="resize-none" />
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Class
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClassModal;
