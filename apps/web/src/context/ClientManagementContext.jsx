
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { differenceInDays, isWithinInterval, addDays, setYear } from 'date-fns';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from './AuthContext.jsx';

const ClientManagementContext = createContext();

export const useClientManagement = () => {
  const context = useContext(ClientManagementContext);
  if (!context) {
    throw new Error('useClientManagement must be used within a ClientManagementProvider');
  }
  return context;
};

export const ClientManagementProvider = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  
  const [settings, setSettings] = useState({
    ownerEmail: '',
    businessName: 'TRACKPOINT.APP Studio',
    receiptEmailEnabled: false,
    receiptEmail: ''
  });
  
  const [clients, setClients] = useState([]);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    if (!isAuthenticated || !currentUser) return;
    try {
      const records = await pb.collection('settings').getFullList({
        filter: `ownerId="${currentUser.id}"`,
        $autoCancel: false
      });
      if (records.length > 0) {
        setSettings(records[0]);
      } else {
        const newSettings = await pb.collection('settings').create({
          ownerId: currentUser.id,
          ownerEmail: currentUser.email,
          businessName: 'My Studio',
          receiptEmailEnabled: false,
          receiptEmail: ''
        }, { $autoCancel: false });
        setSettings(newSettings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  }, [currentUser, isAuthenticated]);

  const fetchClients = useCallback(async () => {
    if (!isAuthenticated || !currentUser) return;
    try {
      const records = await pb.collection('clients').getFullList({
        filter: `userId="${currentUser.id}"`,
        sort: '-created',
        $autoCancel: false
      });
      
      const mappedClients = records.map(r => ({
        id: r.id,
        portalId: r.id,
        name: r.clientName,
        email: r.email,
        phone: r.phone,
        currentSessions: r.sessionsRemaining,
        packageSize: r.totalSessions,
        archived: r.archived || false,
        paymentStatus: 'paid',
        amountReceived: 0,
        expiryDate: r.expiryDate,
        memberStatus: r.memberStatus || 'non-member',
        birthday: r.birthday,
        unlimited: r.unlimited || false,
        attendance_count: r.attendance_count || 0,
        clientType: r.clientType || 'PT and Group',
        follow_up_status: r.follow_up_status || false,
        createdAt: r.created
      }));
      setClients(mappedClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  }, [currentUser, isAuthenticated]);

  const fetchHistory = useCallback(async () => {
    if (!isAuthenticated || !currentUser) return;
    try {
      const records = await pb.collection('history').getFullList({
        filter: `userId="${currentUser.id}"`,
        sort: '-actionDate',
        $autoCancel: false
      });
      
      const mappedHistory = records.map(r => ({
        id: r.id,
        clientId: r.clientId,
        type: r.actionType,
        sessionsChanged: r.sessionsChanged,
        paymentStatus: r.paymentStatus,
        amount: r.amount,
        timestamp: r.created,
        sessionDateTime: r.actionDate
      }));
      setSessionHistory(mappedHistory);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  }, [currentUser, isAuthenticated]);

  const fetchPackages = useCallback(async () => {
    try {
      const records = await pb.collection('packages').getFullList({
        sort: 'price',
        $autoCancel: false
      });
      setPackages(records);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      Promise.all([fetchSettings(), fetchClients(), fetchHistory(), fetchPackages()]).finally(() => {
        setLoading(false);
      });
    } else {
      setClients([]);
      setSessionHistory([]);
      setPackages([]);
      setLoading(false);
    }
  }, [isAuthenticated, fetchSettings, fetchClients, fetchHistory, fetchPackages]);

  const getExpiryStatus = useCallback((expiryDate) => {
    if (!expiryDate) return { status: 'ok', daysRemaining: 999 };
    const daysRemaining = differenceInDays(new Date(expiryDate), new Date());
    if (daysRemaining < 0) return { status: 'expired', daysRemaining };
    if (daysRemaining <= 7) return { status: 'warning', daysRemaining };
    return { status: 'ok', daysRemaining };
  }, []);

  const getUpcomingBirthdays = useCallback(() => {
    const today = new Date();
    const nextWeek = addDays(today, 7);
    
    return clients.filter(c => {
      if (!c.birthday) return false;
      const bday = new Date(c.birthday);
      const bdayThisYear = setYear(bday, today.getFullYear());
      
      if (bdayThisYear < today && differenceInDays(today, bdayThisYear) > 0) {
        const bdayNextYear = setYear(bday, today.getFullYear() + 1);
        return isWithinInterval(bdayNextYear, { start: today, end: nextWeek });
      }
      
      return isWithinInterval(bdayThisYear, { start: today, end: nextWeek });
    }).sort((a, b) => {
      const bdayA = setYear(new Date(a.birthday), today.getFullYear());
      const bdayB = setYear(new Date(b.birthday), today.getFullYear());
      return (bdayA < today ? setYear(bdayA, today.getFullYear() + 1) : bdayA) - 
             (bdayB < today ? setYear(bdayB, today.getFullYear() + 1) : bdayB);
    });
  }, [clients]);

  const updateSettings = useCallback(async (newSettings) => {
    if (!settings.id) return;
    try {
      const updated = await pb.collection('settings').update(settings.id, newSettings, { $autoCancel: false });
      setSettings(updated);
      toast.success('Settings updated successfully.');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings.');
    }
  }, [settings]);

  const addClient = useCallback(async (data) => {
    if (!currentUser) return;
    try {
      const newClientRecord = await pb.collection('clients').create({
        clientName: data.name,
        email: data.email || `${Date.now()}@placeholder.com`,
        phone: data.phone,
        sessionsRemaining: data.unlimited ? 0 : parseInt(data.packageSize, 10),
        totalSessions: data.unlimited ? 1 : parseInt(data.packageSize, 10),
        expiryDate: data.expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        memberStatus: data.memberStatus || 'non-member',
        birthday: data.birthday ? new Date(data.birthday).toISOString() : '',
        unlimited: data.unlimited || false,
        attendance_count: 0,
        clientType: data.clientType || 'PT and Group',
        follow_up_status: false,
        userId: currentUser.id
      }, { $autoCancel: false });

      await pb.collection('history').create({
        clientId: newClientRecord.id,
        actionType: 'renewal',
        sessionsChanged: data.unlimited ? 0 : parseInt(data.packageSize, 10),
        actionDate: new Date().toISOString(),
        paymentStatus: data.paymentStatus,
        amount: parseFloat(data.amountReceived) || 0,
        userId: currentUser.id
      }, { $autoCancel: false });

      await fetchClients();
      await fetchHistory();

      toast.success(`${data.name} added successfully.`);
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Failed to add client.');
    }
  }, [currentUser, fetchClients, fetchHistory]);

  const archiveClient = useCallback((clientId) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, archived: true } : c));
    toast.success('Client archived.');
  }, []);

  const unarchiveClient = useCallback((clientId) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, archived: false } : c));
    toast.success('Client restored.');
  }, []);

  const deleteClient = useCallback(async (clientId) => {
    try {
      await pb.collection('clients').delete(clientId, { $autoCancel: false });
      await fetchClients();
      await fetchHistory();
      toast.success('Client deleted.');
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Failed to delete client.');
    }
  }, [fetchClients, fetchHistory]);

  const deductSession = useCallback(async (clientId, sessionDateTime) => {
    const client = clients.find(c => c.id === clientId);
    if (!client || !currentUser) return null;

    try {
      if (client.unlimited) {
        const newCount = (client.attendance_count || 0) + 1;
        await pb.collection('clients').update(clientId, {
          attendance_count: newCount
        }, { $autoCancel: false });

        await pb.collection('session_deductions').create({
          clientId: clientId,
          sessionsDeducted: 0,
          deductionDate: sessionDateTime,
          notes: 'Unlimited attendance',
          userId: currentUser.id
        }, { $autoCancel: false });

        await fetchClients();
        return { ...client, attendance_count: newCount };
      } else {
        const newRemaining = Math.max(0, client.currentSessions - 1);
        
        await pb.collection('clients').update(clientId, {
          sessionsRemaining: newRemaining
        }, { $autoCancel: false });

        await pb.collection('session_deductions').create({
          clientId: clientId,
          sessionsDeducted: 1,
          deductionDate: sessionDateTime,
          userId: currentUser.id
        }, { $autoCancel: false });

        await pb.collection('history').create({
          clientId: clientId,
          actionType: 'deduction',
          sessionsChanged: -1,
          actionDate: sessionDateTime,
          userId: currentUser.id
        }, { $autoCancel: false });

        await fetchClients();
        await fetchHistory();
        
        return { ...client, currentSessions: newRemaining };
      }
    } catch (error) {
      console.error('Error deducting session:', error);
      toast.error('Failed to process attendance.');
      return null;
    }
  }, [clients, currentUser, fetchClients, fetchHistory]);

  const addSession = useCallback(async (clientId, sessionDateTime) => {
    const client = clients.find(c => c.id === clientId);
    if (!client || !currentUser) return;

    try {
      if (client.unlimited) {
        const newCount = Math.max(0, (client.attendance_count || 0) - 1);
        await pb.collection('clients').update(clientId, {
          attendance_count: newCount
        }, { $autoCancel: false });
        await fetchClients();
        toast.success(`Attendance removed.`);
      } else {
        const newRemaining = client.currentSessions + 1;
        
        await pb.collection('clients').update(clientId, {
          sessionsRemaining: newRemaining
        }, { $autoCancel: false });

        await pb.collection('history').create({
          clientId: clientId,
          actionType: 'addition',
          sessionsChanged: 1,
          actionDate: sessionDateTime,
          userId: currentUser.id
        }, { $autoCancel: false });

        await fetchClients();
        await fetchHistory();
        toast.success(`Session added back.`);
      }
    } catch (error) {
      console.error('Error adding session:', error);
      toast.error('Failed to add session.');
    }
  }, [clients, currentUser, fetchClients, fetchHistory]);

  const renewClient = useCallback(async (clientId, packageId, packageSize, amount, paymentStatus, expiryDate) => {
    const client = clients.find(c => c.id === clientId);
    if (!client || !currentUser) throw new Error("Client or user not found");

    try {
      const parsedPackageSize = parseInt(packageSize, 10);
      
      await pb.collection('clients').update(clientId, {
        totalSessions: client.unlimited ? 1 : parsedPackageSize,
        expiryDate: new Date(expiryDate).toISOString()
      }, { $autoCancel: false });

      await pb.collection('payments').create({
        clientId,
        userId: currentUser.id,
        packageId: packageId || 'custom',
        amount: parseFloat(amount),
        sessionsAdded: parsedPackageSize,
        status: paymentStatus === 'paid' ? 'completed' : 'pending',
        paymentTime: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
      }, { $autoCancel: false });

      await pb.collection('history').create({
        clientId,
        userId: currentUser.id,
        actionType: 'renewal',
        sessionsChanged: parsedPackageSize,
        actionDate: new Date().toISOString(),
        paymentStatus,
        amount: parseFloat(amount),
        notes: 'Manual renewal'
      }, { $autoCancel: false });

      await fetchClients();
      await fetchHistory();
      return true;
    } catch (error) {
      console.error('Renewal error:', error);
      throw error;
    }
  }, [clients, currentUser, fetchClients, fetchHistory]);

  return (
    <ClientManagementContext.Provider value={{
      settings, 
      updateSettings, 
      clients, 
      packages, 
      addClient, 
      archiveClient, 
      unarchiveClient, 
      deleteClient, 
      deductSession, 
      addSession, 
      renewClient,
      getAllHistory: () => sessionHistory, 
      getExpiryStatus, 
      getUpcomingBirthdays, 
      loading, 
      refreshClients: fetchClients
    }}>
      {children}
    </ClientManagementContext.Provider>
  );
};
