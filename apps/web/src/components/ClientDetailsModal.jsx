
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, User, History, Infinity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WeightTracker from './WeightTracker.jsx';
import RenewalModal from './RenewalModal.jsx';
import ClientNotesSection from './ClientNotesSection.jsx';
import { format, parseISO } from 'date-fns';
import pb from '@/lib/pocketbaseClient';

const ClientDetailsModal = ({ client, open, onOpenChange }) => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false);
  const [localClient, setLocalClient] = useState(client);

  useEffect(() => {
    if (open && client) {
      setLocalClient(client);
      fetchAttendance();
    }
  }, [open, client]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('class_bookings').getFullList({
        filter: `clientId="${client.id}"`,
        sort: '-created',
        expand: 'classId',
        $autoCancel: false
      });
      setAttendance(records);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRenewalComplete = () => {
    setIsRenewalModalOpen(false);
  };

  const handleNotesUpdate = (updatedClient) => {
    setLocalClient(prev => ({ ...prev, notes: updatedClient.notes }));
  };

  if (!localClient) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-slate-900">
              {localClient.name || localClient.clientName}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="overview" className="mt-4">
            <TabsList className="grid w-full grid-cols-3 bg-slate-100/80 p-1 rounded-xl">
              <TabsTrigger value="overview" className="rounded-lg data-[state=active]:shadow-sm"><User className="w-4 h-4 mr-2" /> Overview</TabsTrigger>
              <TabsTrigger value="history" className="rounded-lg data-[state=active]:shadow-sm"><History className="w-4 h-4 mr-2" /> Attendance</TabsTrigger>
              <TabsTrigger value="weight" className="rounded-lg data-[state=active]:shadow-sm"><Activity className="w-4 h-4 mr-2" /> Weight</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-sm text-slate-500 mb-1">Contact Info</p>
                  <p className="font-medium text-slate-900">{localClient.email || 'No email provided'}</p>
                  <p className="text-sm text-slate-600">{localClient.phone || 'No phone provided'}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-sm text-slate-500 mb-1">Membership</p>
                  <p className="font-medium capitalize text-slate-900">{localClient.memberStatus}</p>
                  {localClient.birthday && <p className="text-sm text-slate-600">Born: {format(new Date(localClient.birthday), 'MMM d, yyyy')}</p>}
                </div>
              </div>
              
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                <div>
                  <p className="text-sm text-slate-500 mb-2">Package Status</p>
                  {localClient.unlimited ? (
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-bold text-slate-900 flex items-center"><Infinity className="w-8 h-8 mr-2 text-blue-500" /> Unlimited</span>
                      <span className="text-lg text-slate-500 mb-1">({localClient.attendance_count} attended)</span>
                    </div>
                  ) : (
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-bold text-slate-900">{localClient.currentSessions}</span>
                      <span className="text-lg text-slate-500 mb-1">/ {localClient.packageSize} sessions</span>
                    </div>
                  )}
                  {localClient.expiryDate && (
                    <p className="text-sm text-slate-600 mt-2 font-medium">Expires: {format(new Date(localClient.expiryDate), 'MMM d, yyyy')}</p>
                  )}
                </div>
                
                <Button 
                  variant="outline" 
                  className="bg-white border-slate-300 hover:bg-slate-100 text-slate-900 w-full sm:w-auto rounded-xl shadow-sm" 
                  onClick={() => setIsRenewalModalOpen(true)}
                >
                  Process Early Renewal
                </Button>
              </div>

              <ClientNotesSection client={localClient} onUpdate={handleNotesUpdate} />
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-semibold text-slate-900">Class Attendance History</h3>
                </div>
                {loading ? (
                  <div className="p-8 text-center text-slate-500">Loading history...</div>
                ) : attendance.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {attendance.map(record => {
                      const cls = record.expand?.classId;
                      return (
                        <div key={record.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                          <div>
                            <p className="font-medium text-slate-900">{cls?.className || 'Unknown Class'}</p>
                            <p className="text-sm text-slate-500">
                              {cls ? `${format(parseISO(cls.classDate), 'MMM d, yyyy')} at ${cls.classTime}` : 'Date unknown'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-slate-500">Booked on</p>
                            <p className="text-sm font-medium text-slate-700">{format(parseISO(record.created), 'MMM d, h:mm a')}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500">No classes attended yet.</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="weight" className="mt-6">
              <WeightTracker clientId={localClient.id} userId={localClient.userId} readOnly={true} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      <RenewalModal 
        clientId={localClient?.id}
        clientName={localClient?.name || localClient?.clientName}
        currentExpiryDate={localClient?.expiryDate}
        open={isRenewalModalOpen} 
        onOpenChange={setIsRenewalModalOpen}
        onRenewalComplete={handleRenewalComplete}
      />
    </>
  );
};

export default ClientDetailsModal;
