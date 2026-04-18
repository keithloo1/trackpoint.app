
import React, { useState, useEffect } from 'react';
import { Pencil, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import DatePicker from './DatePicker.jsx';

const EditHistoryModal = ({ open, onOpenChange, historyRecord, onSuccess }) => {
  const [actionDate, setActionDate] = useState(new Date());
  const [actionType, setActionType] = useState('deduction');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (historyRecord && open) {
      setActionDate(new Date(historyRecord.actionDate || historyRecord.sessionDateTime));
      setActionType(historyRecord.actionType || historyRecord.type || 'deduction');
      setNotes(historyRecord.notes || '');
    }
  }, [historyRecord, open]);

  const handleSave = async () => {
    if (!historyRecord) return;

    try {
      setSaving(true);

      await pb.collection('history').update(historyRecord.id, {
        actionDate: actionDate.toISOString(),
        actionType: actionType,
        notes: notes
      }, { $autoCancel: false });

      toast.success('Session updated successfully');
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating history:', error);
      toast.error('Failed to update session. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="w-5 h-5 text-primary" />
            Edit Session Record
          </DialogTitle>
          <DialogDescription>
            Update the details of this session entry.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="actionDate">Date & Time</Label>
            <DatePicker 
              value={actionDate} 
              onChange={setActionDate}
              placeholder="Select date"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="actionType">Action Type</Label>
            <Select value={actionType} onValueChange={setActionType}>
              <SelectTrigger>
                <SelectValue placeholder="Select action type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deduction">Deduction</SelectItem>
                <SelectItem value="addition">Addition</SelectItem>
                <SelectItem value="renewal">Renewal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input 
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this session"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditHistoryModal;
