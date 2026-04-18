
import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ArrowDownToLine, ArrowUpFromLine, RefreshCw, FileText, ChevronDown, ChevronRight, CheckCircle2, AlertCircle, Calendar as CalendarIcon, Pencil } from 'lucide-react';
import { useClientManagement } from '../context/ClientManagementContext.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import SearchBar from '@/components/SearchBar.jsx';
import EditHistoryModal from '@/components/EditHistoryModal.jsx';
import { toast } from 'sonner';
import { formatMYR } from '@/lib/utils.js';
import { generateInvoice } from '@/lib/InvoiceGenerator.js';

const RenewalHistoryPage = () => {
  const { clients, getAllHistory, getExpiryStatus } = useClientManagement();
  const history = getAllHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const [openGroups, setOpenGroups] = useState({});
  const [generatingPdf, setGeneratingPdf] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const getClient = (clientId) => {
    return clients.find(c => c.id === clientId);
  };

  const filteredHistory = useMemo(() => {
    return history.filter(h => {
      const client = getClient(h.clientId);
      // Filter out history records for clients that no longer exist
      if (!client) return false;
      
      if (!searchTerm) return true;
      const lowerSearch = searchTerm.toLowerCase();
      return client.name.toLowerCase().includes(lowerSearch);
    });
  }, [history, searchTerm, clients]);

  const groupedHistory = useMemo(() => {
    const groups = {};
    filteredHistory.forEach(h => {
      const client = getClient(h.clientId);
      if (!client) return;
      
      const name = client.name;
      if (!groups[name]) groups[name] = { client, entries: [] };
      groups[name].entries.push(h);
    });

    Object.keys(groups).forEach(key => {
      groups[key].entries.sort((a, b) => new Date(b.sessionDateTime) - new Date(a.sessionDateTime));
    });

    return Object.entries(groups)
      .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
      .map(([name, data]) => ({ name, client: data.client, entries: data.entries }));
  }, [filteredHistory, clients]);

  const toggleGroup = (name) => {
    setOpenGroups(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleDownloadInvoice = async (item, client) => {
    try {
      setGeneratingPdf(item.id);
      await generateInvoice({
        clientName: client?.name,
        email: client?.email,
        phone: client?.phone,
        transactionDate: item.sessionDateTime,
        sessions: item.sessionsChanged,
        amount: item.amount,
        invoiceNumber: item.id.substring(0, 8).toUpperCase()
      });
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      toast.error('Failed to generate invoice');
    } finally {
      setGeneratingPdf(null);
    }
  };

  const handleEditClick = (item) => {
    setEditingRecord(item);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    // Refresh history by triggering a re-render
    setIsEditModalOpen(false);
    setEditingRecord(null);
    // The history will automatically refresh through the context
  };

  const getEventBadge = (type) => {
    switch (type) {
      case 'deduction':
        return <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200"><ArrowDownToLine className="w-3 h-3 mr-1"/> Deducted</Badge>;
      case 'addition':
        return <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200"><ArrowUpFromLine className="w-3 h-3 mr-1"/> Added</Badge>;
      case 'renewal':
        return <Badge variant="default" className="bg-blue-50 text-blue-700 border-blue-200"><RefreshCw className="w-3 h-3 mr-1"/> Renewal</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const getPaymentStatus = (item) => {
    if (item.type !== 'renewal') return <span className="text-slate-400">-</span>;
    
    return item.paymentStatus === 'paid' ? (
      <span className="flex items-center text-sm text-green-600 font-medium">
        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Paid
      </span>
    ) : (
      <span className="flex items-center text-sm text-yellow-600 font-medium">
        <AlertCircle className="w-3.5 h-3.5 mr-1" /> Pending
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Session History</h2>
          <p className="text-slate-500">Track all session punches, additions, and package renewals.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <SearchBar placeholder="Filter history by client..." onSearch={setSearchTerm} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {groupedHistory.length > 0 ? (
          <div className="divide-y">
            {groupedHistory.map(({ name, client, entries }) => {
              const { status: expiryStatus } = getExpiryStatus(client?.expiryDate);
              const isOpen = !!openGroups[name];
              
              return (
                <Collapsible key={name} open={isOpen} onOpenChange={() => toggleGroup(name)}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-slate-50 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <div className="flex items-center gap-3">
                      {isOpen ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                      <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
                      <Badge variant="secondary" className="ml-2 bg-slate-100 text-slate-600">{entries.length} entries</Badge>
                      {client?.expiryDate && (
                        <Badge variant="outline" className={`ml-2 ${
                          expiryStatus === 'expired' ? 'bg-red-50 text-red-700 border-red-200' : 
                          expiryStatus === 'warning' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                          'bg-green-50 text-green-700 border-green-200'
                        }`}>
                          <CalendarIcon className="w-3 h-3 mr-1" />
                          {format(new Date(client.expiryDate), 'MMM d, yyyy')}
                        </Badge>
                      )}
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="px-4 pb-4">
                      <div className="border rounded-xl overflow-hidden mt-2">
                        <Table>
                          <TableHeader className="bg-slate-50/50">
                            <TableRow>
                              <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Date & Time</TableHead>
                              <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Action</TableHead>
                              <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500 text-right">Change</TableHead>
                              <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Payment</TableHead>
                              <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500 text-right">Amount</TableHead>
                              <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500 text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {entries.map((item) => (
                              <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell className="text-slate-600 font-medium">
                                  {format(new Date(item.sessionDateTime), 'MMM d, yyyy h:mm a')}
                                </TableCell>
                                <TableCell>{getEventBadge(item.type)}</TableCell>
                                <TableCell className="text-right tabular-nums font-medium">
                                  <span className={item.sessionsChanged > 0 ? 'text-green-600' : 'text-slate-900'}>
                                    {item.sessionsChanged > 0 ? '+' : ''}{item.sessionsChanged}
                                  </span>
                                </TableCell>
                                <TableCell>{getPaymentStatus(item)}</TableCell>
                                <TableCell className="text-right text-slate-600 tabular-nums">
                                  {item.type === 'renewal' && item.amount ? formatMYR(item.amount) : <span className="text-slate-300">-</span>}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => handleEditClick(item)}
                                      className="text-slate-600 hover:text-primary"
                                    >
                                      <Pencil className="w-4 h-4 mr-1" />
                                      Edit
                                    </Button>
                                    {item.type === 'renewal' && (
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => handleDownloadInvoice(item, client)}
                                        disabled={generatingPdf === item.id}
                                        className="text-primary hover:text-primary/80"
                                      >
                                        <FileText className="w-4 h-4 mr-1" />
                                        {generatingPdf === item.id ? 'Generating...' : 'PDF'}
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
              <RefreshCw className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No history found</h3>
            <p className="text-slate-500 mt-1 max-w-sm mx-auto">
              {searchTerm ? "No records match your search criteria." : "Session punches and renewals will appear here."}
            </p>
          </div>
        )}
      </div>

      <EditHistoryModal 
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        historyRecord={editingRecord}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default RenewalHistoryPage;
