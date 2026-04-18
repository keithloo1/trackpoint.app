
import React, { useState, useEffect } from 'react';
import { Users, Loader2, CheckCircle2, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/context/AuthContext.jsx';

const AssignMembersModal = ({ open, onOpenChange, classId, className }) => {
  const { currentUser } = useAuth();
  const [availableMembers, setAvailableMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (open && currentUser) {
      fetchAvailableMembers();
      setSearchTerm('');
      setSelectedMembers([]);
    }
  }, [open, currentUser]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMembers(availableMembers);
    } else {
      const filtered = availableMembers.filter(member =>
        member.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  }, [searchTerm, availableMembers]);

  const fetchAvailableMembers = async () => {
    try {
      setLoading(true);
      console.log('[AssignMembersModal] Fetching clients for user:', currentUser.id);
      
      // Fetch ALL clients with sessions remaining or unlimited (up to 500 clients)
      const clients = await pb.collection('clients').getList(1, 500, {
        filter: `userId="${currentUser.id}" && archived != true && (sessionsRemaining > 0 || unlimited = true)`,
        sort: 'clientName',
        $autoCancel: false
      });

      console.log('[AssignMembersModal] Total clients fetched:', clients.items.length);

      // Fetch existing bookings for this class
      const existingBookings = await pb.collection('class_bookings').getFullList({
        filter: `classId="${classId}"`,
        $autoCancel: false
      });

      console.log('[AssignMembersModal] Existing bookings for class:', existingBookings.length);

      const bookedClientIds = existingBookings.map(b => b.clientId);

      // Filter out clients who are already booked
      const available = clients.items.filter(c => !bookedClientIds.includes(c.id));

      console.log('[AssignMembersModal] Available members (not yet booked):', available.length);

      setAvailableMembers(available);
      setFilteredMembers(available);
    } catch (error) {
      console.error('[AssignMembersModal] Error fetching available members:', error);
      toast.error('Failed to load available members');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMember = (memberId) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers.map(m => m.id));
    }
  };

  const handleAssign = async () => {
    if (selectedMembers.length === 0) {
      toast.warning('Please select at least one member');
      return;
    }

    try {
      setAssigning(true);
      console.log('[AssignMembersModal] Starting bulk assignment for', selectedMembers.length, 'members');
      
      const results = {
        succeeded: [],
        failed: []
      };

      // Process each member sequentially to ensure proper error handling
      for (const memberId of selectedMembers) {
        const member = availableMembers.find(m => m.id === memberId);
        if (!member) {
          console.error('[AssignMembersModal] Member not found:', memberId);
          results.failed.push({ memberId, reason: 'Member not found' });
          continue;
        }

        try {
          console.log(`[AssignMembersModal] Assigning member ${member.clientName} (${memberId}) to class ${className}`);

          // Step 1: Create booking
          const booking = await pb.collection('class_bookings').create({
            classId: classId,
            clientId: memberId,
            attended: false
          }, { $autoCancel: false });
          console.log(`[AssignMembersModal] ✓ Created booking for ${member.clientName}:`, booking.id);

          // Step 2: Deduct session (skip for unlimited members)
          if (!member.unlimited) {
            const newSessionsRemaining = member.sessionsRemaining - 1;
            console.log(`[AssignMembersModal] Deducting session for ${member.clientName}: ${member.sessionsRemaining} -> ${newSessionsRemaining}`);
            
            await pb.collection('clients').update(memberId, {
              sessionsRemaining: newSessionsRemaining
            }, { $autoCancel: false });
            console.log(`[AssignMembersModal] ✓ Updated sessions for ${member.clientName}`);

            // Step 3: Create history record
            await pb.collection('history').create({
              clientId: memberId,
              userId: currentUser.id,
              actionType: 'deduction',
              sessionsChanged: -1,
              actionDate: new Date().toISOString(),
              notes: `Assigned to class: ${className}`,
              paymentStatus: 'paid'
            }, { $autoCancel: false });
            console.log(`[AssignMembersModal] ✓ Created history record for ${member.clientName}`);
          } else {
            // For unlimited members, just increment attendance count
            await pb.collection('clients').update(memberId, {
              attendance_count: (member.attendance_count || 0) + 1
            }, { $autoCancel: false });
            console.log(`[AssignMembersModal] ✓ Incremented attendance count for unlimited member ${member.clientName}`);
          }

          results.succeeded.push(member.clientName);
          console.log(`[AssignMembersModal] ✓ Successfully assigned ${member.clientName}`);
        } catch (memberError) {
          console.error(`[AssignMembersModal] ✗ Failed to assign ${member.clientName}:`, memberError);
          results.failed.push({ memberId, name: member.clientName, reason: memberError.message });
        }
      }

      console.log('[AssignMembersModal] Assignment complete. Succeeded:', results.succeeded.length, 'Failed:', results.failed.length);

      // Show results
      if (results.succeeded.length > 0) {
        toast.success(`Successfully assigned ${results.succeeded.length} member${results.succeeded.length > 1 ? 's' : ''} to ${className}`, {
          icon: <CheckCircle2 className="text-green-500" />,
          description: results.succeeded.join(', ')
        });
      }

      if (results.failed.length > 0) {
        console.error('[AssignMembersModal] Failed assignments:', results.failed);
        toast.error(`Failed to assign ${results.failed.length} member${results.failed.length > 1 ? 's' : ''}`, {
          description: results.failed.map(f => f.name || f.memberId).join(', ')
        });
      }

      setSelectedMembers([]);
      onOpenChange(false);
    } catch (error) {
      console.error('[AssignMembersModal] Bulk assignment error:', error);
      toast.error('Failed to assign members. Please try again.');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Assign Members to Class
          </DialogTitle>
          <DialogDescription>
            Select members to assign to <strong>{className}</strong>. Each member will have 1 session deducted.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : availableMembers.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No available members with sessions remaining</p>
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div className="flex-shrink-0 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Select All */}
            <div className="flex-shrink-0 flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-2">
                <Checkbox 
                  checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium text-slate-700">
                  {selectedMembers.length > 0 ? `${selectedMembers.length} selected` : 'Select all'}
                </span>
              </div>
              <span className="text-xs text-slate-500">
                {filteredMembers.length} of {availableMembers.length} members shown
              </span>
            </div>

            {/* Scrollable Member List */}
            <ScrollArea className="flex-1 min-h-0 max-h-[400px] pr-4">
              <div className="space-y-2 pb-2">
                {filteredMembers.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <p className="text-sm">No members found matching "{searchTerm}"</p>
                  </div>
                ) : (
                  filteredMembers.map(member => (
                    <div 
                      key={member.id}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer hover:bg-slate-50 ${
                        selectedMembers.includes(member.id) ? 'bg-primary/5 border-primary' : 'border-slate-200'
                      }`}
                      onClick={() => handleToggleMember(member.id)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Checkbox 
                          checked={selectedMembers.includes(member.id)}
                          onCheckedChange={() => handleToggleMember(member.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 truncate">{member.clientName}</p>
                          <p className="text-xs text-slate-500">
                            {member.unlimited ? 'Unlimited' : `${member.sessionsRemaining} sessions remaining`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </>
        )}

        <DialogFooter className="flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={assigning}>
            Cancel
          </Button>
          <Button 
            onClick={handleAssign} 
            disabled={selectedMembers.length === 0 || assigning}
          >
            {assigning ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Assigning...</>
            ) : (
              `Assign ${selectedMembers.length > 0 ? selectedMembers.length : ''} Member${selectedMembers.length !== 1 ? 's' : ''}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignMembersModal;
