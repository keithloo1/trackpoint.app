
import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Users, History, ArchiveRestore, Loader2, Filter, CalendarDays, Package, DollarSign, Archive, Trash2, UserX } from 'lucide-react';
import Header from '@/components/Header.jsx';
import ClientCard from '@/components/ClientCard.jsx';
import CompactClientCard from '@/components/CompactClientCard.jsx';
import RenewalHistoryPage from '@/pages/RenewalHistoryPage.jsx';
import ClassManagement from '@/components/ClassManagement.jsx';
import AddClientModal from '@/components/AddClientModal.jsx';
import SearchBar from '@/components/SearchBar.jsx';
import ViewToggle from '@/components/ViewToggle.jsx';
import ServicesManagement from '@/components/ServicesManagement.jsx';
import ClientPricingManagement from '@/components/ClientPricingManagement.jsx';
import UpcomingBirthdaysWidget from '@/components/UpcomingBirthdaysWidget.jsx';
import FollowUpClientsSection from '@/components/FollowUpClientsSection.jsx';
import { useClientManagement } from '@/context/ClientManagementContext.jsx';
import { useAuth } from '@/context/AuthContext.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import pb from '@/lib/pocketbaseClient';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const { clients, unarchiveClient, loading, refreshClients } = useClientManagement();
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('regular');
  const [memberFilter, setMemberFilter] = useState('all');
  const [packageFilter, setPackageFilter] = useState('all');
  const [clientTypeFilter, setClientTypeFilter] = useState('all');
  const [expiredFilter, setExpiredFilter] = useState('all');
  const [sortFilter, setSortFilter] = useState('none');
  const [businessName, setBusinessName] = useState('');
  const [selectedClients, setSelectedClients] = useState([]);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isOwner = currentUser?.role === 'owner' || !currentUser?.role;

  useEffect(() => {
    const savedMode = localStorage.getItem('clientViewMode');
    if (savedMode) setViewMode(savedMode);
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!currentUser?.id) return;
      try {
        const records = await pb.collection('settings').getFullList({
          filter: `ownerId="${currentUser.id}"`,
          $autoCancel: false
        });
        if (records.length > 0 && records[0].businessName) {
          setBusinessName(records[0].businessName);
        }
      } catch (err) {
        console.warn('Could not fetch settings:', err);
      }
    };
    fetchSettings();
  }, [currentUser]);

  const welcomeName = businessName || currentUser?.name || 'Studio Owner';

  const filteredActiveClients = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log('[DashboardPage] Filter Debug - Today:', today.toISOString());
    console.log('[DashboardPage] Filter Debug - expiredFilter state:', expiredFilter);
    console.log('[DashboardPage] Filter Debug - Total clients before filtering:', clients.length);

    let filtered = clients
      .filter(c => !c.archived && !c.follow_up_status)
      .filter(c => searchTerm === '' || c.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(c => {
        if (memberFilter === 'members') return c.memberStatus === 'member';
        if (memberFilter === 'non-members') return c.memberStatus === 'non-member';
        return true;
      })
      .filter(c => {
        if (packageFilter === 'unlimited') return c.unlimited === true;
        if (packageFilter === 'limited') return c.unlimited !== true;
        return true;
      })
      .filter(c => {
        if (clientTypeFilter === 'PT Only') return c.clientType === 'PT';
        if (clientTypeFilter === 'Group Only') return c.clientType === 'Group';
        if (clientTypeFilter === 'PT and Group') return c.clientType === 'PT and Group';
        return true;
      })
      .filter(c => {
        if (expiredFilter === 'active') {
          // Active: not expired (expiryDate >= today OR unlimited)
          if (c.unlimited) {
            console.log(`[DashboardPage] ${c.name}: unlimited = true, keeping in active`);
            return true;
          }
          if (!c.expiryDate) {
            console.log(`[DashboardPage] ${c.name}: no expiryDate, keeping in active`);
            return true;
          }
          const expiryDate = new Date(c.expiryDate);
          expiryDate.setHours(0, 0, 0, 0);
          const isActive = expiryDate >= today;
          console.log(`[DashboardPage] ${c.name}: expiryDate=${c.expiryDate}, parsed=${expiryDate.toISOString()}, isActive=${isActive}`);
          return isActive;
        }
        if (expiredFilter === 'expired') {
          // Expired: expiryDate < today AND not unlimited
          if (c.unlimited) {
            console.log(`[DashboardPage] ${c.name}: unlimited = true, excluding from expired`);
            return false;
          }
          if (!c.expiryDate) {
            console.log(`[DashboardPage] ${c.name}: no expiryDate, excluding from expired`);
            return false;
          }
          const expiryDate = new Date(c.expiryDate);
          expiryDate.setHours(0, 0, 0, 0);
          const isExpired = expiryDate < today;
          console.log(`[DashboardPage] ${c.name}: expiryDate=${c.expiryDate}, parsed=${expiryDate.toISOString()}, isExpired=${isExpired}`);
          return isExpired;
        }
        return true; // 'all'
      });

    console.log('[DashboardPage] Filter Debug - Clients after expiry filter:', filtered.length);
    
    if (expiredFilter === 'expired') {
      console.log('[DashboardPage] Expired clients:', filtered.map(c => ({ name: c.name, expiryDate: c.expiryDate })));
    }

    // Apply sorting
    if (sortFilter === 'sessions-asc') {
      filtered = [...filtered].sort((a, b) => a.currentSessions - b.currentSessions);
    } else if (sortFilter === 'expiry-asc') {
      filtered = [...filtered].sort((a, b) => {
        const dateA = a.expiryDate ? new Date(a.expiryDate).getTime() : Infinity;
        const dateB = b.expiryDate ? new Date(b.expiryDate).getTime() : Infinity;
        return dateA - dateB;
      });
    }

    return filtered;
  }, [clients, searchTerm, memberFilter, packageFilter, clientTypeFilter, expiredFilter, sortFilter]);

  const archivedClients = useMemo(() => {
    return clients.filter(c => c.archived);
  }, [clients]);

  const expiredCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return clients.filter(c => {
      if (c.archived || c.follow_up_status || c.unlimited) return false;
      if (!c.expiryDate) return false;
      const expiryDate = new Date(c.expiryDate);
      expiryDate.setHours(0, 0, 0, 0);
      return expiryDate < today;
    }).length;
  }, [clients]);

  const handleToggleSelect = (clientId) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleSelectAll = () => {
    if (selectedClients.length === filteredActiveClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(filteredActiveClients.map(c => c.id));
    }
  };

  const handleBulkArchive = async () => {
    try {
      for (const clientId of selectedClients) {
        await pb.collection('clients').update(clientId, { archived: true }, { $autoCancel: false });
      }
      await refreshClients();
      setSelectedClients([]);
      setShowArchiveDialog(false);
    } catch (error) {
      console.error('Bulk archive error:', error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const clientId of selectedClients) {
        await pb.collection('clients').delete(clientId, { $autoCancel: false });
      }
      await refreshClients();
      setSelectedClients([]);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Bulk delete error:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - TRACKPOINT.APP</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50 pb-24 overflow-x-hidden">
        <Header />

        <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2 sm:py-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-6 sm:py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-2 sm:mb-4" />
              <p className="text-slate-500 text-xs sm:text-base">Loading your studio data...</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-6 mb-2 sm:mb-8">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-6 h-full flex flex-col justify-center">
                    <h2 className="text-lg sm:text-2xl font-bold text-slate-900 mb-0.5 sm:mb-2 text-balance">Welcome back, {welcomeName}!</h2>
                    <p className="text-xs sm:text-base text-slate-500">You have {filteredActiveClients.length} active clients matching your current filters.</p>
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <UpcomingBirthdaysWidget />
                </div>
              </div>

              <Tabs defaultValue="clients" className="w-full">
                <div className="flex flex-col space-y-2 sm:space-y-4 mb-2 sm:mb-8">
                  {/* Tabs Navigation */}
                  <div className="w-full overflow-hidden rounded-lg bg-slate-200/60 p-0.5 sm:p-1">
                    <TabsList className="bg-transparent w-full h-auto p-0 flex flex-nowrap overflow-x-auto no-scrollbar justify-start">
                      <TabsTrigger value="clients" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-1.5 px-2 sm:py-2 sm:px-4 flex-1 min-w-fit text-xs sm:text-base">
                        <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2 shrink-0" />
                        Clients
                      </TabsTrigger>
                      <TabsTrigger value="follow-up" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-1.5 px-2 sm:py-2 sm:px-4 flex-1 min-w-fit text-xs sm:text-base">
                        <UserX className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2 shrink-0" />
                        Follow Up
                      </TabsTrigger>
                      <TabsTrigger value="classes" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-1.5 px-2 sm:py-2 sm:px-4 flex-1 min-w-fit text-xs sm:text-base">
                        <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2 shrink-0" />
                        Classes
                      </TabsTrigger>
                      <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-1.5 px-2 sm:py-2 sm:px-4 flex-1 min-w-fit text-xs sm:text-base">
                        <History className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2 shrink-0" />
                        History
                      </TabsTrigger>
                      {isOwner && (
                        <>
                          <TabsTrigger value="services" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-1.5 px-2 sm:py-2 sm:px-4 flex-1 min-w-fit text-xs sm:text-base">
                            <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2 shrink-0" />
                            Services
                          </TabsTrigger>
                          <TabsTrigger value="pricing" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-1.5 px-2 sm:py-2 sm:px-4 flex-1 min-w-fit text-xs sm:text-base">
                            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2 shrink-0" />
                            Pricing
                          </TabsTrigger>
                        </>
                      )}
                    </TabsList>
                  </div>

                  {/* Filters and Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center gap-1.5 sm:gap-3 w-full">
                    <div className="w-full lg:flex-1 lg:min-w-[200px]">
                      <SearchBar placeholder="Find a client..." onSearch={setSearchTerm} />
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex gap-1.5 sm:gap-2 w-full lg:w-auto">
                      <Select value={clientTypeFilter} onValueChange={setClientTypeFilter}>
                        <SelectTrigger className="w-full lg:w-[140px] bg-white h-9 sm:h-10 text-[11px] sm:text-sm">
                          <SelectValue placeholder="Client Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Clients</SelectItem>
                          <SelectItem value="PT Only">PT Only</SelectItem>
                          <SelectItem value="Group Only">Group Only</SelectItem>
                          <SelectItem value="PT and Group">PT and Group</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={memberFilter} onValueChange={setMemberFilter}>
                        <SelectTrigger className="w-full lg:w-[130px] bg-white h-9 sm:h-10 text-[11px] sm:text-sm">
                          <Filter className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-slate-400 shrink-0 hidden sm:inline-block" />
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="members">Members</SelectItem>
                          <SelectItem value="non-members">Non-Members</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={packageFilter} onValueChange={setPackageFilter}>
                        <SelectTrigger className="w-full lg:w-[140px] bg-white h-9 sm:h-10 text-[11px] sm:text-sm">
                          <SelectValue placeholder="Package" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Packages</SelectItem>
                          <SelectItem value="limited">Limited</SelectItem>
                          <SelectItem value="unlimited">Unlimited</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={expiredFilter} onValueChange={(value) => {
                        console.log('[DashboardPage] Expiry filter changed to:', value);
                        setExpiredFilter(value);
                      }}>
                        <SelectTrigger className="w-full lg:w-[140px] bg-white h-9 sm:h-10 text-[11px] sm:text-sm">
                          <SelectValue placeholder="Expiry Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Clients</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="expired">
                            Expired {expiredCount > 0 && `(${expiredCount})`}
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={sortFilter} onValueChange={setSortFilter}>
                        <SelectTrigger className="w-full lg:w-[180px] bg-white h-9 sm:h-10 text-[11px] sm:text-sm col-span-2 sm:col-span-1">
                          <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Default Order</SelectItem>
                          <SelectItem value="sessions-asc">Sessions: Low to High</SelectItem>
                          <SelectItem value="expiry-asc">Expiry: Earliest First</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="col-span-2 sm:col-span-1 flex justify-end sm:justify-start">
                        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => setIsAddClientOpen(true)}
                      className="bg-primary hover:bg-primary/90 h-9 sm:h-10 w-full sm:w-auto mt-0.5 sm:mt-0 text-xs sm:text-sm"
                    >
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" /> Add Client
                    </Button>
                  </div>

                  {/* Active Filter Badge */}
                  {expiredFilter === 'expired' && (
                    <div className="flex items-center gap-2 px-1">
                      <Badge variant="destructive" className="text-xs">
                        Showing {filteredActiveClients.length} expired client{filteredActiveClients.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  )}

                  {/* Bulk Selection Controls - HIDDEN ON MOBILE */}
                  {filteredActiveClients.length > 0 && (
                    <div className="hidden md:flex items-center justify-between bg-white rounded-xl border border-slate-200 p-3 sm:p-4">
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={selectedClients.length === filteredActiveClients.length && filteredActiveClients.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                        <span className="text-sm font-medium text-slate-700">
                          {selectedClients.length > 0 ? `${selectedClients.length} selected` : 'Select all'}
                        </span>
                      </div>
                      {selectedClients.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setShowArchiveDialog(true)}
                            className="h-9"
                          >
                            <Archive className="w-4 h-4 mr-2" /> Archive
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => setShowDeleteDialog(true)}
                            className="h-9"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <TabsContent value="clients" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  {(clientTypeFilter !== 'all' || expiredFilter !== 'all') && (
                    <div className="mb-1 sm:mb-4 text-xs sm:text-sm text-slate-600 font-medium px-1">
                      Showing: {clientTypeFilter !== 'all' && clientTypeFilter}{clientTypeFilter !== 'all' && expiredFilter !== 'all' && ' - '}{expiredFilter !== 'all' && (expiredFilter === 'active' ? 'Active' : 'Expired')}
                    </div>
                  )}
                  {filteredActiveClients.length > 0 ? (
                    <div className={viewMode === 'compact' ? "flex flex-col gap-1.5 sm:gap-3" : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6"}>
                      {filteredActiveClients.map(client => (
                        viewMode === 'compact' ? 
                          <CompactClientCard 
                            key={client.id} 
                            client={client} 
                            isSelected={selectedClients.includes(client.id)}
                            onToggleSelect={handleToggleSelect}
                          /> : 
                          <ClientCard 
                            key={client.id} 
                            client={client}
                            isSelected={selectedClients.includes(client.id)}
                            onToggleSelect={handleToggleSelect}
                          />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-20 bg-white rounded-2xl border border-dashed border-slate-300 mx-0 sm:mx-1">
                      <div className="inline-flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-slate-100 mb-2 sm:mb-4">
                        <Users className="w-5 h-5 sm:w-8 sm:h-8 text-slate-400" />
                      </div>
                      <h3 className="text-sm sm:text-lg font-semibold text-slate-900">No active clients found</h3>
                      <p className="text-xs sm:text-base text-slate-500 mt-1 sm:mt-2 mb-3 sm:mb-6 max-w-sm mx-auto px-4">
                        {searchTerm || memberFilter !== 'all' || packageFilter !== 'all' || clientTypeFilter !== 'all' || expiredFilter !== 'all' ? "Try adjusting your search or filters." : "Add your first client to start tracking."}
                      </p>
                      {!searchTerm && memberFilter === 'all' && packageFilter === 'all' && clientTypeFilter === 'all' && expiredFilter === 'all' && (
                        <Button onClick={() => setIsAddClientOpen(true)} className="h-9 sm:h-10 text-xs sm:text-sm">
                          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" /> Add Client
                        </Button>
                      )}
                    </div>
                  )}

                  {archivedClients.length > 0 && !searchTerm && memberFilter === 'all' && packageFilter === 'all' && clientTypeFilter === 'all' && expiredFilter === 'all' && (
                    <div className="mt-4 sm:mt-16 border-t pt-4 sm:pt-10">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-6 px-1">
                        <ArchiveRestore className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-slate-500" />
                        <h3 className="text-sm sm:text-lg font-semibold text-slate-700">Archived Clients</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-4 opacity-80 hover:opacity-100 transition-opacity duration-300">
                        {archivedClients.map(client => (
                          <div key={client.id} className="bg-white border rounded-xl p-2 sm:p-4 flex items-center justify-between">
                            <div className="truncate mr-2 sm:mr-3">
                              <p className="font-semibold text-xs sm:text-base text-slate-900 truncate">{client.name}</p>
                              <p className="text-[10px] sm:text-sm text-slate-500">{client.unlimited ? 'Unlimited' : `${client.currentSessions}/${client.packageSize} sessions`}</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => unarchiveClient(client.id)} className="shrink-0 h-8 sm:h-9 text-[10px] sm:text-sm">
                              Restore
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="follow-up" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <FollowUpClientsSection clients={clients} viewMode={viewMode} onRefresh={refreshClients} />
                </TabsContent>

                <TabsContent value="classes" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <ClassManagement />
                </TabsContent>

                <TabsContent value="history" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <RenewalHistoryPage />
                </TabsContent>

                {isOwner && (
                  <>
                    <TabsContent value="services" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                      <ServicesManagement />
                    </TabsContent>
                    <TabsContent value="pricing" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                      <ClientPricingManagement />
                    </TabsContent>
                  </>
                )}
              </Tabs>
            </div>
          )}
        </main>
      </div>

      <AddClientModal open={isAddClientOpen} onOpenChange={setIsAddClientOpen} />

      {/* Archive Confirmation Dialog */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive {selectedClients.length} clients?</AlertDialogTitle>
            <AlertDialogDescription>
              These clients will be moved to the archived section. You can restore them later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkArchive}>Archive</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedClients.length} clients?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All client data and history will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DashboardPage;
