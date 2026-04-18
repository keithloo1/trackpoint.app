
import React, { useState, useMemo } from 'react';
import { UserX, Trash2, Archive, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import ClientCard from './ClientCard.jsx';
import CompactClientCard from './CompactClientCard.jsx';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const FollowUpClientsSection = ({ clients, viewMode, onRefresh }) => {
  const [selectedClients, setSelectedClients] = useState([]);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [processing, setProcessing] = useState(false);

  const followUpClients = useMemo(() => {
    return clients.filter(c => c.follow_up_status === true && !c.archived);
  }, [clients]);

  const handleToggleSelect = (clientId) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleSelectAll = () => {
    if (selectedClients.length === followUpClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(followUpClients.map(c => c.id));
    }
  };

  const handleBulkRemoveFromFollowUp = async () => {
    try {
      setProcessing(true);
      for (const clientId of selectedClients) {
        await pb.collection('clients').update(clientId, { follow_up_status: false }, { $autoCancel: false });
      }
      await onRefresh();
      setSelectedClients([]);
      setShowRemoveDialog(false);
      toast.success(`${selectedClients.length} clients removed from follow-up`);
    } catch (error) {
      console.error('Bulk remove from follow-up error:', error);
      toast.error('Failed to remove clients from follow-up');
    } finally {
      setProcessing(false);
    }
  };

  const handleBulkArchive = async () => {
    try {
      setProcessing(true);
      for (const clientId of selectedClients) {
        await pb.collection('clients').update(clientId, { archived: true, follow_up_status: false }, { $autoCancel: false });
      }
      await onRefresh();
      setSelectedClients([]);
      setShowArchiveDialog(false);
      toast.success(`${selectedClients.length} clients archived`);
    } catch (error) {
      console.error('Bulk archive error:', error);
      toast.error('Failed to archive clients');
    } finally {
      setProcessing(false);
    }
  };

  const handleBulkDelete = async () => {
    try {
      setProcessing(true);
      for (const clientId of selectedClients) {
        await pb.collection('clients').delete(clientId, { $autoCancel: false });
      }
      await onRefresh();
      setSelectedClients([]);
      setShowDeleteDialog(false);
      toast.success(`${selectedClients.length} clients deleted`);
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast.error('Failed to delete clients');
    } finally {
      setProcessing(false);
    }
  };

  if (followUpClients.length === 0) {
    return (
      <div className="text-center py-12 sm:py-20 bg-white rounded-2xl border border-dashed border-slate-300 mx-2 sm:mx-0">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-100 mb-4">
          <UserX className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-900">No clients in follow-up</h3>
        <p className="text-sm sm:text-base text-slate-500 mt-2 px-4">Clients marked for follow-up will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Bulk Selection Controls - HIDDEN ON MOBILE */}
      <div className="hidden md:flex items-center justify-between bg-white rounded-xl border border-slate-200 p-3 sm:p-4">
        <div className="flex items-center gap-3">
          <Checkbox 
            checked={selectedClients.length === followUpClients.length && followUpClients.length > 0}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm font-medium text-slate-700">
            {selectedClients.length > 0 ? `${selectedClients.length} selected` : 'Select all'}
          </span>
        </div>
        {selectedClients.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowRemoveDialog(true)}
              disabled={processing}
              className="h-9"
            >
              <X className="w-4 h-4 mr-2" /> Remove from Follow Up
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowArchiveDialog(true)}
              disabled={processing}
              className="h-9"
            >
              <Archive className="w-4 h-4 mr-2" /> Archive
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => setShowDeleteDialog(true)}
              disabled={processing}
              className="h-9"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          </div>
        )}
      </div>

      {/* Client Cards */}
      <div className={viewMode === 'compact' ? "flex flex-col gap-1.5 sm:gap-3" : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6"}>
        {followUpClients.map(client => (
          viewMode === 'compact' ? 
            <CompactClientCard 
              key={client.id} 
              client={client} 
              isSelected={selectedClients.includes(client.id)}
              onToggleSelect={handleToggleSelect}
            /> : 
            <ClientCard 
              key={client.id} 
              client={client}
              isSelected={selectedClients.includes(client.id)}
              onToggleSelect={handleToggleSelect}
            />
        ))}
      </div>

      {/* Remove from Follow Up Dialog */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {selectedClients.length} clients from follow-up?</AlertDialogTitle>
            <AlertDialogDescription>
              These clients will be moved back to the main dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkRemoveFromFollowUp} disabled={processing}>
              {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Archive Dialog */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive {selectedClients.length} clients?</AlertDialogTitle>
            <AlertDialogDescription>
              These clients will be moved to the archived section. You can restore them later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkArchive} disabled={processing}>
              {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Archive'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedClients.length} clients?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All client data and history will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} disabled={processing} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete Permanently'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FollowUpClientsSection;
