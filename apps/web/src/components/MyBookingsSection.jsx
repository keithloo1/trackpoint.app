
import React, { useState, useEffect } from 'react';
import { format, parseISO, isPast, differenceInHours } from 'date-fns';
import { Calendar, Clock, XCircle, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const MyBookingsSection = ({ client }) => {
  const [myBookings, setMyBookings] = useState([]);
  const [policy, setPolicy] = useState('Allow cancellations anytime');
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchMyBookings = async () => {
    try {
      const bookingsRes = await pb.collection('class_bookings').getFullList({
        filter: `clientId="${client.id}"`,
        $autoCancel: false
      });

      // Try to fetch class details for each booking
      let classesRes = [];
      try {
        classesRes = await pb.collection('classes').getFullList({ $autoCancel: false });
      } catch (err) {
        console.warn('Could not fetch classes info directly (expected on unauth portal). Booking details might be limited.');
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

      const merged = bookingsRes.map(b => {
        const cls = classesRes.find(c => c.id === b.classId);
        return {
          ...b,
          classDetails: cls || { className: 'Unknown Class (Restricted)', classDate: new Date().toISOString(), classTime: '--:--' }
        };
      }).sort((a, b) => {
        if (!a.classDetails || !b.classDetails) return 0;
        return new Date(b.classDetails.classDate) - new Date(a.classDetails.classDate);
      });

      setMyBookings(merged);
    } catch (error) {
      console.error('Error fetching my bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();

    pb.collection('class_bookings').subscribe('*', () => fetchMyBookings());
    return () => pb.collection('class_bookings').unsubscribe('*');
  }, [client.id]);

  const handleCancelBooking = async (booking) => {
    const cls = booking.classDetails;
    if (cls && cls.classDate && cls.classTime) {
      const classDateTime = parseISO(`${cls.classDate.split('T')[0]}T${cls.classTime}:00`);
      const hoursUntilClass = differenceInHours(classDateTime, new Date());

      if (policy === 'Cannot cancel within 24 hours before class' && hoursUntilClass < 24) {
        toast.error('Cannot cancel within 24 hours before class');
        return;
      }
      if (policy === 'Cannot cancel within 1 hour before class' && hoursUntilClass < 1) {
        toast.error('Cannot cancel within 1 hour before class');
        return;
      }
    }

    if (!window.confirm('Are you sure you want to cancel this booking? 1 session will be refunded.')) return;
    
    setCancellingId(booking.id);
    try {
      // 1. Delete booking
      await pb.collection('class_bookings').delete(booking.id, { $autoCancel: false });

      // 2. Refund session and decrement attendance
      try {
        const clientRec = await pb.collection('clients').getOne(client.id, { $autoCancel: false });
        const newAttendance = Math.max(0, (clientRec.attendance_count || 0) - 1);

        if (client.unlimited) {
          await pb.collection('clients').update(client.id, {
            attendance_count: newAttendance
          }, { $autoCancel: false });
        } else {
          await pb.collection('clients').update(client.id, {
            sessionsRemaining: clientRec.sessionsRemaining + 1,
            attendance_count: newAttendance
          }, { $autoCancel: false });

          await pb.collection('history').create({
            clientId: client.id,
            actionType: 'addition',
            sessionsChanged: 1,
            actionDate: new Date().toISOString(),
            notes: `Class Cancellation: ${cls.className}`,
            userId: client.userId || ''
          }, { $autoCancel: false });
        }
      } catch (clientUpdateErr) {
        console.warn('Could not refund session automatically (unauth restriction):', clientUpdateErr);
      }

      toast.success('Booking cancelled successfully.');
      fetchMyBookings();
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      toast.error('Failed to cancel booking. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-slate-500 text-sm sm:text-base">Loading your bookings...</p>
      </div>
    );
  }

  if (myBookings.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border shadow-sm mx-2 sm:mx-0">
        <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg sm:text-xl font-bold text-slate-900">No Bookings Yet</h3>
        <p className="text-sm sm:text-base text-slate-500 mt-2 px-4">You haven't booked any classes. Head to 'Book Class' to get started!</p>
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

      <div className="space-y-3 sm:space-y-4">
        {myBookings.map(booking => {
          const cls = booking.classDetails;
          const classDateTime = cls ? parseISO(`${cls.classDate.split('T')[0]}T${cls.classTime}:00`) : new Date();
          const past = isPast(classDateTime);

          return (
            <Card key={booking.id} className={`overflow-hidden transition-all ${past ? 'opacity-70 bg-slate-50' : 'bg-white'}`}>
              <CardContent className="p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 truncate">{cls?.className}</h4>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3 mt-2 text-xs sm:text-sm text-slate-600 font-medium">
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-slate-400 shrink-0" /> 
                        {cls?.classDate ? format(parseISO(cls.classDate), 'MMM d, yyyy') : 'N/A'}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-slate-400 shrink-0" /> 
                        {cls?.classTime}
                      </span>
                    </div>
                  </div>
                  
                  {!past && (
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 h-11 sm:h-10 text-sm"
                      onClick={() => handleCancelBooking(booking)}
                      disabled={cancellingId === booking.id}
                    >
                      {cancellingId === booking.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <><XCircle className="w-4 h-4 mr-2" /> Cancel Booking</>
                      )}
                    </Button>
                  )}
                  {past && (
                    <span className="text-xs sm:text-sm font-semibold text-slate-400 bg-slate-200 px-3 py-1.5 rounded-full self-start sm:self-auto">
                      Completed
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MyBookingsSection;
