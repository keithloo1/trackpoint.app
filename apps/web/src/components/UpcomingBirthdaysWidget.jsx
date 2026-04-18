
import React, { useState, useEffect } from 'react';
import { Cake, CalendarHeart, Loader2 } from 'lucide-react';
import { format, isSameMonth, differenceInYears, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/context/AuthContext.jsx';

const UpcomingBirthdaysWidget = () => {
  const { currentUser } = useAuth();
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBirthdays = async () => {
      if (!currentUser) return;
      try {
        const records = await pb.collection('clients').getFullList({
          filter: `userId="${currentUser.id}" && birthday != ""`,
          $autoCancel: false
        });

        const today = new Date();
        const currentMonthBirthdays = records
          .filter(client => {
            if (!client.birthday) return false;
            const bday = parseISO(client.birthday);
            return isSameMonth(bday, today);
          })
          .map(client => {
            const bday = parseISO(client.birthday);
            const ageTurning = differenceInYears(today, bday) + 1; // Age they are turning this year
            return {
              ...client,
              parsedBirthday: bday,
              ageTurning
            };
          })
          .sort((a, b) => a.parsedBirthday.getDate() - b.parsedBirthday.getDate());

        setBirthdays(currentMonthBirthdays);
      } catch (error) {
        console.error('Error fetching birthdays:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBirthdays();
  }, [currentUser]);

  if (loading) {
    return (
      <Card className="border-slate-200 shadow-sm h-full">
        <CardContent className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 shadow-sm h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <CalendarHeart className="w-5 h-5 text-pink-500" />
          Birthdays This Month
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto">
        {birthdays.length > 0 ? (
          <ul className="divide-y divide-slate-100">
            {birthdays.map((client) => (
              <li key={client.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 shrink-0">
                    <Cake className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{client.clientName || client.name}</p>
                    <p className="text-sm text-slate-500">{format(client.parsedBirthday, 'dd MMM')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                    Turning {client.ageTurning}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center text-slate-500">
            <Cake className="w-10 h-10 text-slate-200 mb-3" />
            <p className="font-medium text-slate-900">No birthdays this month</p>
            <p className="text-sm mt-1">Check back next month!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingBirthdaysWidget;
