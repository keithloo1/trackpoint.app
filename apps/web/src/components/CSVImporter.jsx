
import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle2, Loader2, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/context/AuthContext.jsx';

const CSVImporter = ({ onSuccess }) => {
  const { currentUser } = useAuth();
  const [importType, setImportType] = useState('clients');
  const [isImporting, setIsImporting] = useState(false);
  const [results, setResults] = useState(null);
  const [preview, setPreview] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const fileInputRef = useRef(null);

  const importTypes = {
    clients: {
      label: 'Clients',
      template: 'name,email,phone,date_of_birth,package_type,expiry_date,sessions,unlimited,client_type,member_status,initial_package,remaining_package,date_paid\nJohn Doe,john@example.com,555-0100,1990-05-15,Standard,2024-12-31,10,false,PT and Group,member,10,10,2024-01-15\nJane Smith,,555-0101,1988-11-20,Unlimited Monthly,2024-12-31,0,true,Group,non-member,0,0,',
      headers: ['name', 'email', 'phone', 'date_of_birth', 'package_type', 'expiry_date', 'sessions', 'unlimited', 'client_type', 'member_status', 'initial_package', 'remaining_package', 'date_paid']
    },
    payments: {
      label: 'Historical Payments',
      template: 'client_email,amount,sessions_added,date\njohn@example.com,150.00,10,2024-01-15\njane@example.com,500.00,0,2024-02-01',
      headers: ['client_email', 'amount', 'sessions_added', 'date']
    },
    weight: {
      label: 'Weight Records',
      template: 'client_email,weight_kg,date,notes\njohn@example.com,75.5,2024-01-15,Initial weigh-in\njane@example.com,62.0,2024-02-01,',
      headers: ['client_email', 'weight_kg', 'date', 'notes']
    },
    attendance: {
      label: 'Class Attendance',
      template: 'client_email,class_name,date\njohn@example.com,Yoga Flow,2024-01-15\njane@example.com,HIIT,2024-02-01',
      headers: ['client_email', 'class_name', 'date']
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResults(null);
    setPreview(null);
    setParsedData(null);

    try {
      const text = await file.text();
      const rows = text.split('\n').filter(r => r.trim().length > 0).map(row => row.split(',').map(cell => cell.trim()));
      
      if (rows.length < 2) throw new Error('File is empty or missing data rows.');
      
      const headers = rows[0].map(h => h.toLowerCase());
      const requiredHeaders = importTypes[importType].headers;
      
      const missingHeaders = requiredHeaders.filter(h => 
        !headers.includes(h) && 
        h !== 'notes' && 
        h !== 'phone' && 
        h !== 'package_type' && 
        h !== 'date_of_birth' && 
        h !== 'client_type' &&
        h !== 'member_status' &&
        h !== 'initial_package' &&
        h !== 'remaining_package' &&
        h !== 'date_paid' &&
        (importType === 'clients' ? h !== 'email' : true)
      );
      
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
      }

      setPreview({
        headers,
        rows: rows.slice(1, 4),
        totalRows: rows.length - 1
      });
      
      setParsedData({ headers, rows: rows.slice(1) });

    } catch (error) {
      toast.error(error.message || 'Failed to parse CSV file');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const executeImport = async () => {
    if (!parsedData) return;
    setIsImporting(true);
    
    let successCount = 0;
    let errors = [];
    const { headers, rows } = parsedData;

    try {
      let existingClients = [];
      if (['payments', 'weight', 'attendance'].includes(importType)) {
        existingClients = await pb.collection('clients').getFullList({
          filter: `userId="${currentUser.id}"`,
          $autoCancel: false
        });
      }

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        try {
          const rowData = {};
          headers.forEach((h, idx) => { rowData[h] = row[idx]; });

          if (importType === 'clients') {
            if (!rowData.name) throw new Error('Name is required');
            const isUnlimited = rowData.unlimited?.toLowerCase() === 'true';
            const sessions = parseInt(rowData.sessions) || 0;
            const expiryDate = rowData.expiry_date ? new Date(rowData.expiry_date) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
            const dob = rowData.date_of_birth ? new Date(rowData.date_of_birth) : null;
            const datePaid = rowData.date_paid ? new Date(rowData.date_paid) : null;
            
            const validTypes = ['PT', 'Group', 'PT and Group'];
            const cType = validTypes.includes(rowData.client_type) ? rowData.client_type : 'PT and Group';
            
            const validMemberStatus = ['member', 'non-member'];
            const memberStatus = validMemberStatus.includes(rowData.member_status) ? rowData.member_status : 'non-member';
            
            const initialPackage = parseInt(rowData.initial_package) || (isUnlimited ? 1 : sessions);
            const remainingPackage = parseInt(rowData.remaining_package) || (isUnlimited ? 0 : sessions);
            
            const clientPayload = {
              clientName: rowData.name,
              email: rowData.email || '',
              phone: rowData.phone || '',
              totalSessions: initialPackage,
              sessionsRemaining: remainingPackage,
              unlimited: isUnlimited,
              expiryDate: expiryDate.toISOString(),
              birthday: dob ? dob.toISOString() : '',
              notes: rowData.package_type ? `Imported Package: ${rowData.package_type}` : '',
              clientType: cType,
              memberStatus: memberStatus,
              userId: currentUser.id,
              archived: false
            };

            if (datePaid) {
              clientPayload.date_paid = datePaid.toISOString();
            }

            await pb.collection('clients').create(clientPayload, { $autoCancel: false });
          } 
          else if (importType === 'payments') {
            const client = existingClients.find(c => c.email === rowData.client_email);
            if (!client) throw new Error(`Client not found with email: ${rowData.client_email}`);
            
            const date = rowData.date ? new Date(rowData.date) : new Date();

            await pb.collection('payments').create({
              clientId: client.id,
              userId: currentUser.id,
              packageId: 'imported',
              amount: parseFloat(rowData.amount) || 0,
              sessionsAdded: parseInt(rowData.sessions_added) || 0,
              paymentDate: date.toISOString(),
              status: 'completed'
            }, { $autoCancel: false });
          }
          else if (importType === 'weight') {
            const client = existingClients.find(c => c.email === rowData.client_email);
            if (!client) throw new Error(`Client not found with email: ${rowData.client_email}`);
            
            const date = rowData.date ? new Date(rowData.date) : new Date();

            await pb.collection('weight_entries').create({
              clientId: client.id,
              userId: currentUser.id,
              weight: parseFloat(rowData.weight_kg) || 0,
              entryDate: date.toISOString(),
              notes: rowData.notes || ''
            }, { $autoCancel: false });
          }
          else if (importType === 'attendance') {
            const client = existingClients.find(c => c.email === rowData.client_email);
            if (!client) throw new Error(`Client not found with email: ${rowData.client_email}`);
            
            const date = rowData.date ? new Date(rowData.date) : new Date();
            
            await pb.collection('session_deductions').create({
              clientId: client.id,
              userId: currentUser.id,
              sessionsDeducted: client.unlimited ? 0 : 1,
              deductionDate: date.toISOString(),
              notes: `Imported attendance: ${rowData.class_name || 'Unknown Class'}`
            }, { $autoCancel: false });
          }

          successCount++;
        } catch (err) {
          errors.push(`Row ${i + 2}: ${err.message}`);
        }
      }

      setResults({ success: successCount, errors });
      setPreview(null);
      setParsedData(null);
      
      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} records`);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      toast.error('Import failed to complete');
      setResults({ success: successCount, errors: [...errors, 'Fatal error occurred during batch processing.'] });
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    const typeInfo = importTypes[importType];
    const blob = new Blob([typeInfo.template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TRACKPOINT_${typeInfo.label.replace(/\s+/g, '_')}_Template.csv`;
    a.click();
  };

  return (
    <div className="w-full flex flex-col h-full max-h-[calc(90vh-200px)]">
      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
        <div className="w-full md:w-56 shrink-0 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Import Type</label>
            <Select value={importType} onValueChange={(val) => { setImportType(val); setPreview(null); setResults(null); }}>
              <SelectTrigger className="bg-white rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(importTypes).map(([key, info]) => (
                  <SelectItem key={key} value={key}>
                    {info.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Instructions</h4>
            <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4">
              <li>Download the template file first.</li>
              <li>Do not change the header row.</li>
              <li>Ensure dates are in YYYY-MM-DD format.</li>
              {importType !== 'clients' && <li>Clients must already exist in the system and be matched by email.</li>}
            </ul>
            <Button variant="outline" size="sm" onClick={downloadTemplate} className="w-full mt-4 bg-white rounded-lg">
              Download Template
            </Button>
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col min-h-0">
          {!preview && !results ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-8 bg-slate-50/50 h-full min-h-[250px] transition-colors hover:bg-slate-50">
              <Database className="w-10 h-10 text-slate-400 mb-4" />
              <h3 className="text-base font-semibold text-slate-900 mb-1">Upload CSV File</h3>
              <p className="text-sm text-slate-500 mb-6 text-center max-w-xs">
                Select a properly formatted .csv file containing your {importTypes[importType].label.toLowerCase()}.
              </p>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <Button onClick={() => fileInputRef.current?.click()} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl">
                <Upload className="w-4 h-4 mr-2" /> Select File
              </Button>
            </div>
          ) : preview ? (
            <div className="flex flex-col h-full min-h-0">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <h3 className="text-base font-semibold text-slate-900">Import Preview</h3>
                <Badge variant="secondary" className="rounded-lg">{preview.totalRows} records found</Badge>
              </div>
              
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex-1 min-h-0 flex flex-col">
                <div className="overflow-auto flex-1">
                  <table className="w-full text-sm text-left min-w-[800px]">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-600 font-medium sticky top-0 z-10">
                      <tr>
                        {preview.headers.map(h => (
                          <th key={h} className="px-4 py-3 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {preview.rows.map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td key={j} className="px-4 py-2 whitespace-nowrap truncate max-w-[200px]">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {preview.totalRows > 3 && (
                  <div className="p-3 text-center text-xs text-slate-500 bg-slate-50 border-t border-slate-100 shrink-0">
                    Showing 3 of {preview.totalRows} rows
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 shrink-0">
                <Button variant="outline" onClick={() => { setPreview(null); setParsedData(null); }} disabled={isImporting} className="rounded-xl">
                  Cancel
                </Button>
                <Button onClick={executeImport} disabled={isImporting} className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white">
                  {isImporting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : <><Database className="w-4 h-4 mr-2" /> Run Import</>}
                </Button>
              </div>
            </div>
          ) : results ? (
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-green-50 text-green-900 rounded-xl border border-green-200">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-base">Import Complete</h3>
                  <p className="text-green-800 text-sm mt-1">Successfully imported {results.success} records into the system.</p>
                </div>
              </div>
              
              {results.errors.length > 0 && (
                <div className="p-4 bg-red-50 text-red-900 rounded-xl border border-red-200">
                  <div className="flex items-center gap-2 mb-2 font-semibold text-sm">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    {results.errors.length} Errors Encountered
                  </div>
                  <div className="max-h-48 overflow-y-auto pr-2">
                    <ul className="text-xs space-y-1.5 list-disc pl-5 text-red-800">
                      {results.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <Button variant="outline" onClick={() => setResults(null)} className="rounded-xl">Import Another File</Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CSVImporter;
