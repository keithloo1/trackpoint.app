
import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, Users, Download, Plus, Trash2, Loader2, CheckCircle2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/context/AuthContext.jsx';
import CreateClassModal from './CreateClassModal.jsx';
import AssignMembersModal from './AssignMembersModal.jsx';

const ClassManagement = () => {
  const { currentUser } = useAuth();
  const [classes, setClasses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendanceState, setAttendanceState] = useState({});
  const [confirmingClass, setConfirmingClass] = useState(null);

  const fetchData = async () => {
    if (!currentUser) return;
    try {
      const [classesRes, bookingsRes, clientsRes] = await Promise.all([
        pb.collection('classes').getFullList({ sort: 'classDate,classTime', $autoCancel: false }),
        pb.collection('class_bookings').getFullList({ $autoCancel: false }),
        pb.collection('clients').getFullList({ $autoCancel: false })
      ]);
      setClasses(classesRes);
      setBookings(bookingsRes);
      setClients(clientsRes);

      // Initialize attendance state - UNCHECKED by default (false)
      const initialState = {};
      bookingsRes.forEach(booking => {
        initialState[booking.id] = booking.attended || false;
      });
      setAttendanceState(initialState);
    } catch (error) {
      console.error('Error fetching class data:', error);
      toast.error('Failed to load classes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    pb.collection('classes').subscribe('*', () => fetchData());
    pb.collection('class_bookings').subscribe('*', () => fetchData());

    return () => {
      pb.collection('classes').unsubscribe('*');
      pb.collection('class_bookings').unsubscribe('*');
    };
  }, [currentUser]);

  const handleDeleteClass = async (classId) => {
    if (!window.confirm('Are you sure you want to delete this class? Bookings will also be removed.')) return;
    try {
      await pb.collection('classes').delete(classId, { $autoCancel: false });
      toast.success('Class deleted successfully');
    } catch (err) {
      toast.error('Failed to delete class');
    }
  };

  const handleAttendanceToggle = (bookingId) => {
    setAttendanceState(prev => ({
      ...prev,
      [bookingId]: !prev[bookingId]
    }));
  };

  const handleConfirmAttendance = async (classId, classBookings) => {
    try {
      setConfirmingClass(classId);

      // Process each booking
      for (const booking of classBookings) {
        const attended = attendanceState[booking.id];
        const client = clients.find(c => c.id === booking.clientId);
        
        if (!client) continue;

        // If checkbox is UNCHECKED (no-show), refund 1 session
        if (!attended && !booking.attendance_confirmed) {
          if (!client.unlimited) {
            await pb.collection('clients').update(booking.clientId, {
              sessionsRemaining: client.sessionsRemaining + 1
            }, { $autoCancel: false });

            // Create history record for refund
            await pb.collection('history').create({
              clientId: booking.clientId,
              actionType: 'addition',
              sessionsChanged: 1,
              actionDate: new Date().toISOString(),
              notes: `Session refund - No-show for class`,
              userId: currentUser.id
            }, { $autoCancel: false });
          }
        }

        // Update booking attendance status
        try {
          await pb.collection('class_bookings').update(booking.id, {
            attended: attended,
            attendance_confirmed: true
          }, { $autoCancel: false });
        } catch (err) {
          console.warn('Could not update attendance fields:', err);
        }
      }

      toast.success('Attendance confirmed successfully!');
      await fetchData();
    } catch (error) {
      console.error('Error confirming attendance:', error);
      toast.error('Failed to confirm attendance. Please try again.');
    } finally {
      setConfirmingClass(null);
    }
  };

  const handleExportCSV = (cls, classBookings) => {
    const header = ['Class Name', 'Date', 'Time', 'Client Name', 'Booking Date', 'Attended'];
    const rows = classBookings.map(b => {
      const client = clients.find(c => c.id === b.clientId);
      const attended = attendanceState[b.id] ? 'Yes' : 'No';
      return [
        `"${cls.className}"`,
        format(parseISO(cls.classDate), 'yyyy-MM-dd'),
        cls.classTime,
        `"${client?.clientName || 'Unknown Client'}"`,
        format(parseISO(b.created), 'yyyy-MM-dd HH:mm'),
        attended
      ].join(',');
    });

    const csvContent = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${cls.className.replace(/\s+/g, '_')}_attendance.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenAssignModal = (cls) => {
    setSelectedClass(cls);
    setIsAssignModalOpen(true);
  };

  const handleCloseAssignModal = () => {
    setIsAssignModalOpen(false);
    setSelectedClass(null);
    fetchData(); // Refresh data after assigning members
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-slate-500">Loading class schedule...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Class Schedule</h2>
          <p className="text-sm text-slate-500">Manage your classes and view attendees.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> New Class
        </Button>
      </div>

      {classes.length === 0 ? (
        <Card className="border-dashed shadow-none bg-slate-50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No classes scheduled</h3>
            <p className="text-slate-500 mt-2 max-w-md">Create your first class to allow clients to book sessions through their portal.</p>
            <Button onClick={() => setIsCreateModalOpen(true)} className="mt-6">
              <Plus className="w-4 h-4 mr-2" /> Create First Class
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {classes.map(cls => {
            const classBookings = bookings.filter(b => b.classId === cls.id);
            const isFull = classBookings.length >= cls.capacity;
            const allConfirmed = classBookings.every(b => b.attendance_confirmed);
            
            const bookedClients = classBookings.map(b => clients.find(c => c.id === b.clientId) || { clientName: 'Unknown' });
            const firstNames = bookedClients.map(c => c.clientName.split(' ')[0]).join(', ');
            const capacityText = `${classBookings.length}/${cls.capacity}${firstNames ? ` - ${firstNames}` : ''}`;
            
            return (
              <Card key={cls.id} className="overflow-hidden border-slate-200 shadow-sm flex flex-col">
                <CardHeader className="bg-slate-50 border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900">{cls.className}</CardTitle>
                      <CardDescription className="mt-1.5 flex items-center gap-2 text-slate-600">
                        <Calendar className="w-4 h-4" />
                        {format(parseISO(cls.classDate), 'EEEE, MMM d, yyyy')} at {cls.classTime}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 max-w-[50%]">
                      <Badge variant="outline" className={`font-semibold truncate max-w-full ${isFull ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`} title={capacityText}>
                        <span className="truncate">{capacityText}</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex-1 flex flex-col">
                  {classBookings.length > 0 ? (
                    <div className="flex-1">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50/50">
                            <TableHead className="w-12">
                              <span className="sr-only">Attended</span>
                            </TableHead>
                            <TableHead className="w-[50%]">Client Name</TableHead>
                            <TableHead>Booked On</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {classBookings.map(b => {
                            const client = clients.find(c => c.id === b.clientId);
                            const isConfirmed = b.attendance_confirmed;
                            const attended = attendanceState[b.id];
                            return (
                              <TableRow key={b.id}>
                                <TableCell>
                                  <Checkbox
                                    checked={attended || false}
                                    onCheckedChange={() => handleAttendanceToggle(b.id)}
                                    disabled={isConfirmed}
                                    className="cursor-pointer"
                                  />
                                </TableCell>
                                <TableCell className={`font-medium ${attended && isConfirmed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                                  {client ? client.clientName : <span className="text-slate-400">Unknown</span>}
                                  {isConfirmed && (
                                    <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700 border-green-200">
                                      Confirmed
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-slate-500 text-sm">
                                  {format(parseISO(b.created), 'MMM d, h:mm a')}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-8 text-slate-500">
                      <Users className="w-8 h-8 mb-2 opacity-20" />
                      <p>No bookings yet</p>
                    </div>
                  )}
                  
                  <div className="p-4 border-t bg-slate-50 flex items-center justify-between mt-auto flex-wrap gap-2">
                    <div className="flex gap-2 flex-wrap">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleOpenAssignModal(cls)}
                        className="bg-white"
                      >
                        <UserPlus className="w-4 h-4 mr-2" /> Assign Members
                      </Button>
                      {classBookings.length > 0 && !allConfirmed && (
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={() => handleConfirmAttendance(cls.id, classBookings)}
                          disabled={confirmingClass === cls.id}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {confirmingClass === cls.id ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Confirming...</>
                          ) : (
                            <><CheckCircle2 className="w-4 h-4 mr-2" /> Confirm Attendance</>
                          )}
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => handleExportCSV(cls, classBookings)} disabled={classBookings.length === 0} className="bg-white">
                        <Download className="w-4 h-4 mr-2" /> Export CSV
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteClass(cls.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <CreateClassModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
      
      {selectedClass && (
        <AssignMembersModal 
          open={isAssignModalOpen} 
          onOpenChange={handleCloseAssignModal}
          classId={selectedClass.id}
          className={selectedClass.className}
        />
      )}
    </div>
  );
};

export default ClassManagement;
