
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useClientManagement } from '../context/ClientManagementContext.jsx';
import DatePicker from './DatePicker.jsx';

const SessionDateTimePicker = ({ client, mode, open, onOpenChange, onSubmit }) => {
  const { settings } = useClientManagement();
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDeduction = mode === 'deduct';
  const title = isDeduction ? 'Punch Session' : 'Add Session Back';
  const description = isDeduction 
    ? `Record a completed session for ${client?.name}.` 
    : `Add a session back to ${client?.name}'s package.`;

  useEffect(() => {
    if (open) {
      const now = new Date();
      setDate(now);
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!date || !time || !client) return;
    
    setIsSubmitting(true);
    const [hours, minutes] = time.split(':');
    const finalDateTime = new Date(date);
    finalDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    
    const updatedClientData = onSubmit(finalDateTime.toISOString());
    
    if (isDeduction && updatedClientData) {
      if (settings.emailNotificationsEnabled && client.email) {
        toast.success(`Session deducted and email sent to ${client.email}`);
      } else {
        toast.success("Session deducted successfully.");
      }
    }
    
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="flex flex-col space-y-2">
            <Label>Date</Label>
            <DatePicker 
              value={date} 
              onChange={setDate} 
              placeholder="Select date" 
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full text-foreground"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!date || !time || isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Confirm Session'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionDateTimePicker;
