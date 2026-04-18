
import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Receipt, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import { formatMYR } from '@/lib/utils.js';
import { generateInvoice } from '@/lib/InvoiceGenerator.js';

const PurchaseHistorySection = ({ clientId }) => {
  const [purchases, setPurchases] = useState([]);
  const [services, setServices] = useState({});
  const [clientDetails, setClientDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingPdf, setGeneratingPdf] = useState(null);

  const fetchHistory = useCallback(async () => {
    if (!clientId) return;
    try {
      setLoading(true);
      
      // Fetch client details for invoice generation
      const clientData = await pb.collection('clients').getOne(clientId, { $autoCancel: false });
      setClientDetails(clientData);

      const records = await pb.collection('purchases').getList(1, 50, {
        filter: `client_id="${clientId}"`,
        sort: '-purchase_date',
        $autoCancel: false
      });
      
      // Fetch related service names
      const serviceIds = [...new Set(records.items.map(r => r.service_id))];
      const servicesMap = {};
      
      if (serviceIds.length > 0) {
        const servicesFilter = serviceIds.map(id => `id="${id}"`).join(' || ');
        const servicesData = await pb.collection('services').getFullList({
          filter: servicesFilter,
          $autoCancel: false
        });
        servicesData.forEach(s => {
          servicesMap[s.id] = s.name;
        });
      }
      
      // Fallback for packages if it's a package purchase
      const packageData = await pb.collection('packages').getFullList({ $autoCancel: false });
      packageData.forEach(p => {
        if (!servicesMap[p.id]) servicesMap[p.id] = p.packageName;
      });
      
      setServices(servicesMap);
      setPurchases(records.items);
    } catch (error) {
      console.error('Error fetching purchase history:', error);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleDownloadInvoice = async (purchase) => {
    try {
      setGeneratingPdf(purchase.id);
      await generateInvoice({
        clientName: clientDetails?.clientName,
        email: clientDetails?.email,
        phone: clientDetails?.phone,
        transactionDate: purchase.purchase_date,
        paymentTime: null,
        sessions: purchase.sessions_remaining,
        amount: purchase.price_paid,
        invoiceNumber: purchase.id.substring(0, 8).toUpperCase()
      });
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Invoice generation error:', error);
      toast.error('Failed to generate invoice');
    } finally {
      setGeneratingPdf(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8 sm:py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 bg-white rounded-xl border border-dashed border-slate-300 mx-2 sm:mx-0">
        <Receipt className="w-8 h-8 sm:w-10 sm:h-10 text-slate-300 mx-auto mb-3" />
        <h3 className="text-sm sm:text-base font-semibold text-slate-900">No purchase history</h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 px-4">You haven't purchased any packages yet.</p>
      </div>
    );
  }

  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden mx-2 sm:mx-0">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="py-3 sm:py-4 text-xs sm:text-sm">Purchase Date</TableHead>
                <TableHead className="py-3 sm:py-4 text-xs sm:text-sm">Service Name</TableHead>
                <TableHead className="py-3 sm:py-4 text-xs sm:text-sm">Sessions</TableHead>
                <TableHead className="py-3 sm:py-4 text-xs sm:text-sm">Status</TableHead>
                <TableHead className="py-3 sm:py-4 text-right text-xs sm:text-sm">Amount Paid</TableHead>
                <TableHead className="py-3 sm:py-4 text-center text-xs sm:text-sm">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.map(purchase => {
                const isPaid = purchase.stripeSessionId || purchase.price_paid > 0;
                
                return (
                  <TableRow key={purchase.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="whitespace-nowrap font-medium text-slate-600 text-xs sm:text-sm py-3 sm:py-4">
                      {format(new Date(purchase.purchase_date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900 text-xs sm:text-sm">
                      {services[purchase.service_id] || 'Service/Package'}
                    </TableCell>
                    <TableCell className="text-slate-600 text-xs sm:text-sm">
                      {purchase.sessions_remaining}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${isPaid ? "bg-green-50 text-green-700 border-green-200" : "bg-yellow-50 text-yellow-700 border-yellow-200"}`}>
                        {isPaid ? 'Paid' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-900 text-xs sm:text-sm">
                      {formatMYR(purchase.price_paid)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDownloadInvoice(purchase)} 
                        className="text-primary hover:text-primary/80 h-8 sm:h-9" 
                        title="Download Receipt"
                        disabled={generatingPdf === purchase.id}
                      >
                        {generatingPdf === purchase.id ? (
                          <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                        ) : (
                          <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchaseHistorySection;
