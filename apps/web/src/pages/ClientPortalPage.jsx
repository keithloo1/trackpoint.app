
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { format, differenceInDays } from 'date-fns';
import { AlertCircle, Calendar as CalendarIcon, Clock, FileText, Activity, LayoutGrid, CalendarDays, CheckSquare, Loader2, Infinity, Package, Dumbbell, History as HistoryIcon, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import pb from '@/lib/pocketbaseClient';
import { generateInvoice } from '@/lib/InvoiceGenerator.js';
import { toast } from 'sonner';
import WeightTracker from '@/components/WeightTracker.jsx';
import ClassBookingCalendar from '@/components/ClassBookingCalendar.jsx';
import MyBookingsSection from '@/components/MyBookingsSection.jsx';
import ClientServicesPage from '@/components/ClientServicesPage.jsx';
import WorkoutBuilder from '@/components/WorkoutBuilder.jsx';

const ClientPortalPage = () => {
  const { clientId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [client, setClient] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingPdf, setGeneratingPdf] = useState(null);

  const defaultTab = searchParams.get('tab') || 'sessions';

  useEffect(() => {
    if (searchParams.get('payment_success') === 'true') {
      toast.success('Payment successful! Your sessions have been added.');
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('payment_success');
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const fetchPortalData = async () => {
    try {
      const clientData = await pb.collection('clients').getOne(clientId, { $autoCancel: false });
      setClient(clientData);

      const historyData = await pb.collection('history').getList(1, 100, {
        filter: `clientId="${clientId}"`,
        sort: '-actionDate',
        $autoCancel: false
      });
      setHistory(historyData.items);

    } catch (err) {
      console.error('Error fetching portal data:', err);
      setError('Portal Not Found or Access Denied');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clientId) {
      setLoading(true);
      fetchPortalData();
    }
    
    pb.collection('clients').subscribe(clientId, () => fetchPortalData());
    pb.collection('history').subscribe('*', (e) => {
      if (e.record.clientId === clientId) {
        fetchPortalData();
      }
    });

    return () => {
      pb.collection('clients').unsubscribe(clientId);
      pb.collection('history').unsubscribe('*');
    };
  }, [clientId]);

  const handleDownloadInvoice = async (item) => {
    try {
      setGeneratingPdf(item.id);
      await generateInvoice({
        clientName: client?.clientName,
        email: client?.email,
        phone: client?.phone,
        transactionDate: item.actionDate || item.created,
        sessions: Math.abs(item.sessionsChanged),
        amount: item.amount || 0,
        invoiceNumber: item.id.substring(0, 8).toUpperCase(),
        studioName: 'TRACKPOINT.APP Studio',
        paymentMethod: 'Online Payment',
        transactionId: item.id
      });
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      toast.error('Failed to generate invoice');
    } finally {
      setGeneratingPdf(null);
    }
  };

  const handleTabChange = (value) => {
    setSearchParams({ tab: value }, { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--portal-bg))]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-slate-200 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[hsl(var(--portal-bg))] px-4 text-center">
        <Helmet><title>Portal Not Found</title></Helmet>
        <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mb-4" />
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Portal Not Found</h1>
        <p className="text-sm sm:text-base text-slate-500 mb-6 max-w-md text-balance px-4">
          This secure link is invalid or you do not have permission to view it. Please contact your studio.
        </p>
      </div>
    );
  }

  const isUnlimited = client.unlimited;
  const currentSessions = client.sessionsRemaining || 0;
  const packageSize = client.totalSessions || 1;
  const percentage = packageSize > 0 ? Math.max(0, currentSessions / packageSize) : 0;
  
  const daysRemaining = client.expiryDate ? differenceInDays(new Date(client.expiryDate), new Date()) : 0;
  let expiryColorClass = 'bg-green-100 text-green-800 border-green-200';
  let expiryText = daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Expired';

  if (daysRemaining < 0 || daysRemaining < 7) {
    expiryColorClass = 'bg-red-100 text-red-800 border-red-200';
  } else if (daysRemaining <= 30) {
    expiryColorClass = 'bg-yellow-100 text-yellow-800 border-yellow-200';
  }
  
  let statusRing = 'ring-green-500/20 bg-green-500 text-green-700';
  let statusText = 'Looking Good';
  
  if (isUnlimited) {
    statusRing = 'ring-blue-500/20 bg-blue-500 text-blue-700';
    statusText = 'Unlimited';
  } else {
    if (currentSessions <= 0) {
      statusRing = 'ring-red-500/20 bg-red-500 text-red-700';
      statusText = 'No Sessions';
    } else if (percentage < 0.2) {
      statusRing = 'ring-red-500/20 bg-red-500 text-red-700';
      statusText = 'Low Balance';
    } else if (percentage <= 0.5) {
      statusRing = 'ring-yellow-500/20 bg-yellow-500 text-yellow-700';
      statusText = 'Halfway There';
    }
  }

  const lastDeduction = history.find(h => h.actionType === 'deduction');

  return (
    <div className="min-h-screen bg-[hsl(var(--portal-bg))] pb-12 overflow-x-hidden relative">
      <Helmet>
        <title>{client.clientName}'s Portal - TRACKPOINT</title>
      </Helmet>

      <div className="pt-8 sm:pt-16 px-3 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-4 sm:space-y-8">
        <div className="text-center space-y-1 sm:space-y-2">
          <h2 className="text-xs sm:text-sm font-bold tracking-widest text-primary uppercase">Client Portal</h2>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back, {client.clientName.split(' ')[0]}</h1>
        </div>

        <Tabs value={defaultTab} onValueChange={handleTabChange} className="w-full">
          <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-full mb-4 sm:mb-8 mx-auto overflow-hidden">
            <TabsList className="bg-transparent h-auto p-0 flex flex-nowrap overflow-x-auto no-scrollbar w-full justify-start lg:justify-center">
              <TabsTrigger value="sessions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 px-2.5 sm:px-4 rounded-lg shrink-0 whitespace-nowrap text-xs sm:text-base transition-colors">
                <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2 shrink-0" /> My Sessions
              </TabsTrigger>
              <TabsTrigger value="services" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 px-2.5 sm:px-4 rounded-lg shrink-0 whitespace-nowrap text-xs sm:text-base transition-colors">
                <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2 shrink-0" /> Services
              </TabsTrigger>
              <TabsTrigger value="book" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 px-2.5 sm:px-4 rounded-lg shrink-0 whitespace-nowrap text-xs sm:text-base transition-colors">
                <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2 shrink-0" /> Book Class
              </TabsTrigger>
              <TabsTrigger value="my-bookings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 px-2.5 sm:px-4 rounded-lg shrink-0 whitespace-nowrap text-xs sm:text-base transition-colors">
                <CheckSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2 shrink-0" /> My Bookings
              </TabsTrigger>
              <TabsTrigger value="workout" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 px-2.5 sm:px-4 rounded-lg shrink-0 whitespace-nowrap text-xs sm:text-base transition-colors">
                <Dumbbell className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2 shrink-0" /> Workout Builder
              </TabsTrigger>
              <TabsTrigger value="progress" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 px-2.5 sm:px-4 rounded-lg shrink-0 whitespace-nowrap text-xs sm:text-base transition-colors">
                <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2 shrink-0" /> Weight Tracker
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="sessions" className="mt-0 space-y-6 sm:space-y-8">
            <Card className="border-t-4 border-t-primary shadow-lg overflow-hidden relative max-w-4xl mx-auto">
              <CardContent className="p-4 sm:p-10">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8 text-center sm:text-left">
                  <div className="relative inline-flex items-center justify-center shrink-0">
                    <svg className="w-24 h-24 sm:w-32 sm:h-32 transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 sm:hidden" />
                      <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 hidden sm:block" />
                      <circle 
                        cx="48" cy="48" r="40" 
                        stroke="currentColor" 
                        strokeWidth="8" 
                        fill="transparent" 
                        strokeDasharray={251.32} 
                        strokeDashoffset={isUnlimited ? 0 : 251.32 - (percentage * 251.32)} 
                        className={`${statusRing.split(' ')[1]} transition-all duration-1000 ease-out sm:hidden`} 
                        strokeLinecap="round" 
                      />
                      <circle 
                        cx="64" cy="64" r="56" 
                        stroke="currentColor" 
                        strokeWidth="8" 
                        fill="transparent" 
                        strokeDasharray={351.85} 
                        strokeDashoffset={isUnlimited ? 0 : 351.85 - (percentage * 351.85)} 
                        className={`${statusRing.split(' ')[1]} transition-all duration-1000 ease-out hidden sm:block`} 
                        strokeLinecap="round" 
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      {isUnlimited ? (
                        <Infinity className="w-8 h-8 sm:w-12 sm:h-12 text-slate-900" />
                      ) : (
                        <span className="text-xl sm:text-3xl font-extrabold text-slate-900">{currentSessions}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 space-y-3 sm:space-y-4 w-full">
                    <div>
                      <div className="flex flex-col items-center sm:items-start gap-2 sm:gap-4">
                        <div className="w-full">
                          <h2 className="text-lg sm:text-2xl font-bold text-slate-900">{client.clientName}</h2>
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset ${statusRing.split(' ')[0]} ${statusRing.split(' ')[2]}`}>
                              {statusText}
                            </span>
                            <Badge variant={client.memberStatus === 'member' ? 'default' : 'secondary'} className={`text-xs ${client.memberStatus === 'member' ? 'bg-green-600' : ''}`}>
                              {client.memberStatus === 'member' ? 'Member' : 'Non-Member'}
                            </Badge>
                          </div>
                          {isUnlimited && (
                            <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">Attended: {client.attendance_count || 0} classes</p>
                          )}
                        </div>
                      </div>
                      
                      {client.expiryDate && (
                        <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row flex-wrap items-center sm:items-start gap-2 sm:gap-3 w-full">
                          <Badge variant="outline" className={`${expiryColorClass} w-full sm:w-auto justify-center sm:justify-start py-1.5 sm:py-0.5 text-xs`}>
                            <CalendarIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 shrink-0" />
                            <span className="truncate">Expires: {format(new Date(client.expiryDate), 'MMM d')} ({expiryText})</span>
                          </Badge>
                          
                          {lastDeduction && !isUnlimited && (
                            <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 w-full sm:w-auto justify-center sm:justify-start py-1.5 sm:py-0.5 text-xs">
                              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 shrink-0" />
                              <span className="truncate">Last session: {format(new Date(lastDeduction.actionDate), 'MMM d')}</span>
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment & Session History Section */}
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden max-w-4xl mx-auto mt-6 sm:mt-8">
              <div className="p-3 sm:p-6 border-b bg-slate-50">
                <h3 className="text-sm sm:text-lg font-bold text-slate-900 flex items-center">
                  <HistoryIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 shrink-0 text-slate-500" /> Session & Payment History
                </h3>
              </div>
              <div className="overflow-x-auto w-full">
                <Table className="w-full">
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead className="py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">Date</TableHead>
                      <TableHead className="py-2 sm:py-4 text-xs sm:text-sm">Type</TableHead>
                      <TableHead className="py-2 sm:py-4 text-xs sm:text-sm">Details</TableHead>
                      <TableHead className="py-2 sm:py-4 text-right text-xs sm:text-sm">Amount</TableHead>
                      <TableHead className="py-2 sm:py-4 text-center text-xs sm:text-sm">Invoice</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.length > 0 ? (
                      history.map((item) => {
                        const dateStr = format(new Date(item.actionDate || item.created), 'dd MMM yyyy');
                        const isPayment = item.actionType === 'renewal' || item.actionType === 'addition';
                        const hasAmount = item.amount > 0;
                        
                        return (
                          <TableRow key={item.id} className="hover:bg-slate-50/50 text-xs sm:text-sm">
                            <TableCell className="font-medium whitespace-nowrap py-2 sm:py-3">
                              {dateStr}
                            </TableCell>
                            <TableCell className="py-2 sm:py-3">
                              <Badge variant="outline" className={`capitalize text-[10px] sm:text-xs py-0 ${
                                item.actionType === 'deduction' ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                                item.actionType === 'renewal' ? 'bg-green-50 text-green-700 border-green-200' : 
                                'bg-blue-50 text-blue-700 border-blue-200'
                              }`}>
                                {item.actionType}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-2 sm:py-3">
                              <div className="font-medium text-slate-900">
                                {item.sessionsChanged > 0 ? `+${item.sessionsChanged}` : item.sessionsChanged} sessions
                              </div>
                              {item.notes && (
                                <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 truncate max-w-[120px] sm:max-w-[250px]">
                                  {item.notes}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-right font-semibold text-slate-900 whitespace-nowrap py-2 sm:py-3">
                              {hasAmount ? `RM ${parseFloat(item.amount).toFixed(2)}` : '-'}
                            </TableCell>
                            <TableCell className="text-center py-2 sm:py-3">
                              {isPayment && hasAmount ? (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDownloadInvoice(item)} 
                                  className="h-7 sm:h-8 px-2 text-primary hover:bg-primary/10" 
                                  disabled={generatingPdf === item.id}
                                >
                                  {generatingPdf === item.id ? (
                                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                                  ) : (
                                    <><Download className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1 shrink-0" /> <span className="hidden sm:inline">PDF</span></>
                                  )}
                                </Button>
                              ) : (
                                <span className="text-slate-300">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 sm:h-32 text-center text-xs sm:text-sm text-slate-500">No history available.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="services" className="mt-0">
            <ClientServicesPage client={client} />
          </TabsContent>

          <TabsContent value="book" className="mt-0">
            <ClassBookingCalendar client={client} />
          </TabsContent>

          <TabsContent value="my-bookings" className="mt-0">
            <MyBookingsSection client={client} />
          </TabsContent>

          <TabsContent value="workout" className="mt-0">
            <WorkoutBuilder />
          </TabsContent>

          <TabsContent value="progress" className="mt-0">
            <WeightTracker clientId={client.id} userId={client.userId} readOnly={false} />
          </TabsContent>
        </Tabs>

        <div className="text-center pt-4 sm:pt-8 border-t border-slate-200 pb-4">
          <p className="text-xs sm:text-sm text-slate-400">Powered securely by TRACKPOINT.APP</p>
        </div>
      </div>
    </div>
  );
};

export default ClientPortalPage;
