
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format } from 'date-fns';
import { Activity, Plus, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import DatePicker from './DatePicker.jsx';

const WeightTracker = ({ clientId, userId, readOnly = false }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchEntries();
  }, [clientId]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('weight_entries').getFullList({
        filter: `clientId="${clientId}"`,
        sort: 'entryDate',
        $autoCancel: false
      });
      setEntries(records);
    } catch (err) {
      console.error('Error fetching weight entries:', err);
      toast.error('Failed to load weight history');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!weight || !date) return;

    setSubmitting(true);
    try {
      await pb.collection('weight_entries').create({
        clientId,
        userId: userId || pb.authStore.model?.id,
        weight: parseFloat(weight),
        entryDate: date.toISOString(),
        notes
      }, { $autoCancel: false });
      
      toast.success('Weight entry added');
      setWeight('');
      setNotes('');
      fetchEntries();
    } catch (err) {
      toast.error('Failed to add entry');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await pb.collection('weight_entries').delete(id, { $autoCancel: false });
      toast.success('Entry deleted');
      fetchEntries();
    } catch (err) {
      toast.error('Failed to delete entry');
    }
  };

  const chartData = entries.map(e => ({
    date: format(new Date(e.entryDate), 'MMM d'),
    weight: e.weight
  }));

  const firstWeight = entries.length > 0 ? entries[0].weight : 0;
  const lastWeight = entries.length > 0 ? entries[entries.length - 1].weight : 0;
  const weightChange = lastWeight - firstWeight;
  const changeText = weightChange > 0 ? `+${weightChange.toFixed(1)} kg` : `${weightChange.toFixed(1)} kg`;

  if (loading) {
    return <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="grid grid-cols-1 gap-4">
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary" /> Progress Chart
            </CardTitle>
          </CardHeader>
          <CardContent>
            {entries.length > 1 ? (
              <div className="h-48 sm:h-64 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis domain={['auto', 'auto']} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                      labelStyle={{ color: '#64748b', fontWeight: 500, marginBottom: '4px' }}
                    />
                    <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-48 sm:h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed rounded-lg mt-4">
                <Activity className="w-6 h-6 sm:w-8 sm:h-8 mb-2 opacity-50" />
                <p className="text-xs sm:text-sm">Not enough data for chart</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 pt-4">
            <div className="flex justify-between items-end border-b pb-2 sm:pb-3">
              <span className="text-xs sm:text-sm text-slate-500">Current</span>
              <span className="text-xl sm:text-2xl font-bold text-slate-900">{lastWeight > 0 ? `${lastWeight} kg` : '--'}</span>
            </div>
            <div className="flex justify-between items-end border-b pb-2 sm:pb-3">
              <span className="text-xs sm:text-sm text-slate-500">Start</span>
              <span className="text-base sm:text-lg font-medium text-slate-700">{firstWeight > 0 ? `${firstWeight} kg` : '--'}</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-xs sm:text-sm text-slate-500">Change</span>
              <span className={`text-base sm:text-lg font-bold ${weightChange > 0 ? 'text-red-500' : weightChange < 0 ? 'text-green-500' : 'text-slate-500'}`}>
                {entries.length > 1 ? changeText : '--'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base sm:text-lg">History</CardTitle>
        </CardHeader>
        <CardContent>
          {!readOnly && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6 p-4 bg-slate-50 rounded-lg border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="weight" className="text-xs sm:text-sm">Weight (kg)</Label>
                  <Input id="weight" type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} required placeholder="e.g. 75.5" className="h-11 sm:h-10 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="date" className="text-xs sm:text-sm">Date</Label>
                  <DatePicker value={date} onChange={setDate} placeholder="Select date" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="notes" className="text-xs sm:text-sm">Notes (Optional)</Label>
                <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="How do you feel?" className="h-11 sm:h-10 text-sm" />
              </div>
              <Button type="submit" disabled={submitting || !date} className="w-full h-11 sm:h-10 text-sm">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4 mr-2" /> Add</>}
              </Button>
            </form>
          )}

          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Date</TableHead>
                    <TableHead className="text-xs sm:text-sm">Weight</TableHead>
                    <TableHead className="hidden sm:table-cell text-xs sm:text-sm">Notes</TableHead>
                    {!readOnly && <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.length > 0 ? (
                    [...entries].reverse().map(e => (
                      <TableRow key={e.id}>
                        <TableCell className="font-medium text-slate-900 text-xs sm:text-sm">{format(new Date(e.entryDate), 'MMM d, yyyy')}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{e.weight} kg</TableCell>
                        <TableCell className="hidden sm:table-cell text-slate-500 text-xs sm:text-sm">{e.notes || '-'}</TableCell>
                        {!readOnly && (
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(e.id)} className="h-8 w-8 text-slate-400 hover:text-red-500">
                              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={readOnly ? 3 : 4} className="text-center py-8 text-slate-500 text-xs sm:text-sm">
                        No weight entries recorded yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeightTracker;
