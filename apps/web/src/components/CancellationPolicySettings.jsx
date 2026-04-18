
import React, { useState, useEffect } from 'react';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/context/AuthContext.jsx';

const CancellationPolicySettings = () => {
  const { currentUser } = useAuth();
  const [policy, setPolicy] = useState('Allow cancellations anytime');
  const [settingsId, setSettingsId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!currentUser) return;
      try {
        const records = await pb.collection('settings').getFullList({
          filter: `ownerId="${currentUser.id}"`,
          $autoCancel: false
        });
        
        if (records.length > 0) {
          setSettingsId(records[0].id);
          if (records[0].cancellation_policy) {
            setPolicy(records[0].cancellation_policy);
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [currentUser]);

  const handleSave = async () => {
    if (!settingsId) {
      toast.error('Settings record not found. Please save general settings first.');
      return;
    }

    setIsSaving(true);
    try {
      await pb.collection('settings').update(settingsId, {
        cancellation_policy: policy
      }, { $autoCancel: false });
      toast.success('Cancellation policy updated successfully');
    } catch (error) {
      console.error('Error updating policy:', error);
      toast.error('Failed to update cancellation policy');
    } finally {
      setIsSaving(false);
    }
  };

  const getPolicyDescription = (val) => {
    switch (val) {
      case 'Cannot cancel within 24 hours before class':
        return 'Clients will be blocked from cancelling if the class starts in less than 24 hours. Sessions will not be refunded.';
      case 'Cannot cancel within 1 hour before class':
        return 'Clients will be blocked from cancelling if the class starts in less than 1 hour. Sessions will not be refunded.';
      default:
        return 'Clients can cancel their booking at any time before the class starts and receive a session refund.';
    }
  };

  if (isLoading) {
    return <div className="py-4 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div>;
  }

  return (
    <div className="space-y-4 pt-4 mt-2 border-t border-slate-200">
      <div className="flex items-center gap-2 mb-2">
        <ShieldAlert className="w-5 h-5 text-slate-700" />
        <Label className="text-base font-semibold">Class Cancellation Policy</Label>
      </div>
      
      <div className="space-y-3">
        <Select value={policy} onValueChange={setPolicy}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a policy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Allow cancellations anytime">Allow cancellations anytime</SelectItem>
            <SelectItem value="Cannot cancel within 24 hours before class">Cannot cancel within 24 hours before class</SelectItem>
            <SelectItem value="Cannot cancel within 1 hour before class">Cannot cancel within 1 hour before class</SelectItem>
          </SelectContent>
        </Select>
        
        <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-md border border-slate-100">
          {getPolicyDescription(policy)}
        </p>

        <Button 
          type="button" 
          variant="secondary" 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full sm:w-auto"
        >
          {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save Policy'}
        </Button>
      </div>
    </div>
  );
};

export default CancellationPolicySettings;
