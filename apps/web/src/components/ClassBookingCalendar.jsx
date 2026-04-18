
import React, { useState, useEffect } from 'react';
import { format, parseISO, isPast } from 'date-fns';
import { Calendar, Clock, Users, CheckCircle2, AlertCircle, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const ClassBookingCalendar = ({ client }) => {
  const [classes, setClasses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [policy, setPolicy] = useState('Allow cancellations anytime');
  const [loading, setLoading] = useState(true);
  const [bookingInProgress, setBookingInProgress] = useState(null);

  const fetchData = async () => {
    try {
      let classesRes = [];
      try {
        classesRes = await pb.collection('classes').getFullList({ sort: 'classDate,classTime', $autoCancel: false });
      } catch (err) {
        console.warn('Classes fetch issue (expected if public mode restriction):', err);
      }

      const bookingsRes = await pb.collection('class_bookings').getFullList({ $autoCancel: false });
      
      let clientsRes = [];
      try {
        clientsRes = await pb.collection('clients').getFullList({ $autoCancel: false });
      } catch (err) {
        console.warn('Clients fetch issue (expected if public mode restriction):', err);
      }

      // Fetch policy
      try {
        if (client?.userId) {
          const settingsRes = await pb.collection('settings').getFullList({
            filter: `ownerId="${client.userId}"`,
            $autoCancel: false
          });
          if (settingsRes.length > 0 && settingsRes[0].cancellation_policy) {
            setPolicy(settingsRes[0].cancellation_policy);
          }
        }
      } catch (err) {
        console.warn('Could not fetch settings policy:', err);
      }
      
      const upcomingClasses = classesRes.filter(c => {
        const classDateTime = parseISO(`${c.classDate.split('T')[0]}T${c.classTime}:00`);
        return !isPast(classDateTime);
      });
      
      setClasses(upcomingClasses);
      setBookings(bookingsRes);
      setAllClients(clientsRes);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      toast.error('Failed to load schedule');
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
  }, []);

  const handleBookClass = async (cls) => {
    setBookingInProgress(cls.id);
    
    console.log(`[ClassBookingCalendar] Starting booking for class ${cls.className} (${cls.id})`);
    console.log(`[ClassBookingCalendar] Client ID: ${client.id}`);
    
    try {
      // Step 1: Fetch current client data to get latest sessionsRemaining
      console.log(`[ClassBookingCalendar] Step 1: Fetching current client data...`);
      const currentClient = await pb.collection('clients').getOne(client.id, { $autoCancel: false });
      console.log(`[ClassBookingCalendar] Current client data:`, {
        id: currentClient.id,
        name: currentClient.clientName,
        sessionsRemaining: currentClient.sessionsRemaining,
        unlimited: currentClient.unlimited,
        attendance_count: currentClient.attendance_count
      });
      
      // Step 2: Check if client has sessions
      if (!currentClient.unlimited && currentClient.sessionsRemaining <= 0) {
        console.log(`[ClassBookingCalendar] Client has 0 sessions remaining - cannot book`);
        toast.warning('You have 0 sessions remaining. Please purchase a package.', {
          duration: 5000,
          icon: <AlertCircle className="text-yellow-500" />
        });
        setBookingInProgress(null);
        return;
      }

      // Step 3: Create booking
      console.log(`[ClassBookingCalendar] Step 3: Creating class booking...`);
      const booking = await pb.collection('class_bookings').create({
        classId: cls.id,
        clientId: client.id,
        attended: false
      }, { $autoCancel: false });
      console.log(`[ClassBookingCalendar] Booking created successfully:`, booking);

      // Step 4: Deduct session and create history record
      if (currentClient.unlimited) {
        console.log(`[ClassBookingCalendar] Step 4a: Processing unlimited member...`);
        const newAttendanceCount = (currentClient.attendance_count || 0) + 1;
        
        await pb.collection('clients').update(client.id, {
          attendance_count: newAttendanceCount
        }, { $autoCancel: false });
        console.log(`[ClassBookingCalendar] Updated attendance count: ${currentClient.attendance_count} -> ${newAttendanceCount}`);

        // Create history record for unlimited
        await pb.collection('history').create({
          clientId: client.id,
          actionType: 'deduction',
          sessionsChanged: 0,
          actionDate: new Date().toISOString(),
          notes: `Class Booking: ${cls.className}`,
          userId: client.userId || '',
          paymentStatus: 'paid'
        }, { $autoCancel: false });
        console.log(`[ClassBookingCalendar] Created history record for unlimited member`);

        // Step 5: Verify the update persisted
        const verifyClient = await pb.collection('clients').getOne(client.id, { $autoCancel: false });
        console.log(`[ClassBookingCalendar] Step 5: Verified client data after update:`, {
          attendance_count: verifyClient.attendance_count
        });

        // Show success toast
        toast.success('Class booked successfully!', {
          icon: <CheckCircle2 className="text-green-500" />
        });
      } else {
        console.log(`[ClassBookingCalendar] Step 4b: Processing limited member...`);
        
        // Step 4b-1: Calculate new sessions remaining
        const newSessionsRemaining = currentClient.sessionsRemaining - 1;
        console.log(`[ClassBookingCalendar] Calculating new sessions: ${currentClient.sessionsRemaining} - 1 = ${newSessionsRemaining}`);
        
        // Step 4b-2: Update client record in database
        console.log(`[ClassBookingCalendar] Updating client record with new sessionsRemaining...`);
        await pb.collection('clients').update(client.id, {
          sessionsRemaining: newSessionsRemaining,
          attendance_count: (currentClient.attendance_count || 0) + 1
        }, { $autoCancel: false });
        console.log(`[ClassBookingCalendar] Client record updated successfully`);

        // Step 4b-3: Create history record
        console.log(`[ClassBookingCalendar] Creating history record...`);
        await pb.collection('history').create({
          clientId: client.id,
          actionType: 'deduction',
          sessionsChanged: -1,
          actionDate: new Date().toISOString(),
          notes: `Class Booking: ${cls.className}`,
          userId: client.userId || '',
          paymentStatus: 'paid'
        }, { $autoCancel: false });
        console.log(`[ClassBookingCalendar] History record created successfully`);

        // Step 5: Verify the update persisted
        console.log(`[ClassBookingCalendar] Step 5: Verifying database update...`);
        const verifyClient = await pb.collection('clients').getOne(client.id, { $autoCancel: false });
        console.log(`[ClassBookingCalendar] Verified client data after update:`, {
          sessionsRemaining: verifyClient.sessionsRemaining,
          expectedValue: newSessionsRemaining,
          updateSuccessful: verifyClient.sessionsRemaining === newSessionsRemaining
        });

        if (verifyClient.sessionsRemaining !== newSessionsRemaining) {
          console.error(`[ClassBookingCalendar] WARNING: Database update verification failed! Expected ${newSessionsRemaining}, got ${verifyClient.sessionsRemaining}`);
        }

        // Show success toast with updated count
        toast.success(`Class booked successfully! 1 session deducted. ${newSessionsRemaining} sessions remaining.`, {
          icon: <CheckCircle2 className="text-green-500" />
        });
      }

      console.log(`[ClassBookingCalendar] All operations completed successfully`);
      
    } catch (err) {
      console.error('[ClassBookingCalendar] Booking error:', err);
      
      // Only show error toast - booking actually failed
      toast.error('Failed to book class. Please try again.', {
        description: err.message || 'An unexpected error occurred'
      });
    } finally {
      setBookingInProgress(null);
      
      // Step 6: Refresh data to update UI
      console.log(`[ClassBookingCalendar] Step 6: Refreshing data...`);
      try {
        await fetchData();
        console.log(`[ClassBookingCalendar] Data refreshed successfully`);
      } catch (refreshErr) {
        console.warn('[ClassBookingCalendar] Failed to refresh data after booking:', refreshErr);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-slate-500 text-sm sm:text-base">Loading available classes...</p>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border shadow-sm mx-2 sm:mx-0">
        <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg sm:text-xl font-bold text-slate-900">No Upcoming Classes</h3>
        <p className="text-sm sm:text-base text-slate-500 mt-2 px-4">Check back later for new schedule updates.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {policy !== 'Allow cancellations anytime' && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-3 text-blue-800 text-xs sm:text-sm">
          <Info className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block mb-0.5">Cancellation Policy</strong>
            {policy}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {classes.map(cls => {
          const classBookings = bookings.filter(b => b.classId === cls.id);
          const bookedCount = classBookings.length;
          const isFull = bookedCount >= cls.capacity;
          const hasClientBooked = classBookings.some(b => b.clientId === client.id);
          
          const bookedClients = classBookings.map(b => allClients.find(c => c.id === b.clientId) || { clientName: 'Unknown', unlimited: false });
          const firstNames = bookedClients.map(c => `${c.clientName.split(' ')[0]}${c.unlimited ? ' (U)' : ''}`).join(', ');
          const capacityText = `${bookedCount}/${cls.capacity}${firstNames ? ` - ${firstNames}` : ''}`;
          
          let statusClass = 'bg-[hsl(var(--calendar-available-bg))] text-[hsl(var(--calendar-available))] ring-[hsl(var(--calendar-available))/0.2]';
          let statusText = 'Available';
          
          if (hasClientBooked) {
            statusClass = 'bg-[hsl(var(--calendar-booked-bg))] text-[hsl(var(--calendar-booked))] ring-[hsl(var(--calendar-booked))/0.2]';
            statusText = 'Booked';
          } else if (isFull) {
            statusClass = 'bg-[hsl(var(--calendar-full-bg))] text-[hsl(var(--calendar-full))] ring-[hsl(var(--calendar-full))/0.2]';
            statusText = 'Full';
          }

          return (
            <Card key={cls.id} className="overflow-hidden border-slate-200 transition-all hover:shadow-md">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 truncate">{cls.className}</h3>
                    <div className="flex flex-col gap-1.5">
                      <span className="inline-flex items-center text-xs sm:text-sm font-medium text-slate-600">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-slate-400 shrink-0" />
                        <span className="truncate">{format(parseISO(cls.classDate), 'EEEE, MMM d, yyyy')}</span>
                      </span>
                      <span className="inline-flex items-center text-xs sm:text-sm font-medium text-slate-600">
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-slate-400 shrink-0" />
                        {cls.classTime}
                      </span>
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${statusClass} animate-capacity-pulse shrink-0 self-start sm:self-auto`}>
                    {statusText}
                  </div>
                </div>
                
                {cls.description && (
                  <p className="text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4 line-clamp-2">{cls.description}</p>
                )}

                <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center text-xs sm:text-sm font-medium text-slate-700 truncate" title={capacityText}>
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-slate-400 shrink-0" />
                    <span className="truncate">{capacityText}</span>
                  </div>
                  
                  <Button 
                    onClick={() => handleBookClass(cls)} 
                    disabled={isFull || hasClientBooked || bookingInProgress === cls.id}
                    className={`w-full sm:w-auto shrink-0 h-11 sm:h-10 text-sm ${hasClientBooked ? "bg-slate-100 text-slate-500 hover:bg-slate-100" : ""}`}
                    variant={hasClientBooked ? "secondary" : "default"}
                  >
                    {bookingInProgress === cls.id ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing</>
                    ) : hasClientBooked ? (
                      <><CheckCircle2 className="w-4 h-4 mr-2" /> Joined</>
                    ) : isFull ? (
                      'Class Full'
                    ) : (
                      'Book Class'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ClassBookingCalendar;
