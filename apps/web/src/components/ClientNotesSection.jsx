
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Edit2, Save, X, FileText, Loader2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const ClientNotesSection = ({ client, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(client?.notes || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setNotes(client?.notes || '');
    setIsEditing(false);
  }, [client]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await pb.collection('clients').update(client.id, { notes }, { $autoCancel: false });
      toast.success('Client notes updated successfully');
      setIsEditing(false);
      if (onUpdate) onUpdate(updated);
    } catch (error) {
      console.error('Error updating notes:', error);
      toast.error('Failed to update notes');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <h3 className="font-semibold text-slate-900 flex items-center">
          <FileText className="w-4 h-4 mr-2 text-slate-500" /> 
          Client Notes
        </h3>
        {!isEditing ? (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="h-8 text-slate-600 hover:text-slate-900">
            <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Edit Notes
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => { setIsEditing(false); setNotes(client?.notes || ''); }} className="h-8 text-slate-500">
              <X className="w-3.5 h-3.5 mr-1.5" /> Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving} className="h-8 bg-slate-900 hover:bg-slate-800 text-white">
              {isSaving ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-1.5" />} 
              Save
            </Button>
          </div>
        )}
      </div>
      <div className="p-5">
        {isEditing ? (
          <Textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            placeholder="Add important details, goals, injuries, or preferences about this client..."
            className="min-h-[120px] resize-y text-sm leading-relaxed focus-visible:ring-primary/20"
          />
        ) : (
          <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed min-h-[60px]">
            {notes ? notes : <span className="text-slate-400 italic">No notes added yet. Click edit to add notes.</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientNotesSection;
