import React, { useState, useEffect, useRef, useMemo } from 'react';
import { supabase } from '../supabaseClient'; 
import { 
  Home, Users, Calendar, CalendarSearch, BarChart2, Package,
  Settings, LogOut, Search, Bell,
  ChevronLeft, ChevronRight, TrendingUp, TrendingDown, ArrowUpRight, RotateCw,
  DollarSign, Download, FileText, Plus, ArrowLeft, Copy, Check, Clock, MapPin, CheckSquare, X, Square, ArrowRight, Save, Trash2, Upload, Minus, LayoutGrid, List, Edit3, Lock, Monitor, Unlock, Sparkles, Send, Bot, MessageSquare
} from 'lucide-react';
import newLogo from '../assets/logo.svg';
import Papa from 'papaparse';

// --- Helper Functions ---
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const getDailyQuote = () => {
  const quotes = [
    "“What gets measured gets managed.” – Peter Drucker",
    "“Action is the foundational key to all success.” – Pablo Picasso",
    "“Success is the sum of small efforts, repeated day-in and day-out.” – Robert Collier",
    "“Don’t count the days, make the days count.” – Muhammad Ali",
    "“The secret of getting ahead is getting started.” – Mark Twain"
  ];
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = new Date() - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return quotes[dayOfYear % quotes.length];
};

const getInitials = (name) => {
  if (!name || name === 'Trainer') return 'T';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

const getLiveClientStatus = (client) => {
  if (client.status === 'Archived') return 'Archived';
  if (!client.expiry) return 'Active';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiryDate = new Date(client.expiry);
  expiryDate.setHours(0, 0, 0, 0);
  
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Expired';
  if (diffDays <= 10) return 'Expiring Soon';
  return 'Active';
};

export default function Dashboard() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [isArchiveMode, setIsArchiveMode] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [packageViewMode, setPackageViewMode] = useState('grid');
  const [packageSortBy, setPackageSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [showBacklogModal, setShowBacklogModal] = useState(false);
  const [backlogSelectedPrice, setBacklogSelectedPrice] = useState("");
  const [isCustomPackage, setIsCustomPackage] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [packages, setPackages] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [packagesList, setPackagesList] = useState([]);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [packageForm, setPackageForm] = useState({ name: '', type: 'Session Pack', session_count: 0, price: 0, validity_days: 30 });
  const fileInputRef = useRef(null);
  const historyFileInputRef = useRef(null);

  // --- CLASS MODE STATES ---
  const [showExitPinModal, setShowExitPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedClassClient, setSelectedClassClient] = useState(null);
  const [undoTargetClient, setUndoTargetClient] = useState(null);
  const [undoTargetTransactionId, setUndoTargetTransactionId] = useState(null);
  const [showUndoPinModal, setShowUndoPinModal] = useState(false);
  const [classSearchQuery, setClassSearchQuery] = useState('');
  
  // --- AI COPILOT STATES ---
  const [showAICopilot, setShowAICopilot] = useState(false);
  const [aiChatHistory, setAiChatHistory] = useState([
    { role: 'assistant', content: "Hello! I'm your TrackPoint Assistant. Ask me anything about your clients, revenue, or packages." }
  ]);
  const [aiMessage, setAiMessage] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const CLASS_PIN = '1234'; // Gym Owner PIN for Class Mode


  const handleOpenPackageModal = (pkg = null) => {
    if (pkg) {
      setEditingPackage(pkg);
      setPackageForm(pkg); // Pre-fill the form with existing data
    } else {
      setEditingPackage(null);
      setPackageForm({ name: '', type: 'Session Pack', session_count: 0, price: 0, validity_days: 30 }); // Blank slate
    }
    setIsPackageModalOpen(true);
  };

  const handlePackageSelection = (e) => {
  const selectedName = e.target.value;
  
  if (selectedName === "Custom") {
    setIsCustomPackage(true);
    setBacklogSelectedPrice(""); // Clear price for manual entry
  } else {
    setIsCustomPackage(false);
    // Find the package in your 'packages' list to get its price
    const pkg = packages.find(p => p.name === selectedName);
    if (pkg) {
      setBacklogSelectedPrice(pkg.price);
    }
  }
};

  const handleSavePackage = async () => {
    try {
      // Grab the logged-in trainer's ID
      const { data: { user } } = await supabase.auth.getUser();
      
      let error;
      if (editingPackage) {
        // Update existing package
        const { error: updateError } = await supabase.from('packages').update(packageForm).eq('id', editingPackage.id);
        error = updateError;
      } else {
        // Create new package
        const { error: insertError } = await supabase.from('packages').insert([{ ...packageForm, trainer_id: user?.id }]);
        error = insertError;
      }

      if (error) throw error;

      // Refresh the list instantly
      const { data } = await supabase.from('packages').select('*').order('price', { ascending: true });
      if (data) setPackagesList(data);
      setIsPackageModalOpen(false);
      
    } catch (err) {
      alert("Error saving package: " + err.message);
    }
  };

  const handleDeletePackage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package? Clients who already bought it will keep their sessions.")) return;
    try {
      const { error } = await supabase.from('packages').delete().eq('id', id);
      if (error) throw error;
      setPackagesList(prev => prev.filter(p => p.id !== id));
      setIsPackageModalOpen(false);
    } catch (err) {
      alert("Error deleting package: " + err.message);
    }
  };
  const [activeTab, setActiveTab] = useState('Month');
  
  // --- REAL DATA STATES ---
  const [clients, setClients] = useState([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);

  // --- State for Revenue Tab ---
  useEffect(() => {
    // 1. Fetch the initial data when the page first loads
    const fetchTransactions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data, error } = await supabase.from('transactions')
          .select('*')
          .eq('trainer_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        if (data) setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();

    // 2. 📻 THE MAGIC: Listen to the Supabase Realtime Radio Station
    const transactionChannel = supabase
      .channel('live-revenue')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'transactions' },
        (payload) => {
          console.log("💸 CHA-CHING! Live payment received:", payload.new);
          
          // Instantly add the new receipt to the top of the list!
          setTransactions((currentTransactions) => [payload.new, ...currentTransactions]);
        }
      )
      .subscribe();

    // 3. Cleanup the radio when the user logs out or leaves the page
    return () => {
      supabase.removeChannel(transactionChannel);
    };
  }, []);

  // --- TRAINER PROFILE ---
  const [trainerName, setTrainerName] = useState('Trainer');
  const [companyName, setCompanyName] = useState('TrackPoint');
  const [settingsForm, setSettingsForm] = useState({ full_name: '', company_name: '' });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState(null);

  // State for Client Management
  const [selectedClient, setSelectedClient] = useState(null);
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [editClientForm, setEditClientForm] = useState({});
  const [copiedLink, setCopiedLink] = useState(false);
  const [clientHistory, setClientHistory] = useState([]);

  const groupedHistory = useMemo(() => {
    const years = {};
    clientHistory.forEach(item => {
      const date = new Date(item.timestamp);
      const year = date.getFullYear();
      const monthName = date.toLocaleDateString('en-GB', { month: 'long' });
      
      if (!years[year]) {
        years[year] = {
          year: year,
          totalEarned: 0,
          sessionsCount: 0,
          months: {}
        };
      }
      
      if (!years[year].months[monthName]) {
        years[year].months[monthName] = {
          monthName: monthName,
          monthYear: `${monthName} ${year}`,
          items: [],
          totalEarned: 0,
          sessionsCount: 0,
          maxTimestamp: item.timestamp
        };
      }
      
      years[year].months[monthName].items.push(item);
      
      if (item.type === 'purchase' && Number(item.amount) > 0) {
        const amt = Number(item.amount);
        years[year].months[monthName].totalEarned += amt;
        years[year].totalEarned += amt;
      }
      if (item.type === 'usage') {
        years[year].months[monthName].sessionsCount += 1;
        years[year].sessionsCount += 1;
      }
    });
    return years;
  }, [clientHistory]);

  const [expandedMonths, setExpandedMonths] = useState({});
  const isMonthExpanded = (month) => expandedMonths[month] === true;
  const toggleMonth = (month) => {
    setExpandedMonths(prev => ({
      ...prev,
      [month]: !isMonthExpanded(month)
    }));
  };
  
  // Modals for Renewal & Manual Entry
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewForm, setRenewForm] = useState({ packageId: '', renewalDate: new Date().toISOString().split('T')[0], expiryDate: '', amount: 0, sessions: 0 });
  const [showLedgerModal, setShowLedgerModal] = useState(false);
  const [ledgerForm, setLedgerForm] = useState({ type: 'usage', title: '', amount: 0, date: new Date().toISOString().split('T')[0], time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), note: '', packageId: '', price: 0 });
  const [editingLedgerItem, setEditingLedgerItem] = useState(null);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkEntries, setBulkEntries] = useState([{ id: Date.now(), type: 'usage', title: '', amount: 1, date: new Date().toISOString().split('T')[0], time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), price: 0 }]);

  // State for Trainer Notes
  const [clientNotes, setClientNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSavedMsg, setNotesSavedMsg] = useState(false);
  
  // State for Schedule (NOW LIVE!)
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);

  // State for Todo List
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  // MEGA ADD CLIENT MODAL STATES
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [newClientData, setNewClientData] = useState({
    name: '', email: '', phone: '', dob: '', 
    package: '10 Class Pack', expiry_date: '', unlimited: false, 
    client_type: 'Group', member_status: 'Member', 
    initial_package: '', remaining_package: '', date_paid: ''
  });

  // ADD EVENT MODAL STATES (NEW!)
  const [showEventModal, setShowEventModal] = useState(false);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEventData, setNewEventData] = useState({
    title: '', date: '', time: '09:00 AM', duration: '60 min', type: 'Group Class', location: 'Main Floor', capacity: 10
  });

  const greeting = getGreeting();
  const quote = getDailyQuote();
  
  const todayFormattedFull = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const todayMonthDay = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const [userId, setUserId] = useState('trainer_default');
  const [showGoogleSyncModal, setShowGoogleSyncModal] = useState(false);
  const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(localStorage.getItem('google_calendar_connected') === 'true');
  const [isLinkingGoogle, setIsLinkingGoogle] = useState(false);
  const [copiedFeedLink, setCopiedFeedLink] = useState(false);

  const handleLinkGoogleCalendar = () => {
    setIsLinkingGoogle(true);
    setTimeout(() => {
      setIsLinkingGoogle(false);
      const newState = !isGoogleCalendarConnected;
      setIsGoogleCalendarConnected(newState);
      localStorage.setItem('google_calendar_connected', newState ? 'true' : 'false');
    }, 1500);
  };

  const handleCopyFeedLink = () => {
    const feedUrl = `${window.location.origin}/api/feeds/schedule.ics?trainer_id=${userId}`;
    navigator.clipboard.writeText(feedUrl);
    setCopiedFeedLink(true);
    setTimeout(() => setCopiedFeedLink(false), 2000);
  };

  const analyticsData = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const thisMonthTx = transactions.filter(t => {
      const d = new Date(t.created_at);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    });
    const lastMonthTx = transactions.filter(t => {
      const d = new Date(t.created_at);
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return d.getFullYear() === prevYear && d.getMonth() === prevMonth;
    });

    const thisMonthRev = thisMonthTx.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const lastMonthRev = lastMonthTx.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    let revenueGrowthStr = "+0.0%";
    let revenueGrowthPositive = true;
    if (lastMonthRev > 0) {
      const growth = ((thisMonthRev - lastMonthRev) / lastMonthRev) * 100;
      revenueGrowthStr = `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`;
      revenueGrowthPositive = growth >= 0;
    } else if (thisMonthRev > 0) {
      revenueGrowthStr = "+100.0%";
      revenueGrowthPositive = true;
    }

    const activeClientsCount = clients.filter(c => c.member_status === 'Member').length;
    const totalClientsCount = clients.length;
    const retentionRate = totalClientsCount > 0 
      ? ((activeClientsCount / totalClientsCount) * 100).toFixed(1) 
      : "100.0";

    let totalBooked = 0;
    let totalAttended = 0;
    sessions.forEach(s => {
      if (s.type !== 'Blocked' && s.attendees) {
        totalBooked += s.attendees.length;
        totalAttended += s.attendees.filter(a => a.status === 'Attended').length;
      }
    });
    const attendanceRate = totalBooked > 0 
      ? Math.round((totalAttended / totalBooked) * 100) 
      : 85;

    const packageCounts = {};
    clients.forEach(c => {
      if (c.package) {
        packageCounts[c.package] = (packageCounts[c.package] || 0) + 1;
      }
    });
    const packageStats = Object.keys(packageCounts).map(name => ({
      name,
      count: packageCounts[name]
    })).sort((a, b) => b.count - a.count);

    const totalPackageClients = packageStats.reduce((sum, p) => sum + p.count, 0) || 1;
    const topPackages = packageStats.slice(0, 3).map(p => ({
      name: p.name,
      percentage: Math.round((p.count / totalPackageClients) * 100)
    }));

    if (topPackages.length === 0) {
      topPackages.push(
        { name: "10 Session Pack", percentage: 45 },
        { name: "Monthly Unlimited", percentage: 35 },
        { name: "5 Session Pack", percentage: 20 }
      );
    }

    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      last6Months.push({
        label: d.toLocaleDateString('en-US', { month: 'short' }),
        year: d.getFullYear(),
        month: d.getMonth(),
        revenue: 0,
        clientCount: 0
      });
    }

    transactions.forEach(t => {
      const td = new Date(t.created_at);
      const ty = td.getFullYear();
      const tm = td.getMonth();
      const match = last6Months.find(m => m.year === ty && m.month === tm);
      if (match) {
        match.revenue += Number(t.amount) || 0;
      }
    });

    clients.forEach(c => {
      const cd = new Date(c.created_at);
      const cy = cd.getFullYear();
      const cm = cd.getMonth();
      const matchIndex = last6Months.findIndex(m => m.year === cy && m.month === cm);
      if (matchIndex !== -1) {
        for (let i = matchIndex; i < last6Months.length; i++) {
          last6Months[i].clientCount += 1;
        }
      }
    });

    const earliestChartDate = new Date(last6Months[0].year, last6Months[0].month, 1);
    const pre6MonthsClients = clients.filter(c => {
      const cd = new Date(c.created_at);
      return cd < earliestChartDate;
    }).length;

    last6Months.forEach(m => {
      m.clientCount += pre6MonthsClients;
    });

    return {
      revenueGrowthStr,
      revenueGrowthPositive,
      thisMonthRev,
      activeClientsCount,
      retentionRate,
      attendanceRate,
      topPackages,
      chartData: last6Months
    };
  }, [transactions, clients, sessions]);

  const svgPathRevenue = useMemo(() => {
    if (!analyticsData.chartData || analyticsData.chartData.length === 0) return "";
    const data = analyticsData.chartData;
    const maxRev = Math.max(...data.map(m => m.revenue), 100);
    const coords = data.map((m, idx) => {
      const x = 25 + idx * 90;
      const y = 220 - (m.revenue / maxRev) * 180;
      return { x, y };
    });
    let path = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      const cpX1 = coords[i-1].x + 45;
      const cpY1 = coords[i-1].y;
      const cpX2 = coords[i].x - 45;
      const cpY2 = coords[i].y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${coords[i].x} ${coords[i].y}`;
    }
    return path;
  }, [analyticsData.chartData]);

  const svgPathClients = useMemo(() => {
    if (!analyticsData.chartData || analyticsData.chartData.length === 0) return "";
    const data = analyticsData.chartData;
    const maxClients = Math.max(...data.map(m => m.clientCount), 5);
    const coords = data.map((m, idx) => {
      const x = 25 + idx * 90;
      const y = 220 - (m.clientCount / maxClients) * 180;
      return { x, y };
    });
    let path = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      const cpX1 = coords[i-1].x + 45;
      const cpY1 = coords[i-1].y;
      const cpX2 = coords[i].x - 45;
      const cpY2 = coords[i].y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${coords[i].x} ${coords[i].y}`;
    }
    return path;
  }, [analyticsData.chartData]);

  useEffect(() => {
    const fetchPackages = async () => {
      const { data, error } = await supabase.from('packages').select('*').order('price', { ascending: true });
      if (data) setPackagesList(data);
    };
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    const { data } = await supabase.from('packages').select('*').order('name');
    if (data) setPackages(data);
  };

  useEffect(() => {
    const fetchPackages = async () => {
      const { data, error } = await supabase.from('packages').select('*');
      if (data) setPackages(data);
      if (error) console.error("Error fetching packages:", error);
    };
    
    fetchPackages();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      setClientNotes(selectedClient.notes || '');
      setEditClientForm({
        name: selectedClient.name || '',
        email: selectedClient.email || '',
        phone: selectedClient.phone || '',
        client_type: selectedClient.client_type || 'Group',
        member_status: selectedClient.member_status || 'Member',
        package: selectedClient.package || '',
        expiry: selectedClient.expiry || '',
        initial_package: selectedClient.initial_package || 0,
        remaining_package: selectedClient.remaining_package || 0,
        dob: selectedClient.dob || '',
        date_paid: selectedClient.date_paid || ''
      });
      setIsEditingClient(false); // Reset to read-only when clicking a new client
      fetchClientHistory(selectedClient);
    }
  }, [selectedClient]);

  const fetchClientHistory = async (client) => {
    if (!client) return;
    // Fetch Transactions
    const { data: transData } = await supabase.from('transactions')
      .select('*')
      .or(`client_name.eq."${client.id}",client_name.eq."${client.name}"`)
      .order('created_at', { ascending: false });
    
    // Fetch Bookings (Attended)
    const { data: bookData } = await supabase.from('bookings')
      .select(`
        id,
        status,
        created_at,
        sessions (
          title,
          date,
          time
        )
      `)
      .eq('client_id', client.id)
      .eq('status', 'Attended')
      .order('created_at', { ascending: false });

    const history = [
      ...(transData || []).map(t => {
        const type = t.amount > 0 ? 'purchase' : (
          t.description?.toLowerCase().includes('adjustment') || 
          t.description?.toLowerCase().includes('check-in') || 
          t.description?.toLowerCase().includes('usage') ||
          t.description?.toLowerCase().includes('session') ||
          t.description?.toLowerCase().includes('class')
        ) ? 'usage' : 'note';
        
        const match = t.description?.match(/(\d+)\s*Session/i);
        const sessionCount = match ? parseInt(match[1]) : 1;

        return {
          id: t.id,
          dbTable: 'transactions',
          type,
          title: t.description || 'Package Purchased',
          detail: t.amount > 0 ? `Paid RM ${t.amount} • ${t.is_backlog ? 'Historical Record' : 'Direct Payment'}` : `Record • ${t.is_backlog ? 'Historical' : 'System'}`,
          date: new Date(t.created_at).toLocaleDateString('en-GB'),
          rawDate: new Date(t.created_at).toISOString().split('T')[0],
          time: new Date(t.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          rawTime: new Date(t.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          timestamp: new Date(t.created_at).getTime(),
          amount: t.amount,
          sessionCount,
          isEditable: true // Transactions added manually are editable
        };
      }),
      ...(bookData || []).map(b => ({
        id: b.id,
        dbTable: 'bookings',
        type: 'usage',
        title: `Attended ${b.sessions?.title || 'Session'}`,
        detail: `1 Credit Used`,
        date: b.sessions ? new Date(b.sessions.date).toLocaleDateString('en-GB') : new Date(b.created_at).toLocaleDateString('en-GB'),
        time: b.sessions?.time || new Date(b.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        timestamp: b.sessions ? new Date(b.sessions.date + ' ' + b.sessions.time).getTime() : new Date(b.created_at).getTime()
      }))
    ].sort((a, b) => b.timestamp - a.timestamp);

    setClientHistory(history);
  };

  // --- FETCH INITIAL DATA ON LOAD ---
  useEffect(() => {
    const fetchInitialData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      // Fetch Profile
      const { data: profileData, error: profileError } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (profileData) {
        setTrainerName(profileData.full_name || 'Trainer');
        setCompanyName(profileData.company_name || 'TrackPoint');
        setSettingsForm({ full_name: profileData.full_name || '', company_name: profileData.company_name || '' });
      } else if (profileError && profileError.code === 'PGRST116') {
        await supabase.from('profiles').insert([{ id: user.id }]);
      }

      // Fetch Todos
      const { data: todosData } = await supabase.from('todos').select('*').eq('trainer_id', user.id).order('created_at', { ascending: true });
      if (todosData) setTodos(todosData);

      fetchLiveSchedule(user.id);

      // Fetch Clients
      setIsLoadingClients(true);
      const { data: clientData } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
      if (clientData) setClients(clientData);
      setIsLoadingClients(false);
    };
    fetchInitialData();
  }, []);

  const fetchClients = async () => {
    const { data } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    if (data) setClients(data);
  };

  const fetchSessions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase.from('sessions').select('*').eq('trainer_id', user.id).order('date', { ascending: true }).order('time', { ascending: true });
    if (data) {
      const formattedSessions = data.map(s => ({ ...s, attendees: [] }));
      setSessions(formattedSessions);
      if (!selectedSession && formattedSessions.length > 0) setSelectedSession(formattedSessions[0]);
    }
  };

  // --- SCHEDULE HANDLERS (NEW!) ---
  const handleAddEvent = async (e) => {
    e.preventDefault();
    setIsAddingEvent(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('sessions').insert([{
        trainer_id: user.id,
        title: newEventData.title,
        date: newEventData.date,
        time: newEventData.time,
        duration: newEventData.duration,
        type: newEventData.type,
        location: newEventData.location,
        capacity: newEventData.type === '1-on-1' ? 1 : parseInt(newEventData.capacity)
      }]);

      if (error) throw error;
      setShowEventModal(false);
      setNewEventData({ title: '', date: '', time: '09:00 AM', duration: '60 min', type: 'Group Class', location: 'Main Floor', capacity: 10 });
      fetchSessions();
    } catch (error) {
      alert("Error adding event: " + error.message);
    } finally {
      setIsAddingEvent(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsMessage(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('profiles')
        .update({ full_name: settingsForm.full_name, company_name: settingsForm.company_name, updated_at: new Date() })
        .eq('id', user.id);
      if (error) throw error;
      setTrainerName(settingsForm.full_name);
      setCompanyName(settingsForm.company_name);
      setSettingsMessage("Profile updated successfully!");
      setTimeout(() => setSettingsMessage(null), 3000);
    } catch (error) {
      alert("Error updating profile: " + error.message);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    setIsAddingClient(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('clients')
        .insert([{
            trainer_id: user.id,
            name: newClientData.name,
            email: newClientData.email,
            phone: newClientData.phone,
            dob: newClientData.dob || null,
            package: newClientData.package,
            expiry: newClientData.expiry_date || null,
            unlimited: newClientData.unlimited,
            client_type: newClientData.client_type,
            member_status: newClientData.member_status,
            initial_package: parseInt(newClientData.initial_package) || 0,
            remaining_package: parseInt(newClientData.remaining_package) || 0,
            date_paid: newClientData.date_paid || null,
            total_sessions: parseInt(newClientData.initial_package) || 0,
            used_sessions: (parseInt(newClientData.initial_package) || 0) - (parseInt(newClientData.remaining_package) || 0),
            status: 'Active'
        }]);

      if (error) throw error;
      setShowAddModal(false);
      setNewClientData({ name: '', email: '', phone: '', dob: '', package: '10 Class Pack', expiry_date: '', unlimited: false, client_type: 'Group', member_status: 'Member', initial_package: '', remaining_package: '', date_paid: '' });
      fetchClients();
    } catch (error) {
      alert("Error adding client: " + error.message);
    } finally {
      setIsAddingClient(false);
    }
  };

  const handleArchiveClient = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Archived' ? 'Active' : 'Archived';
      const { error } = await supabase.from('clients').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      
      if (selectedClient && selectedClient.id === id) {
        setSelectedClient({ ...selectedClient, status: newStatus });
        if (newStatus === 'Archived' && !isArchiveMode) {
            setSelectedClient(null); // Close the card if we archived it and we aren't in archive mode
        }
      }
      fetchClients();
    } catch (error) {
      alert("Error archiving client: " + error.message);
    }
  };

  const handleDeleteClient = async (id) => {
    if (!window.confirm("Are you sure you want to PERMANENTLY delete this client? This cannot be undone.")) return;
    try {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;
      
      if (selectedClient && selectedClient.id === id) {
        setSelectedClient(null);
      }
      fetchClients();
    } catch (error) {
      alert("Error deleting client: " + error.message);
    }
  };

  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error("Not authenticated");

          const clientsToInsert = results.data
            .filter(row => row['Full Name'] || row['Name']) // Only mandatory field
            .map(row => {
              const name = row['Full Name'] || row['Name'] || '';
              const dob = row['Date of Birth'] || row['DOB'] || null;
              const email = row['Email'] || '';
              const phone = row['Phone'] || '';
              const clientType = row['Client Type'] || 'Group';
              const memberStatus = row['Member Status'] || 'Member';
              const packageType = row['Package Type'] || row['Package'] || '10 Class Pack';
              const initialPkg = parseInt(row['Initial Pkg'] || row['Initial Package']) || 0;
              const remainingPkg = parseInt(row['Remaining'] || row['Remaining Package']) || 0;
              const datePaid = row['Date Paid'] || null;
              const expiryDate = row['Expiry Date'] || null;

              return {
                trainer_id: user.id,
                name: name,
                dob: dob,
                email: email,
                phone: phone,
                client_type: clientType,
                member_status: memberStatus,
                package: packageType,
                initial_package: initialPkg,
                remaining_package: remainingPkg,
                date_paid: datePaid,
                expiry: expiryDate,
                unlimited: false, // Default to false
                total_sessions: initialPkg,
                used_sessions: initialPkg - remainingPkg,
                status: 'Active'
              };
            });

          if (clientsToInsert.length === 0) {
            alert("No valid clients found in the CSV. Make sure there is a 'Full Name' or 'Name' column.");
            return;
          }

          const { error } = await supabase.from('clients').insert(clientsToInsert);
          
          if (error) throw error;
          
          alert(`Successfully imported ${clientsToInsert.length} clients!`);
          setShowAddModal(false);
          fetchClients();
          
        } catch (error) {
          console.error("Error importing clients:", error);
          alert("Error importing clients: " + error.message);
        } finally {
          // Reset the file input
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      },
      error: (error) => {
        console.error("CSV Parse Error:", error);
        alert("Error parsing CSV file.");
      }
    });
  };

  const handleDownloadCSVTemplate = () => {
    const headers = "Full Name,Email,Phone,Date of Birth,Client Type,Member Status,Package Type,Initial Pkg,Remaining,Date Paid,Expiry Date\n";
    const example = "Jane Doe,jane@example.com,+1 (555) 123-4567,1990-01-01,Group,Member,10 Class Pack,10,10,2024-01-01,2024-12-31\n";
    const csvContent = "data:text/csv;charset=utf-8," + headers + example;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "client_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadHistoryTemplate = () => {
    const headers = "Date,Time,Type,Description,Amount,Price\n";
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const example = `${date},${time},purchase,Bought 10 Class Pack,10,250\n${date},${time},usage,Personal Training,1,0`;
    const csvContent = "data:text/csv;charset=utf-8," + headers + example;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "history_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportHistoryCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const newEntries = results.data.map((row, index) => ({
          id: Date.now() + index,
          date: row.Date || new Date().toISOString().split('T')[0],
          time: row.Time || new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          type: (row.Type || 'usage').toLowerCase(),
          title: row.Description || '',
          amount: parseFloat(row.Amount) || 0,
          price: parseFloat(row.Price) || 0
        }));

        if (newEntries.length > 0) {
          setBulkEntries([...bulkEntries.filter(e => e.title || e.amount !== 1), ...newEntries]);
          alert(`Imported ${newEntries.length} rows!`);
        }
      }
    });
    if (historyFileInputRef.current) historyFileInputRef.current.value = "";
  };

  const handlePasteHistory = (e) => {
    const pastedText = e.target.value;
    if (!pastedText.trim()) return;

    const lines = pastedText.trim().split(/\r?\n/);
    const newEntries = lines.map((line, index) => {
      // Split by tab (Excel/Sheets default) or comma
      const cols = line.includes('\t') ? line.split('\t') : line.split(',');
      return {
        id: Date.now() + index,
        date: cols[0]?.trim() || new Date().toISOString().split('T')[0],
        time: cols[1]?.trim() || new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        type: (cols[2]?.trim() || 'usage').toLowerCase(),
        title: cols[3]?.trim() || '',
        amount: parseFloat(cols[4]) || 0,
        price: parseFloat(cols[5]) || 0
      };
    });

    if (newEntries.length > 0) {
      setBulkEntries([...bulkEntries.filter(e => e.title || e.amount !== 1), ...newEntries]);
      e.target.value = ""; // Clear the paste area
      alert(`Pasted ${newEntries.length} rows!`);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from('todos').insert([{ trainer_id: user.id, text: newTodo }]).select().single();
    if (!error && data) {
      setTodos([...todos, data]);
      setNewTodo('');
    }
  };

  const handleAddBacklog = async (backlogData) => {
    try {
      // 1. Get the current logged-in trainer's ID directly from Supabase
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) throw new Error("No logged in user found");

      const { error } = await supabase
        .from('transactions')
        .insert([{
          client_name: backlogData.clientId,
          amount: parseFloat(backlogData.amount),
          description: backlogData.packageName,
          trainer_id: authUser.id, // Use the ID we just fetched
          is_backlog: true,
          created_at: new Date(backlogData.date).toISOString()
        }]);

      if (error) throw error;
      
      setShowBacklogModal(false);
      alert("Historical data synced!");
    } catch (err) {
      alert("Error saving history: " + err.message);
    }
  };

  const toggleTodo = async (id, currentStatus) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !currentStatus } : t));
    await supabase.from('todos').update({ done: !currentStatus }).eq('id', id);
  };

  const handleUpdateTodo = async (id) => {
    if (!editValue.trim()) return setEditingTodoId(null);
  
    try {
      const { error } = await supabase
        .from('todos')
        .update({ task: editValue })
        .eq('id', id);
  
      if (error) throw error;
  
      // Update local state so it changes instantly on screen
      setTodos(todos.map(t => t.id === id ? { ...t, task: editValue } : t));
      setEditingTodoId(null);
    } catch (error) {
      console.error("Error updating todo:", error.message);
    }
  };
  
  const deleteTodo = async (id) => {
    setTodos(todos.filter(t => t.id !== id));
    await supabase.from('todos').delete().eq('id', id);
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    const { error } = await supabase.from('clients').update({ notes: clientNotes }).eq('id', selectedClient.id);
    setIsSavingNotes(false);
    if (error) {
      alert("Error saving notes: " + error.message);
    } else {
      setSelectedClient({ ...selectedClient, notes: clientNotes });
      setClients(clients.map(c => c.id === selectedClient.id ? { ...c, notes: clientNotes } : c));
      setNotesSavedMsg(true);
      setTimeout(() => setNotesSavedMsg(false), 2000);
    }
  };

  const handleCopyLink = () => {
    const linkToCopy = `${window.location.origin}/client/${selectedClient.id}`;
    navigator.clipboard.writeText(linkToCopy);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleLogout = async () => await supabase.auth.signOut();

  const fetchLiveSchedule = async (trainerId) => {
    // Fetch Sessions
    const { data: sessionsData } = await supabase.from('sessions').select('*').eq('trainer_id', trainerId).order('date', { ascending: true }).order('time', { ascending: true });
    // Fetch Bookings joined with Client Names
    const { data: bookingsData } = await supabase.from('bookings').select('*, clients(name)');
    
    if (sessionsData) {
      const formattedSessions = sessionsData.map(session => {
        const sessionBookings = (bookingsData || []).filter(b => b.session_id === session.id);
        return {
          ...session,
          attendees: sessionBookings.map(b => ({
            booking_id: b.id,
            client_id: b.client_id,
            name: b.clients?.name || 'Unknown',
            status: b.status || 'Booked'
          }))
        };
      });
      setSessions(formattedSessions);
      if (formattedSessions.length > 0 && !selectedSession) setSelectedSession(formattedSessions[0]);
    }
  };

  const adjustSessions = async (amount) => {
    if (!selectedClient) return;
    const newRemaining = Math.max(0, selectedClient.remaining_package + amount);
    // If deducting, increase used sessions
    const newUsed = amount < 0 ? selectedClient.used_sessions + Math.abs(amount) : selectedClient.used_sessions;
    
    // Optimistic Update
    const updatedClient = { ...selectedClient, remaining_package: newRemaining, used_sessions: newUsed };
    setSelectedClient(updatedClient);
    setClients(clients.map(c => c.id === selectedClient.id ? updatedClient : c));
    
    // DB Update
    await supabase.from('clients').update({ remaining_package: newRemaining, used_sessions: newUsed }).eq('id', selectedClient.id);
    
    // Log Activity in Ledger
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('transactions').insert([{
      trainer_id: user?.id,
      client_name: selectedClient.id,
      amount: 0,
      description: `Manual adjustment: ${amount > 0 ? '+' : ''}${amount} Session(s)`,
      is_backlog: true,
      created_at: new Date().toISOString()
    }]);

    if (amount < 0) {
      await supabase.from('client_metrics').update({ used_sessions: newUsed }).eq('client_id', selectedClient.id);
    }
    fetchClientHistory(updatedClient);
  };

  const handleRenewPackage = () => {
    // Open the modal instead of direct action
    const currentPkg = packagesList.find(p => p.name === selectedClient.package) || packagesList[0];
    setRenewForm({
      packageId: currentPkg?.id || '',
      renewalDate: new Date().toISOString().split('T')[0],
      expiryDate: '', // Will be calculated based on selection
      amount: currentPkg?.price || 0,
      sessions: currentPkg?.session_count || 0
    });
    setShowRenewModal(true);
  };

  const processRenewal = async () => {
    const selectedPkg = packagesList.find(p => p.id === renewForm.packageId);
    if (!selectedPkg) return alert("Please select a package.");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const renDate = new Date(renewForm.renewalDate);
      // If expiry date is manually set, use it. Otherwise calculate.
      let expDateStr = renewForm.expiryDate;
      if (!expDateStr) {
        const calculatedExp = new Date(renDate.getTime() + (selectedPkg.validity_days * 24 * 60 * 60 * 1000));
        expDateStr = calculatedExp.toISOString().split('T')[0];
      }

      // 1. Log Transaction
      const { error: transError } = await supabase.from('transactions').insert([{
        trainer_id: user.id,
        client_name: selectedClient.id,
        amount: renewForm.amount,
        description: `Renewal: ${selectedPkg.name}`,
        created_at: renDate.toISOString()
      }]);
      if (transError) throw transError;

      // 2. Update Client
      const newRemaining = (selectedClient.remaining_package || 0) + parseInt(renewForm.sessions);
      const newInitial = (selectedClient.initial_package || 0) + parseInt(renewForm.sessions);

      const { error: clientError } = await supabase.from('clients').update({
        package: selectedPkg.name,
        remaining_package: newRemaining,
        initial_package: newInitial,
        expiry: expDateStr,
        status: 'Active',
        date_paid: renDate.toISOString().split('T')[0]
      }).eq('id', selectedClient.id);
      
      if (clientError) throw clientError;

      alert("Package renewed!");
      setShowRenewModal(false);
      
      // Update local state
      const updatedClient = { ...selectedClient, package: selectedPkg.name, remaining_package: newRemaining, initial_package: newInitial, expiry: expDateStr, status: 'Active' };
      setSelectedClient(updatedClient);
      setClients(clients.map(c => c.id === selectedClient.id ? updatedClient : c));
      fetchClientHistory(updatedClient);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleDeleteHistoryEntry = async (item) => {
    if (!window.confirm("Delete this entry from history? This will NOT revert session counts automatically.")) return;
    
    try {
      const { error } = await supabase.from(item.dbTable).delete().eq('id', item.id);
      if (error) throw error;
      
      setClientHistory(prev => prev.filter(h => h.id !== item.id));
    } catch (err) {
      alert("Error deleting entry: " + err.message);
    }
  };

  const handleEditHistoryEntry = (item) => {
    if (item.dbTable !== 'transactions') return alert("This entry is linked to a scheduled class and cannot be edited from here. Please manage it via the Schedule tab.");
    
    const cleanTitle = item.title.startsWith('Note: ') ? item.title.substring(6) : item.title;
    
    setEditingLedgerItem(item);
    setLedgerForm({
      type: item.type,
      title: cleanTitle,
      amount: item.sessionCount || 1,
      date: item.rawDate,
      time: item.rawTime || new Date(item.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      price: item.amount || 0,
      packageId: ''
    });
    setShowLedgerModal(true);
  };

  const handleManualLedgerEntry = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const renDate = new Date(`${ledgerForm.date}T${ledgerForm.time || '12:00'}`);

      if (editingLedgerItem) {
        // UPDATE Existing
        const updateData = {
          description: ledgerForm.type === 'note' 
            ? (ledgerForm.title.startsWith('Note: ') ? ledgerForm.title : `Note: ${ledgerForm.title}`)
            : (ledgerForm.type === 'usage' 
               ? (ledgerForm.title || `Manual Adjustment: ${ledgerForm.amount} Sessions`)
               : ledgerForm.title),
          amount: ledgerForm.type === 'purchase' ? ledgerForm.price : 0,
          created_at: renDate.toISOString()
        };
        const { error } = await supabase.from('transactions').update(updateData).eq('id', editingLedgerItem.id);
        if (error) throw error;
        alert("Entry updated!");
      } else {
        // CREATE New
        if (ledgerForm.type === 'purchase') {
          const selectedPkg = packagesList.find(p => p.id === ledgerForm.packageId);
          // 1. Log Transaction
          const { error: transError } = await supabase.from('transactions').insert([{
            trainer_id: user.id,
            client_name: selectedClient.id,
            amount: ledgerForm.price,
            description: ledgerForm.title || `Purchase: ${selectedPkg?.name || 'Package'}`,
            is_backlog: true,
            created_at: renDate.toISOString()
          }]);
          if (transError) throw transError;

          // 2. Update Client balance
          const newRemaining = (selectedClient.remaining_package || 0) + parseInt(ledgerForm.amount);
          const newInitial = (selectedClient.initial_package || 0) + parseInt(ledgerForm.amount);
          
          await supabase.from('clients').update({
            remaining_package: newRemaining,
            initial_package: newInitial,
            date_paid: renDate.toISOString().split('T')[0]
          }).eq('id', selectedClient.id);

          const updatedClient = { ...selectedClient, remaining_package: newRemaining, initial_package: newInitial };
          setSelectedClient(updatedClient);
          setClients(clients.map(c => c.id === selectedClient.id ? updatedClient : c));
        } else if (ledgerForm.type === 'usage') {
          const { error } = await supabase.from('transactions').insert([{
            trainer_id: user.id,
            client_name: selectedClient.id,
            amount: 0,
            description: ledgerForm.title || `Manual Adjustment: ${ledgerForm.amount} Sessions`,
            is_backlog: true,
            created_at: renDate.toISOString()
          }]);
          if (error) throw error;
          
          const newRemaining = Math.max(0, (selectedClient.remaining_package || 0) - parseInt(ledgerForm.amount));
          await supabase.from('clients').update({ remaining_package: newRemaining }).eq('id', selectedClient.id);
          
          const updatedClient = { ...selectedClient, remaining_package: newRemaining };
          setSelectedClient(updatedClient);
          setClients(clients.map(c => c.id === selectedClient.id ? updatedClient : c));
        } else {
          const { error } = await supabase.from('transactions').insert([{
            trainer_id: user.id,
            client_name: selectedClient.id,
            amount: 0,
            description: `Note: ${ledgerForm.title}`,
            is_backlog: true,
            created_at: renDate.toISOString()
          }]);
          if (error) throw error;
        }
      }
      
      setShowLedgerModal(false);
      setEditingLedgerItem(null);
      setLedgerForm({ type: 'usage', title: '', amount: 0, date: new Date().toISOString().split('T')[0], time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), note: '', packageId: '', price: 0 });
      fetchClientHistory(selectedClient);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleBulkLedgerEntry = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const transactionsToInsert = [];
      let sessionsToAdjust = 0;

      for (const entry of bulkEntries) {
        if (!entry.title && entry.type !== 'purchase') continue;
        
        const renDate = new Date(`${entry.date}T${entry.time || '12:00'}`);
        let finalTitle = entry.title;
        let amount = 0;

        if (entry.type === 'purchase') {
          amount = parseFloat(entry.price) || 0;
          sessionsToAdjust += parseInt(entry.amount) || 0;
          if (!finalTitle) finalTitle = "Package Purchase";
        } else if (entry.type === 'usage') {
          sessionsToAdjust -= parseInt(entry.amount) || 0;
          if (!finalTitle) finalTitle = "Session Usage";
        }

        transactionsToInsert.push({
          trainer_id: user.id,
          client_name: selectedClient.id,
          amount: amount,
          description: finalTitle,
          is_backlog: true,
          created_at: renDate.toISOString()
        });
      }

      if (transactionsToInsert.length === 0) return alert("No valid entries to save.");

      // 1. Insert all transactions
      const { error: transError } = await supabase.from('transactions').insert(transactionsToInsert);
      if (transError) throw transError;

      // 2. Update client balance if needed
      if (sessionsToAdjust !== 0) {
        const newRemaining = Math.max(0, (selectedClient.remaining_package || 0) + sessionsToAdjust);
        const { error: clientError } = await supabase.from('clients').update({ remaining_package: newRemaining }).eq('id', selectedClient.id);
        if (clientError) throw clientError;

        const updatedClient = { ...selectedClient, remaining_package: newRemaining };
        setSelectedClient(updatedClient);
        setClients(clients.map(c => c.id === selectedClient.id ? updatedClient : c));
      }

      alert(`Successfully saved ${transactionsToInsert.length} entries!`);
      setShowLedgerModal(false);
      setIsBulkMode(false);
      setBulkEntries([{ id: Date.now(), type: 'usage', title: '', amount: 1, date: new Date().toISOString().split('T')[0], time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), price: 0 }]);
      fetchClientHistory(selectedClient);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleUpdateClient = async () => {
    try {
      // Detect if sessions were manually changed to log it
      const sessionsChanged = editClientForm.initial_package !== selectedClient.initial_package || 
                               editClientForm.remaining_package !== selectedClient.remaining_package;

      const { error } = await supabase.from('clients').update(editClientForm).eq('id', selectedClient.id);
      if (error) throw error;
      
      if (sessionsChanged) {
        const { data: { user } } = await supabase.auth.getUser();
        await supabase.from('transactions').insert([{
          trainer_id: user?.id,
          client_name: selectedClient.id,
          amount: 0,
          description: `Profile Update: Adjusted sessions to ${editClientForm.remaining_package}/${editClientForm.initial_package}`,
          is_backlog: true,
          created_at: new Date().toISOString()
        }]);
      }

      // Instantly update the UI without reloading
      const updatedClient = { ...selectedClient, ...editClientForm };
      setSelectedClient(updatedClient);
      setClients(clients.map(c => c.id === selectedClient.id ? updatedClient : c));
      setIsEditingClient(false);
      fetchClientHistory(updatedClient);
    } catch (error) {
      alert("Error updating client: " + error.message);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction record? This will NOT revert any client package balances automatically.")) return;
    try {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) throw error;
      setTransactions(curr => curr.filter(t => t.id !== id));
      alert("Transaction deleted successfully.");
    } catch (err) {
      alert("Error deleting transaction: " + err.message);
    }
  };

  const handleDeleteSession = async (id) => {
    if (!window.confirm("Are you sure you want to cancel and delete this session/event? All bookings for this session will also be removed.")) return;
    try {
      // 1. Delete associated bookings
      await supabase.from('bookings').delete().eq('session_id', id);
      
      // 2. Delete the session
      const { error } = await supabase.from('sessions').delete().eq('id', id);
      if (error) throw error;
      
      // 3. Update UI states
      setSessions(curr => curr.filter(s => s.id !== id));
      setSelectedSession(null);
      alert("Session cancelled and deleted successfully.");
    } catch (err) {
      alert("Error deleting session: " + err.message);
    }
  };

  const toggleAttendance = async (bookingId, currentStatus) => {
    const newStatus = currentStatus === 'Attended' ? 'Booked' : 'Attended';
    
    // Optimistic Update
    const updatedSessions = sessions.map(s => {
      if (s.id === selectedSession.id) {
        return { ...s, attendees: s.attendees.map(a => a.booking_id === bookingId ? { ...a, status: newStatus } : a) };
      }
      return s;
    });
    setSessions(updatedSessions);
    setSelectedSession(updatedSessions.find(s => s.id === selectedSession.id));

    // DB Update
    await supabase.from('bookings').update({ status: newStatus }).eq('id', bookingId);
  };
    
    // Optimistic Update
  // Helper to format dates coming from the database
  const formatDbDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB'); // Formats as DD/MM/YYYY
  };

  // --- LIVE DASHBOARD MATH ---
  // Calculate Live Revenue (This Month)
  // --- MASTER DATE VARIABLES ---
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const totalCollectedThisMonth = transactions
    .filter(t => {
      const d = new Date(t.created_at);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + Number(t.amount), 0);

    // --- DYNAMIC REVENUE CHART MATH ---
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const chartData = monthNames.map((name, index) => ({
    label: name,
    month: index,
    year: new Date().getFullYear(),
    amount: 0
  }));

  // Drop transactions into buckets
  transactions.forEach(t => {
    // We use a more robust date parser here
    const date = new Date(t.created_at.replace(' ', 'T')); 
    const tMonth = date.getMonth();
    const tYear = date.getFullYear();

    if (tYear === currentYear) {
      chartData[tMonth].amount += Number(t.amount) || 0;
    }
  });

  const maxAmountFound = Math.max(...chartData.map(d => d.amount), 0);
  const maxChartAmount = maxAmountFound > 0 ? maxAmountFound : 1000;

  // DEBUG: Right-click dashboard -> Inspect -> Console to see this:
  console.log("Chart calculation check:", { 
    totalTransactions: transactions.length, 
    maxAmountFound, 
    aprilAmount: chartData[3].amount 
  });

  // Quick fallback for Projected Renewals
  const activeClientsCount = clients?.length || 0;
  const lowestPackagePrice = packagesList?.length > 0 ? packagesList[0].price : 0;
  const estimatedRevenue = activeClientsCount * lowestPackagePrice;
  
  // 1. Live Birthdays (Clients born in the current month)
  const liveBirthdays = clients.filter(c => {
    if (!c.dob) return false;
    const dob = new Date(c.dob);
    return dob.getMonth() === currentMonth;
  });

  // 2. Upcoming Expiries (Clients expiring in the next 14 days)
  const fourteenDaysFromNow = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
  const liveExpiries = clients.filter(c => {
    if (!c.expiry || c.unlimited) return false;
    const expiryDate = new Date(c.expiry);
    return expiryDate >= today && expiryDate <= fourteenDaysFromNow;
  });

  const filteredClients = clients.filter(c => {
    const isArchived = c.status === 'Archived';
    if (isArchiveMode && !isArchived) return false;
    if (!isArchiveMode && isArchived) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        (c.name || '').toLowerCase().includes(q) || 
        (c.email || '').toLowerCase().includes(q) ||
        (c.phone || '').toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }
    
    if (activeTab === 'All Clients' || searchQuery) return true;
    const liveStatus = getLiveClientStatus(c);
    return liveStatus === activeTab;
  });

  const sortedAndFilteredClients = [...filteredClients].sort((a, b) => {
    if (sortBy === 'az') return (a.name || '').localeCompare(b.name || '');
    if (sortBy === 'za') return (b.name || '').localeCompare(a.name || '');
    if (sortBy === 'expire') {
      if (!a.expiry) return 1;
      if (!b.expiry) return -1;
      return new Date(a.expiry).getTime() - new Date(b.expiry).getTime();
    }
    if (sortBy === 'sessions') {
      const aSessions = parseInt(a.remaining_package) || 0;
      const bSessions = parseInt(b.remaining_package) || 0;
      return bSessions - aSessions; // descending
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); // newest
  });

  const sortedPackages = [...packagesList].sort((a, b) => {
    if (packageSortBy === 'az') return (a.name || '').localeCompare(b.name || '');
    if (packageSortBy === 'za') return (b.name || '').localeCompare(a.name || '');
    if (packageSortBy === 'price_low') return a.price - b.price;
    if (packageSortBy === 'price_high') return b.price - a.price;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // --- CLASS MODE HANDLERS ---
  const handleConfirmClassCheckIn = async () => {
    if (!selectedClassClient) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const client = selectedClassClient;
      
      const { data: transData, error: transError } = await supabase.from('transactions').insert([{
        trainer_id: user?.id,
        client_name: client.id,
        amount: 0,
        description: `Class Mode Check-in`,
        is_backlog: false,
        created_at: new Date().toISOString()
      }]).select('*').single();
      
      if (transError) throw transError;
      
      let newRemaining = client.remaining_package;
      if (!client.unlimited) {
         newRemaining = Math.max(0, (client.remaining_package || 0) - 1);
         await supabase.from('clients').update({ remaining_package: newRemaining }).eq('id', client.id);
      }
      
      setUndoTargetTransactionId(transData?.id);
      setUndoTargetClient({ ...client, remaining_package: newRemaining });
      
      const updatedClient = { ...client, remaining_package: newRemaining };
      setClients(clients.map(c => c.id === client.id ? updatedClient : c));
      
      setShowCheckInModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      alert("Error checking in: " + err.message);
    }
  };

  const handleUndoClassCheckIn = async () => {
    if (pinInput !== CLASS_PIN) {
      alert("Incorrect PIN");
      return;
    }
    try {
      if (undoTargetTransactionId) {
        await supabase.from('transactions').delete().eq('id', undoTargetTransactionId);
      }
      if (undoTargetClient && !undoTargetClient.unlimited) {
        const revertedRemaining = (undoTargetClient.remaining_package || 0) + 1;
        await supabase.from('clients').update({ remaining_package: revertedRemaining }).eq('id', undoTargetClient.id);
        const updatedClient = { ...undoTargetClient, remaining_package: revertedRemaining };
        setClients(clients.map(c => c.id === undoTargetClient.id ? updatedClient : c));
      }
      setShowUndoPinModal(false);
      setShowSuccessModal(false);
      setPinInput('');
      setUndoTargetTransactionId(null);
      setUndoTargetClient(null);
      alert("Check-in reversed successfully.");
    } catch (err) {
      alert("Error undoing check-in: " + err.message);
    }
  };

  const handleSendMessage = async () => {
    if (!aiMessage.trim()) return;
    
    const userMsg = { role: 'user', content: aiMessage };
    setAiChatHistory(prev => [...prev, userMsg]);
    setAiMessage('');
    setIsAiLoading(true);
    
    try {
      // Prepare context for the AI
      const context = {
        totalClients: clients.length,
        activeClients: clients.filter(c => getLiveClientStatus(c) === 'Active').length,
        expiringSoon: clients.filter(c => getLiveClientStatus(c) === 'Expiring Soon').length,
        totalRevenue: transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0),
        clients: clients.map(c => ({
          name: c.name,
          sessionsLeft: c.remaining_package || 0,
          status: getLiveClientStatus(c),
          expiry: c.expiry || 'No expiry'
        }))
      };

      // Call Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('ai-copilot', {
        body: { 
          message: aiMessage,
          context: context,
          history: aiChatHistory.slice(-5) // Send last 5 messages for history context
        }
      });

      if (error) throw error;
      
      setAiChatHistory(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      console.error("AI Error:", err);
      // Fallback for simulation mode (until Edge Function is deployed)
      setTimeout(() => {
        let reply = "I'm currently in simulation mode. Once you deploy the Supabase Edge Function, I'll be able to analyze your " + clients.length + " clients in real-time!";
        
        // Mock some smart answers for common questions to show off
        const msg = aiMessage.toLowerCase();
        if (msg.includes(' Joe')) {
          const joe = clients.find(c => c.name.includes('Joe'));
          if (joe) reply = `${joe.name} has ${joe.remaining_package || 0} sessions left. Their status is currently ${getLiveClientStatus(joe)}.`;
        } else if (msg.includes('revenue') || msg.includes('money')) {
          const total = transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
          reply = `Your total recorded revenue is RM ${total.toLocaleString()}. This is based on ${transactions.length} transactions.`;
        } else if (msg.includes('how many clients') || msg.includes('total clients')) {
          reply = `You currently have ${clients.length} clients in your roster. ${clients.filter(c => getLiveClientStatus(c) === 'Active').length} are currently active.`;
        }

        setAiChatHistory(prev => [...prev, { role: 'assistant', content: reply }]);
        setIsAiLoading(false);
      }, 1500);
    } finally {
      // isAiLoading is set to false in simulation timeout or naturally
    }
  };

  const handleExitClassMode = () => {
    if (pinInput !== CLASS_PIN) {
      alert("Incorrect PIN");
      return;
    }
    setShowExitPinModal(false);
    setPinInput('');
    setActivePage('Dashboard');
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-[#F9F7F2] font-sans text-[#0B4550] overflow-hidden">
      
      {/* SIDEBAR - Hidden when in ClassMode or on mobile */}
      {activePage !== 'ClassMode' && (
      <aside className="hidden lg:flex w-[260px] bg-white h-full flex-col border-r border-gray-100 shrink-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center px-6 py-8">
          <button 
            onClick={() => {
              setActivePage('Dashboard');
              setSelectedClient(null);
            }} 
            className="hover:opacity-70 transition-opacity cursor-pointer focus:outline-none"
          >
            <img 
              src={newLogo} 
              alt={companyName} 
              className="h-20 w-auto object-contain" 
              onError={(e) => { e.target.style.display = 'none' }} 
            />
          </button>
        </div>
  
        <nav className="flex-1 px-4 space-y-1 mt-2 overflow-y-auto">
          <NavItem icon={<Home size={28} />} label="Dashboard" isActive={activePage === 'Dashboard'} onClick={() => {setActivePage('Dashboard'); setSelectedClient(null);}} />
          <NavItem icon={<Users size={28} />} label="Clients" isActive={activePage === 'Clients'} onClick={() => {setActivePage('Clients'); setSelectedClient(null);}} />
          <NavItem icon={<DollarSign size={28} />} label="Revenue" isActive={activePage === 'Revenue'} onClick={() => {setActivePage('Revenue'); setSelectedClient(null);}} />
          <NavItem icon={<CalendarSearch size={28} />} label="Schedule" isActive={activePage === 'Schedule'} onClick={() => {setActivePage('Schedule'); setSelectedClient(null);}} />
          <NavItem icon={<Calendar size={28} />} label="Calendar" isActive={activePage === 'Calendar'} onClick={() => { setActivePage('Calendar'); setSelectedClient(null); }} />
          <NavItem icon={<BarChart2 size={28} />} label="Analytics" isActive={activePage === 'Analytics'} onClick={() => setActivePage('Analytics')} />
          <NavItem icon={<Package size={28} />} label="Packages" isActive={activePage === 'Packages'} onClick={() => setActivePage('Packages')} />
          <NavItem icon={<Monitor size={28} />} label="Class Mode" isActive={activePage === 'ClassMode'} onClick={() => setActivePage('ClassMode')} />
        </nav>
  
        <div className="px-4 pb-6 space-y-1 mt-6">
          <NavItem icon={<Settings size={28} />} label="Settings" isActive={activePage === 'Settings'} onClick={() => setActivePage('Settings')} />
          <NavItem icon={<LogOut size={28} />} label="Log out" onClick={handleLogout} />
        </div>
      </aside>
      )}
  
      {/* MOBILE BOTTOM NAVIGATION - Visible only on small screens (lg:hidden), hidden in ClassMode */}
      {activePage !== 'ClassMode' && (
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center py-3 px-2 z-[50] shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
        <button onClick={() => setActivePage('Dashboard')} className={`flex flex-col items-center gap-1 ${activePage === 'Dashboard' ? 'text-[#0B4550]' : 'text-gray-400'}`}>
          <Home size={24} />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button onClick={() => setActivePage('Clients')} className={`flex flex-col items-center gap-1 ${activePage === 'Clients' ? 'text-[#0B4550]' : 'text-gray-400'}`}>
          <Users size={24} />
          <span className="text-[10px] font-medium">Clients</span>
        </button>
        <button onClick={() => setActivePage('Revenue')} className={`flex flex-col items-center gap-1 ${activePage === 'Revenue' ? 'text-[#0B4550]' : 'text-gray-400'}`}>
          <DollarSign size={24} />
          <span className="text-[10px] font-medium">Revenue</span>
        </button>
        <button onClick={() => setActivePage('Schedule')} className={`flex flex-col items-center gap-1 ${activePage === 'Schedule' ? 'text-[#0B4550]' : 'text-gray-400'}`}>
          <Calendar size={24} />
          <span className="text-[10px] font-medium">Schedule</span>
        </button>
        <button onClick={() => setActivePage('Settings')} className={`flex flex-col items-center gap-1 ${activePage === 'Settings' ? 'text-[#0B4550]' : 'text-gray-400'}`}>
          <Settings size={24} />
          <span className="text-[10px] font-medium">Settings</span>
        </button>
      </div>
      )}
  
      {/* MAIN CONTENT AREA */}
      {/* pb-24 ensures content isn't hidden behind the mobile bottom nav */}
      <main className="flex-1 h-full overflow-y-auto p-4 md:p-6 lg:p-8 pb-24 lg:pb-8 relative">

        {/* UNIVERSAL DYNAMIC HEADER - Hidden in ClassMode */}
{activePage !== 'ClassMode' && (
<header className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-8 gap-6">
  <div className="flex-1">
    {/* DASHBOARD HEADER */}
    {activePage === 'Dashboard' && (
      <>
        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-medium text-[#0B4550] mb-2">{greeting}, {trainerName}</h1>
        <p className="text-[#898A8D] font-medium text-sm sm:text-base lg:text-xl">Here is your gym's overview for today, {todayFormattedFull}.</p>
      </>
    )}

    {/* REVENUE HEADER */}
    {activePage === 'Revenue' && (
      <>
        <h1 className="text-3xl lg:text-5xl font-medium text-[#0B4550] mb-2">Revenue History</h1>
        <p className="text-[#898A8D] font-medium text-base lg:text-xl">Manage payments and download invoices.</p>
      </>
    )}

    {/* CLIENT ROSTER HEADER */}
    {activePage === 'Clients' && !selectedClient && (
      <>
        <h1 className="text-3xl lg:text-5xl font-medium text-[#0B4550] mb-2">Client Roster</h1>
        <p className="text-[#898A8D] font-medium text-base lg:text-xl">Manage your active clients and memberships.</p>
      </>
    )}

    {/* ... (Repeat the same pattern for other activePage views: text-3xl lg:text-5xl and text-base lg:text-xl) ... */}
    
    {/* For example, for Settings: */}
    {activePage === 'Settings' && (
      <>
        <h1 className="text-3xl lg:text-5xl font-medium text-[#0B4550] mb-2">Settings</h1>
        <p className="text-[#898A8D] font-medium text-base lg:text-xl">Manage your profile and preferences.</p>
      </>
    )}
  </div>
  
  {/* TOP RIGHT TOOLS (Search & Profile) */}
  <div className="flex items-center gap-3 lg:gap-5 shrink-0 mt-1">
    {/* Search Bar - Full width on mobile, fixed width on desktop */}
    <div className="relative flex-1 lg:flex-none">
      <Search className="absolute left-4 lg:left-5 top-1/2 -translate-y-1/2 text-[#898A8D]" size={20} />
      <input 
        type="text" 
        placeholder="Search clients..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full lg:w-72 pl-12 lg:pl-14 pr-4 py-2.5 lg:py-3 bg-white border-none rounded-full text-base lg:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#E6FF2B] shadow-sm text-[#0B4550] placeholder-[#898A8D]"
      />
    </div>

    {/* Notification Bell */}
    <button className="relative p-2.5 lg:p-3 bg-white rounded-full shadow-sm text-[#898A8D] hover:text-[#0B4550] transition-colors shrink-0">
      <Bell size={22} />
      <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
    </button>

    {/* User Avatar */}
    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#0B4550] flex items-center justify-center text-[#E6FF2B] text-lg lg:text-xl font-medium shadow-sm border-2 border-white cursor-pointer shrink-0">
      {getInitials(trainerName)}
    </div>
  </div>
</header>
)}
        {/* VIEW: DASHBOARD OVERVIEW */}
        {activePage === 'Dashboard' && (
          <div className="animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center mb-8 gap-4">
              <div className="bg-white px-6 py-3 rounded-xl border-l-4 border-[#E6FF2B] shadow-sm max-w-2xl">
                <p className="text-[#0B4550] font-medium text-lg italic">{quote}</p>
              </div>
              <div className="flex bg-white rounded-full p-1 shadow-sm border border-gray-100 overflow-x-auto no-scrollbar max-w-full">
                {['Day', 'Week', 'Month', 'Year'].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-lg font-medium transition-all whitespace-nowrap ${activeTab === tab ? 'bg-[#898A8D] text-white' : 'text-[#898A8D] hover:text-[#0B4550]'}`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-[#0B4550] rounded-3xl p-6 shadow-md relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => setActivePage('Revenue')}>
                <div className="absolute right-6 -top-6 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-all"></div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white/80 font-medium text-lg">Total Revenue</h3>
                  <ArrowUpRight className="text-white/50 group-hover:text-[#E6FF2B] transition-colors" size={20} />
                </div>
                <h2 className="text-4xl lg:text-5xl font-medium text-white mb-1">
                  RM {totalCollectedThisMonth.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </h2>
              </div>
              
              <StatCard 
                title="Total Transactions" 
                value={transactions.length} 
                trend="+1" 
                isPositive={true} 
                onClick={() => setActivePage('Revenue')} 
              />
              
              <StatCard 
                title="Upcoming Expiries" 
                value={liveExpiries.length} 
                trend="-2" 
                isPositive={false} 
                onClick={() => { setActivePage('Clients'); setActiveTab('Expiring Soon'); }} 
              />
              
              <StatCard 
                title="Active Clients" 
                value={activeClientsCount} 
                trend="+1" 
                isPositive={true} 
                onClick={() => { setActivePage('Clients'); setActiveTab('Active'); }} 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
              <div className="col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-medium text-2xl text-[#0B4550]">Revenue Overview</h3>
                  <button onClick={() => setActivePage('Revenue')} className="text-[#898A8D] text-sm font-medium hover:text-[#0B4550] transition-colors">View Details</button>
                </div>
                
               {/* PREMIUM DYNAMIC BAR CHART */}
            <div className="relative h-64 w-full mt-10 group">
              
              {/* Y-AXIS LABELS & GRID LINES */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[1, 0.75, 0.5, 0.25, 0].map((perc) => (
                  <div key={perc} className="w-full h-0 border-t border-gray-50 flex items-center relative">
                    <span className="absolute -left-2 text-[15px] font-bold text-gray-500 tabular-nums">
                      {perc === 0 ? '0' : (maxChartAmount * perc >= 1000 ? (maxChartAmount * perc / 1000).toFixed(1) + 'k' : (maxChartAmount * perc))}
                    </span>
                  </div>
                ))}
              </div>

              {/* THE BARS CONTAINER */}
              <div className="relative flex items-end justify-between gap-2 h-full w-full pt-4 pl-10 pr-2">
                {chartData.map((data) => {
                  const heightPercentage = (data.amount / maxChartAmount) * 100;
                  const isCurrentMonth = data.month === currentMonth;

                  return (
                    <div key={data.label} className="flex-1 flex flex-col justify-end items-center group/bar h-full relative">
                      
                      {/* TOOLTIP ON HOVER */}
                      <div className="opacity-0 group-hover/bar:opacity-100 transition-all duration-200 bg-[#0B4550] text-white text-[10px] px-2 py-1 rounded absolute mb-2 z-30 pointer-events-none whitespace-nowrap bottom-full shadow-lg">
                        RM {data.amount.toLocaleString()}
                      </div>
                      
                      {/* THE BAR */}
                      <div 
                        className={`w-full max-w-[5.5rem] rounded-t-md transition-all duration-1000 ease-out relative z-10
                          ${isCurrentMonth ? 'bg-[#E6FF2B] shadow-[0_0_15px_rgba(230,255,43,0.3)]' : 'bg-[#0B4550]/10 group-hover/bar:bg-[#0B4550]/20'}`}
                        style={{ height: `${Math.max(heightPercentage, 4)}%` }} // 4% is the "Ghost Bar" height for RM 0 months
                      >
                        {/* Inner fill for non-active months that have data */}
                        {!isCurrentMonth && data.amount > 0 && (
                          <div className="absolute inset-0 bg-[#0B4550] rounded-t-md"></div>
                        )}
                      </div>
                      
                      {/* MONTH LABEL */}
                      <div className={`text-[15px] mt-4 transition-colors ${isCurrentMonth ? 'font-black text-[#0B4550]' : 'font-medium text-gray-400 group-hover/bar:text-gray-600'}`}>
                        {data.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
              </div>

              <div className="col-span-1 flex flex-col gap-5">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1 flex flex-col h-[220px]">
                  <h3 className="font-medium text-xl text-[#0B4550] mb-4">Quick Tasks</h3>
                  <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
          {todos.length === 0 ? (
            <p className="text-[#898A8D] font-medium text-sm text-center pt-4">You're all caught up!</p>
          ) : (
            todos.map((todo) => (
              <div key={todo.id} className="flex items-start justify-between group py-1">
                <div className="flex items-start gap-3 flex-1">
                  <div 
                    className={`mt-0.5 cursor-pointer ${todo.done ? 'text-[#E6FF2B]' : 'text-[#898A8D] group-hover:text-[#0B4550]'}`}
                    onClick={() => toggleTodo(todo.id, todo.done)}
                  >
                    {todo.done ? <CheckSquare size={20} /> : <Square size={20} />}
                  </div>
                  
                  {editingTodoId === todo.id ? (
                    <input
                      autoFocus
                      className="flex-1 bg-gray-50 border-none px-2 py-0 rounded text-base font-medium text-[#0B4550] outline-none ring-1 ring-[#E6FF2B] rounded-md"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => handleUpdateTodo(todo.id)}
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdateTodo(todo.id)}
                    />
                  ) : (
                    <span 
                      onClick={() => {
                        setEditingTodoId(todo.id);
                        setEditValue(todo.text || todo.task || "");
                      }}
                      className={`text-base font-medium transition-all cursor-pointer flex-1 ${todo.done ? 'text-[#898A8D] line-through' : 'text-[#0B4550]'}`}
                    >
                      {todo.text || todo.task}
                    </span>
                  )}
                </div>

                <button 
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

                  <form onSubmit={handleAddTodo} className="relative mt-auto">
                    <input 
                      type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)}
                      placeholder="Add a new task..."
                      className="w-full bg-[#F9F7F2] rounded-xl py-2.5 pl-4 pr-10 text-sm font-medium text-[#0B4550] outline-none focus:border focus:border-[#E6FF2B]"
                    />
                    <button type="submit" disabled={!newTodo.trim()} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#898A8D] hover:text-[#0B4550] disabled:opacity-50">
                      <Plus size={20} />
                    </button>
                  </form>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-xl text-[#0B4550]">April Birthdays</h3>
                    <span className="bg-[#E6FF2B]/30 text-[#0B4550] text-xs font-medium px-2 py-1 rounded-lg">{liveBirthdays.length}</span>
                  </div>
                  <div className="space-y-3">
                    {liveBirthdays.map(b => (
                      <div key={b.id} className="flex justify-between items-center text-sm font-medium p-2 hover:bg-[#F9F7F2] rounded-lg transition-colors cursor-pointer">
                        <span className="text-[#0B4550] flex items-center">
                          {b.name} {b.date === todayMonthDay && <span className="ml-2 text-base" title="Birthday Today!">🎁</span>}
                        </span>
                        <span className="text-[#898A8D]">{b.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
                    
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-6">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-medium text-2xl text-[#0B4550]">Upcoming Schedule</h3>
                <button onClick={() => setActivePage('Schedule')} className="flex items-center gap-2 text-[#898A8D] font-medium hover:text-[#0B4550] transition-colors">
                  View Full Calendar <ArrowRight size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sessions.length === 0 ? (
                  <div className="col-span-3 text-center py-10 text-[#898A8D] font-medium">No upcoming sessions. Head to the Schedule tab to add some!</div>
                ) : (
                  sessions.slice(0, 3).map((session) => (
                    <div key={session.id} className="bg-[#F9F7F2] rounded-2xl p-5 border border-gray-100 hover:border-[#E6FF2B] transition-colors cursor-pointer group" onClick={() => setActivePage('Schedule')}>
                      <div className="flex justify-between items-start mb-4">
                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium ${session.type === '1-on-1' ? 'bg-[#0B4550] text-white' : 'bg-white text-[#0B4550]'}`}>
                          {session.type}
                        </span>
                        <span className="text-[#898A8D] font-medium text-sm flex items-center gap-1">
                          <Clock size={14} /> {formatDbDate(session.date)} - {session.time}
                        </span>
                      </div>
                      <h4 className="text-xl font-medium text-[#0B4550] mb-1 group-hover:text-black transition-colors">{session.title}</h4>
                      <p className="text-sm font-medium text-[#898A8D] mb-4 flex items-center gap-1"><MapPin size={14} /> {session.location}</p>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <div className="flex -space-x-2">
                          {/* Future Attendees Join will go here */}
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 border-[#F9F7F2] bg-gray-200 text-white">?</div>
                        </div>
                        <span className="text-xs font-medium text-[#898A8D]">{session.attendees ? session.attendees.length : 0} / {session.capacity} Booked</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: REVENUE */}
        {activePage === 'Revenue' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
            {/* NEW: Backlog Button */}
            <button 
              onClick={() => setShowBacklogModal(true)}
              className="bg-[#0B4550] text-white px-6 py-3 rounded-full font-medium hover:bg-opacity-90 transition-all flex items-center gap-2 shadow-sm"
            >
              <Plus size={20} />
              Add Historical Data
            </button>

            {/* Your existing tabs */}
            <div className="flex bg-white rounded-full p-1.5 shadow-sm border border-gray-100">
              {['Day', 'Month', 'Year', 'All Time'].map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)} 
                  className={`px-6 py-2 rounded-full text-lg font-medium transition-all ${activeTab === tab ? 'bg-[#898A8D] text-white' : 'text-[#898A8D] hover:text-[#0B4550]'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
               <div className="bg-[#0B4550] rounded-3xl p-6 shadow-md">
                 <h3 className="text-white/80 font-medium text-lg mb-2">Total Collected (This Month)</h3>
                 <h2 className="text-4xl font-medium text-white">RM {totalCollectedThisMonth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
               </div>
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                 <h3 className="text-[#898A8D] font-medium text-lg mb-2">Pending Payments</h3>
                 <h2 className="text-4xl font-medium text-[#0B4550]">RM 0.00</h2>
               </div>
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                 <h3 className="text-[#898A8D] font-medium text-lg mb-2">Projected Renewals</h3>
                 <h2 className="text-4xl font-medium text-[#0B4550]">RM {estimatedRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
               </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="font-medium text-2xl text-[#0B4550] mb-4 border-b-2 border-gray-100 pb-4">Recent Transactions</h3>
              {transactions.length === 0 ? (
                <div className="text-center py-10 text-[#898A8D] font-medium">No transactions yet. Revenue will appear here when clients buy packages!</div>
              ) : (
                <table className="w-full text-left border-collapse mb-10">
                  <thead>
                    <tr className="text-base font-medium text-[#898A8D] uppercase tracking-wider border-b border-gray-100">
                      <th className="pb-4 pt-2">Date</th>
                      <th className="pb-4 pt-2">Client Name</th>
                      <th className="pb-4 pt-2">Description</th>
                      <th className="pb-4 pt-2">Amount</th>
                      <th className="pb-4 pt-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-lg font-medium text-[#0B4550]">
                    {transactions.map(t => (
                      <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-4 text-sm">{new Date(t.created_at).toLocaleDateString()}</td>
                        <td className="py-4 font-bold">{t.client_name}</td>
                        <td className="py-4 text-sm">{t.description}</td>
                        <td className="py-4 font-black text-emerald-600">+RM {Number(t.amount).toFixed(2)}</td>
                        <td className="py-4 text-right">
                          <button 
                            onClick={() => handleDeleteTransaction(t.id)} 
                            className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" 
                            title="Delete Transaction"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* VIEW: CLIENTS */}
        {activePage === 'Clients' && (
          <div className="animate-in fade-in duration-500">
            {!selectedClient && (
              <>
                <div className="flex justify-between items-center mb-8">
                  <div className="flex bg-white rounded-full p-1.5 shadow-sm border border-gray-100 shrink-0">
                    {['All Clients', 'Active', 'Expiring Soon', 'Expired'].map((tab) => (
                      <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-full text-lg font-medium transition-all ${activeTab === tab ? 'bg-[#898A8D] text-white' : 'text-[#898A8D] hover:text-[#0B4550]'}`}>
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-white border border-gray-100 rounded-xl p-1 flex items-center shadow-sm">
                      <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#0B4550] text-[#E6FF2B]' : 'text-[#898A8D] hover:text-[#0B4550]'}`} title="Grid View">
                        <LayoutGrid size={20} />
                      </button>
                      <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#0B4550] text-[#E6FF2B]' : 'text-[#898A8D] hover:text-[#0B4550]'}`} title="List View">
                        <List size={20} />
                      </button>
                    </div>
                    
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-white border border-gray-100 text-[#0B4550] px-4 py-3 rounded-xl font-medium text-base outline-none shadow-sm cursor-pointer"
                    >
                      <option value="newest">Recently Added</option>
                      <option value="az">Alphabetical (A-Z)</option>
                      <option value="za">Alphabetical (Z-A)</option>
                      <option value="expire">Earliest to Expire</option>
                      <option value="sessions">Most Sessions</option>
                    </select>

                    <button 
                      onClick={() => setIsArchiveMode(!isArchiveMode)} 
                      className={`px-6 py-3 rounded-xl font-medium text-lg flex items-center gap-2 transition-all shadow-sm ${isArchiveMode ? 'bg-[#0B4550] text-[#E6FF2B]' : 'bg-white text-[#898A8D] border border-gray-100 hover:text-[#0B4550]'}`}
                    >
                      <Download size={20} className={isArchiveMode ? "" : "opacity-70"} /> 
                      {isArchiveMode ? 'Exit Archive' : 'View Archive'}
                    </button>
                    <button onClick={() => setShowAddModal(true)} className="bg-[#E6FF2B] text-[#0B4550] px-6 py-3 rounded-xl font-medium text-lg flex items-center gap-2 hover:brightness-95 transition-all shadow-sm">
                      <Plus size={24} />
                      Add New Client
                    </button>
                  </div>
                </div>

                {isLoadingClients ? (
                  <div className="flex justify-center items-center py-20">
                    <RotateCw className="animate-spin text-[#0B4550]" size={40} />
                  </div>
                ) : sortedAndFilteredClients.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <Users size={64} className="mx-auto text-gray-300 mb-4" />
                    <h2 className="text-2xl font-medium text-[#0B4550] mb-2">{isArchiveMode ? 'No archived clients' : 'No clients found'}</h2>
                    <p className="text-[#898A8D]">
                      {isArchiveMode ? "You haven't archived any clients yet." : <><button onClick={() => setShowAddModal(true)} className="text-[#0B4550] hover:underline font-medium">Click here</button> to start building your roster.</>}
                    </p>
                  </div>
                ) : viewMode === 'list' ? (
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-sm font-medium text-[#898A8D] uppercase tracking-wider border-b border-gray-100">
                          <th className="pb-4 px-4 font-bold">Name</th>
                          <th className="pb-4 px-4 font-bold">Sessions</th>
                          <th className="pb-4 px-4 font-bold">Expiry Date</th>
                          <th className="pb-4 px-4 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-lg font-medium text-[#0B4550]">
                        {sortedAndFilteredClients.map(client => (
                          <tr key={client.id} onClick={() => setSelectedClient(client)} className="border-b border-gray-50 hover:bg-[#F9F7F2] transition-colors cursor-pointer group">
                            <td className="py-4 px-4 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#F9F7F2] text-[#0B4550] flex items-center justify-center text-sm font-bold group-hover:bg-[#E6FF2B] transition-colors">
                                {getInitials(client.name)}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold">{client.name}</span>
                                <span className="text-[#898A8D] text-sm">{client.package || 'No package'}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-base">
                              {client.initial_package ? `${(client.initial_package || 0) - (client.remaining_package || 0)} / ${client.initial_package}` : (client.unlimited ? 'Unlimited' : '-')}
                            </td>
                            <td className="py-4 px-4 text-base">
                              <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                                getLiveClientStatus(client) === 'Expired' ? 'bg-red-100 text-red-600' : 
                                getLiveClientStatus(client) === 'Expiring Soon' ? 'bg-[#E6FF2B]/30 text-[#0B4550]' : 
                                'text-[#0B4550]'
                              }`}>
                                {client.expiry || 'No date set'}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={(e) => { e.stopPropagation(); handleArchiveClient(client.id, client.status); }} className="p-2 text-[#898A8D] hover:text-[#0B4550] bg-white rounded-lg shadow-sm hover:shadow transition-all" title={client.status === 'Archived' ? 'Restore' : 'Archive'}>
                                  <Download size={18} className={client.status === 'Archived' ? "rotate-180" : ""} />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); handleDeleteClient(client.id); }} className="p-2 text-red-400 hover:text-red-600 bg-white rounded-lg shadow-sm hover:shadow transition-all" title="Delete">
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedAndFilteredClients.map(client => (
                      <div key={client.id} onClick={() => setSelectedClient(client)} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all group relative">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-[#F9F7F2] text-[#0B4550] flex items-center justify-center text-xl font-medium group-hover:bg-[#E6FF2B] transition-colors">
                              {getInitials(client.name)}
                            </div>
                            <div>
                              <h3 className="text-2xl font-medium text-[#0B4550]">{client.name}</h3>
                              <p className="text-[#898A8D] font-medium text-sm">{client.package || 'No package selected'}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mb-6">
                          {client.initial_package ? (
                            <>
                              <div className="flex justify-between text-sm font-medium mb-2">
                                <span className="text-[#898A8D]">Sessions (Used/Total)</span>
                                <span className="text-[#0B4550]">{(client.initial_package || 0) - (client.remaining_package || 0)} / {client.initial_package}</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-3">
                                <div 
                                  className={`h-3 rounded-full transition-all ${client.remaining_package === 0 ? 'bg-red-400' : 'bg-[#0B4550]'}`}
                                  style={{ width: `${Math.min(((client.initial_package - (client.remaining_package || 0)) / client.initial_package) * 100, 100)}%` }}
                                ></div>
                              </div>
                            </>
                          ) : (
                            <div className="flex justify-between text-sm font-medium mb-2 pt-5">
                              <span className="text-[#898A8D]">Subscription Type</span>
                              <span className="text-[#0B4550]">{client.unlimited ? 'Unlimited (Time-Based)' : 'Standard'}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                          <span className="text-[#898A8D] font-medium text-sm">Expires:</span>
                          <span className={`font-medium text-base px-3 py-1 rounded-lg ${
                            client.status === 'Expired' ? 'bg-red-100 text-red-600' : 
                            client.status === 'Expiring Soon' ? 'bg-[#E6FF2B]/30 text-[#0B4550]' : 
                            'text-[#0B4550]'
                          }`}>
                            {client.expiry || 'No date set'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {selectedClient && (
              <div className="animate-in slide-in-from-right-8 duration-300">
                <button onClick={() => setSelectedClient(null)} className="flex items-center gap-2 text-[#898A8D] font-medium text-lg mb-8 hover:text-[#0B4550] transition-colors">
                  <ArrowLeft size={24} /> Back to Roster
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
                      <div className="w-24 h-24 rounded-full bg-[#F9F7F2] text-[#0B4550] flex items-center justify-center text-3xl font-medium mx-auto mb-4 border-4 border-white shadow-sm">
                        {getInitials(selectedClient.name)}
                      </div>
                      <h2 className="text-3xl font-medium text-[#0B4550] mb-2">{selectedClient.name}</h2>
                      {/* MANUAL OVERRIDE BUTTONS */}
                      {!selectedClient.unlimited && (
                        <div className="bg-[#F9F7F2] rounded-2xl p-4 mt-6 mb-4 flex items-center justify-between">
                          <span className="text-[#898A8D] font-medium text-sm uppercase">Remaining</span>
                          <div className="flex items-center gap-3">
                            <button onClick={() => adjustSessions(-1)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#0B4550] hover:bg-red-50 hover:text-red-500 shadow-sm transition-colors"><Minus size={16}/></button>
                            <span className="text-2xl font-medium text-[#0B4550] w-6 text-center">{selectedClient.remaining_package}</span>
                            <button onClick={() => adjustSessions(1)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#0B4550] hover:bg-emerald-50 hover:text-emerald-500 shadow-sm transition-colors"><Plus size={16}/></button>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-center gap-3 mb-6">
                        <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${
                            selectedClient.status === 'Expired' ? 'bg-red-100 text-red-600' : 
                            selectedClient.status === 'Expiring Soon' ? 'bg-[#E6FF2B] text-[#0B4550]' : 
                            selectedClient.status === 'Archived' ? 'bg-gray-200 text-gray-500' :
                            'bg-gray-100 text-[#898A8D]'
                        }`}>
                          {selectedClient.status || 'Active'}
                        </span>
                        <button onClick={() => handleArchiveClient(selectedClient.id, selectedClient.status)} className="p-2 text-[#898A8D] hover:text-[#0B4550] bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors" title={selectedClient.status === 'Archived' ? 'Restore' : 'Archive'}>
                          <Download size={18} className={selectedClient.status === 'Archived' ? "rotate-180" : ""} />
                        </button>
                        <button onClick={() => handleDeleteClient(selectedClient.id)} className="p-2 text-red-300 hover:text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      
                      <div className="text-left space-y-4 border-t border-gray-100 pt-6 mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-bold text-[#0B4550]">Details</h4>
                          <button 
                            onClick={() => isEditingClient ? handleUpdateClient() : setIsEditingClient(true)} 
                            className={`text-sm font-bold px-4 py-1.5 rounded-lg transition-all ${isEditingClient ? 'bg-[#0B4550] text-[#E6FF2B]' : 'bg-[#F9F7F2] text-[#898A8D] hover:text-[#0B4550]'}`}
                          >
                            {isEditingClient ? 'Save Changes' : 'Edit Profile'}
                          </button>
                        </div>

                        {isEditingClient ? (
                          <div className="space-y-3 animate-in fade-in duration-300">
                            <div><label className="text-xs font-bold text-[#898A8D] uppercase">Name</label><input type="text" value={editClientForm.name || ''} onChange={e => setEditClientForm({...editClientForm, name: e.target.value})} className="w-full bg-[#F9F7F2] rounded-lg p-2 text-[#0B4550] font-medium outline-none focus:border focus:border-[#E6FF2B]" /></div>
                            <div><label className="text-xs font-bold text-[#898A8D] uppercase">Email</label><input type="email" value={editClientForm.email || ''} onChange={e => setEditClientForm({...editClientForm, email: e.target.value})} className="w-full bg-[#F9F7F2] rounded-lg p-2 text-[#0B4550] font-medium outline-none focus:border focus:border-[#E6FF2B]" /></div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-xs font-bold text-[#898A8D] uppercase">Phone</label>
                                <input type="text" value={editClientForm.phone || ''} onChange={e => setEditClientForm({...editClientForm, phone: e.target.value})} className="w-full bg-[#F9F7F2] rounded-lg p-2 text-[#0B4550] font-medium outline-none focus:border focus:border-[#E6FF2B]" />
                              </div>
                              <div>
                                <label className="text-xs font-bold text-[#898A8D] uppercase">Date of Birth</label>
                                <input type="date" value={editClientForm.dob || ''} onChange={e => setEditClientForm({...editClientForm, dob: e.target.value})} className="w-full bg-[#F9F7F2] rounded-lg p-2 text-[#0B4550] font-medium outline-none focus:border focus:border-[#E6FF2B]" />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-xs font-bold text-[#898A8D] uppercase">Type</label>
                                <select value={editClientForm.client_type} onChange={e => setEditClientForm({...editClientForm, client_type: e.target.value})} className="w-full bg-[#F9F7F2] rounded-lg p-2 text-[#0B4550] font-medium outline-none">
                                  <option value="Group">Group</option><option value="PT">PT</option><option value="Group & PT">Group & PT</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-xs font-bold text-[#898A8D] uppercase">Status</label>
                                <select value={editClientForm.member_status} onChange={e => setEditClientForm({...editClientForm, member_status: e.target.value})} className="w-full bg-[#F9F7F2] rounded-lg p-2 text-[#0B4550] font-medium outline-none">
                                  <option value="Member">Member</option><option value="Non-Member">Non-Member</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="text-xs font-bold text-[#898A8D] uppercase">Package Type</label>
                              <select value={editClientForm.package} onChange={e => setEditClientForm({...editClientForm, package: e.target.value})} className="w-full bg-[#F9F7F2] rounded-lg p-2 text-[#0B4550] font-medium outline-none">
                                <option value="">No Package</option>
                                {packagesList.map(pkg => (
                                  <option key={pkg.id} value={pkg.name}>{pkg.name}</option>
                                ))}
                              </select>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-xs font-bold text-[#898A8D] uppercase">Expiry Date</label>
                                <input type="date" value={editClientForm.expiry || ''} onChange={e => setEditClientForm({...editClientForm, expiry: e.target.value})} className="w-full bg-[#F9F7F2] rounded-lg p-2 text-[#0B4550] font-medium outline-none focus:border focus:border-[#E6FF2B]" />
                              </div>
                              <div>
                                <label className="text-xs font-bold text-[#898A8D] uppercase">Date Paid</label>
                                <input type="date" value={editClientForm.date_paid || ''} onChange={e => setEditClientForm({...editClientForm, date_paid: e.target.value})} className="w-full bg-[#F9F7F2] rounded-lg p-2 text-[#0B4550] font-medium outline-none focus:border focus:border-[#E6FF2B]" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-xs font-bold text-[#898A8D] uppercase">Total Sessions</label>
                                <input type="number" value={editClientForm.initial_package} onChange={e => setEditClientForm({...editClientForm, initial_package: parseInt(e.target.value) || 0})} className="w-full bg-[#F9F7F2] rounded-lg p-2 text-[#0B4550] font-medium outline-none focus:border focus:border-[#E6FF2B]" />
                              </div>
                              <div>
                                <label className="text-xs font-bold text-[#898A8D] uppercase">Remaining</label>
                                <input type="number" value={editClientForm.remaining_package} onChange={e => setEditClientForm({...editClientForm, remaining_package: parseInt(e.target.value) || 0})} className="w-full bg-[#F9F7F2] rounded-lg p-2 text-[#0B4550] font-medium outline-none focus:border focus:border-[#E6FF2B]" />
                              </div>
                            </div>
                            <button onClick={() => setIsEditingClient(false)} className="w-full text-center text-red-400 font-bold text-sm mt-2 hover:text-red-500">Cancel</button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
                            <div className="col-span-2"><p className="text-sm font-medium text-[#898A8D]">Full Name</p><p className="text-lg font-medium text-[#0B4550]">{selectedClient.name || 'N/A'}</p></div>
                            <div className="col-span-2"><p className="text-sm font-medium text-[#898A8D]">Email</p><p className="text-lg font-medium text-[#0B4550]">{selectedClient.email || 'N/A'}</p></div>
                            <div><p className="text-sm font-medium text-[#898A8D]">Phone</p><p className="text-lg font-medium text-[#0B4550]">{selectedClient.phone || 'N/A'}</p></div>
                            <div><p className="text-sm font-medium text-[#898A8D]">Date of Birth</p><p className="text-lg font-medium text-[#0B4550]">{selectedClient.dob || 'N/A'}</p></div>
                            <div><p className="text-sm font-medium text-[#898A8D]">Client Type</p><p className="text-lg font-medium text-[#0B4550]">{selectedClient.client_type || 'N/A'}</p></div>
                            <div><p className="text-sm font-medium text-[#898A8D]">Member Status</p><p className="text-lg font-medium text-[#0B4550]">{selectedClient.member_status || 'N/A'}</p></div>
                            
                            <div className="col-span-2 border-t border-gray-100 pt-4 mt-2">
                              <p className="font-bold text-[#0B4550] mb-2">Package Details</p>
                            </div>
                            <div className="col-span-2"><p className="text-sm font-medium text-[#898A8D]">Package Type</p><p className="text-lg font-medium text-[#0B4550]">{selectedClient.package || (selectedClient.unlimited ? 'Unlimited' : 'None')}</p></div>
                            <div><p className="text-sm font-medium text-[#898A8D]">Sessions (Used/Total)</p><p className="text-lg font-medium text-[#0B4550]">{(selectedClient.initial_package || 0) - (selectedClient.remaining_package || 0)} / {selectedClient.initial_package || 0}</p></div>
                            <div><p className="text-sm font-medium text-[#898A8D]">Date Paid</p><p className="text-lg font-medium text-[#0B4550]">{selectedClient.date_paid || 'N/A'}</p></div>
                            <div><p className="text-sm font-medium text-[#898A8D]">Expiry Date</p><p className="text-lg font-medium text-[#0B4550]">{selectedClient.expiry || 'No date set'}</p></div>

                            <div className="col-span-2 mt-2">
                              <button 
                                onClick={handleRenewPackage}
                                className="w-full bg-[#0B4550] text-[#E6FF2B] py-4 rounded-2xl font-extrabold text-lg hover:scale-[1.02] transition-all shadow-lg flex items-center justify-center gap-3 group"
                              >
                                <RotateCw size={22} className="group-hover:rotate-180 transition-transform duration-500" />
                                Renew Package
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-[#0B4550] rounded-3xl p-6 shadow-md">
                      <h3 className="text-white font-medium text-xl mb-2">Personal Portal</h3>
                      <p className="text-white/70 text-sm font-medium mb-4">Share this link for {selectedClient.name} to view their progress.</p>
                      <div className="flex bg-white/10 rounded-xl p-2 border border-white/20">
                        <input type="text" readOnly value={`${window.location.origin}/client/${selectedClient.id}`} className="bg-transparent text-white w-full px-2 outline-none font-medium text-sm" />
                        <button onClick={handleCopyLink} className="bg-[#E6FF2B] text-[#0B4550] p-2 rounded-lg hover:brightness-95 transition-all flex items-center justify-center shrink-0 w-10 h-10">
                          {copiedLink ? <Check size={20} /> : <Copy size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-3 flex flex-col gap-6">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col relative h-80 shrink-0">
                      <h3 className="font-medium text-2xl text-[#0B4550] mb-6">Trainer Notes</h3>
                      <textarea 
                        value={clientNotes}
                        onChange={(e) => setClientNotes(e.target.value)}
                        className="w-full flex-1 bg-[#F9F7F2] border-2 border-gray-100 rounded-2xl p-6 text-lg font-medium text-[#0B4550] focus:outline-none focus:border-[#E6FF2B] transition-colors resize-none" 
                        placeholder="Add workout notes, injury updates, or goals here..."
                      ></textarea>
                      <div className="flex justify-end items-center gap-4 mt-4">
                        {notesSavedMsg && <span className="text-emerald-500 font-medium flex items-center gap-1"><Check size={18}/> Saved!</span>}
                        <button 
                          onClick={handleSaveNotes}
                          disabled={isSavingNotes}
                          className="bg-[#0B4550] text-white px-8 py-2 rounded-xl font-medium text-base hover:bg-[#0B4550]/90 transition-all shadow-sm flex items-center gap-2"
                        >
                          {isSavingNotes ? <RotateCw className="animate-spin" size={18}/> : <Save size={18}/>}
                          Save Notes
                        </button>
                      </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-medium text-2xl text-[#0B4550]">Activity Ledger</h3>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setShowLedgerModal(true)}
                            className="bg-[#F9F7F2] text-[#0B4550] px-4 py-2 rounded-xl text-xs font-bold uppercase hover:bg-gray-100 transition-colors flex items-center gap-2"
                          >
                            <Plus size={14} /> Add Entry
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto pr-2 no-scrollbar space-y-8">
                        {clientHistory.length === 0 ? (
                          <div className="text-center py-10">
                            <p className="text-sm font-medium text-[#898A8D]">No activity recorded yet.</p>
                          </div>
                        ) : (
                          Object.values(groupedHistory)
                            .sort((a, b) => b.year - a.year)
                            .map((yearData) => (
                              <div key={yearData.year} className="space-y-6">
                                {/* YEAR HEADER */}
                                <div className="flex justify-between items-center border-b border-gray-100 pb-3 mt-4">
                                  <h4 className="text-base font-extrabold text-[#0B4550] flex items-center gap-2">
                                    <Calendar size={18} /> {yearData.year}
                                  </h4>
                                  <div className="flex gap-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                                    <div>Yearly Revenue: <span className="text-emerald-600 font-extrabold">RM {yearData.totalEarned.toLocaleString()}</span></div>
                                    <span className="text-gray-300">|</span>
                                    <div>Sessions: <span className="text-blue-600 font-extrabold">{yearData.sessionsCount}</span></div>
                                  </div>
                                </div>

                                {/* MONTHS LIST */}
                                <div className="space-y-4">
                                  {Object.values(yearData.months)
                                    .sort((a, b) => b.maxTimestamp - a.maxTimestamp)
                                    .map((monthData) => {
                                      const monthYearKey = monthData.monthYear;
                                      return (
                                        <div key={monthYearKey} className="space-y-4">
                                          <div 
                                            onClick={() => toggleMonth(monthYearKey)}
                                            className="flex justify-between items-center bg-[#F9F7F2] p-4 rounded-2xl border border-gray-100 shadow-sm sticky top-0 z-10 cursor-pointer hover:bg-gray-100 transition-colors group/header"
                                          >
                                            <div className="flex items-center gap-3">
                                              <ChevronRight size={18} className={`text-[#0B4550] transition-transform duration-300 ${isMonthExpanded(monthYearKey) ? 'rotate-90' : ''}`} />
                                              <h4 className="font-bold text-[#0B4550] text-sm uppercase tracking-wider">{monthData.monthName}</h4>
                                            </div>
                                            <div className="flex gap-6">
                                              <div className="text-right">
                                                <p className="text-[10px] font-bold text-[#898A8D] uppercase">Earned</p>
                                                <p className="text-sm font-bold text-emerald-600">RM {monthData.totalEarned.toLocaleString()}</p>
                                              </div>
                                              <div className="text-right">
                                                <p className="text-[10px] font-bold text-[#898A8D] uppercase">Sessions</p>
                                                <p className="text-sm font-bold text-blue-600">{monthData.sessionsCount}</p>
                                              </div>
                                            </div>
                                          </div>
                                          
                                          {isMonthExpanded(monthYearKey) && (
                                            <div className="space-y-4 pl-2 animate-in slide-in-from-top-2 duration-300">
                                              {monthData.items.map((item) => (
                                                <div key={`${item.dbTable}-${item.id}`} className="flex gap-4 group">
                                                  <div className="flex flex-col items-center">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.type === 'purchase' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'}`}>
                                                      {item.type === 'purchase' ? <DollarSign size={20} /> : <CheckSquare size={20} />}
                                                    </div>
                                                    <div className="w-0.5 h-full bg-gray-50 mt-2"></div>
                                                  </div>
                                                  <div className="flex-1 pb-6 border-b border-gray-50 group-last:border-none relative">
                                                    <div className="flex justify-between items-start mb-1">
                                                      <h4 className="font-bold text-[#0B4550]">{item.title}</h4>
                                                      <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-[#898A8D]">{item.date}</span>
                                                        {item.isEditable && (
                                                          <button 
                                                            onClick={(e) => { e.stopPropagation(); handleEditHistoryEntry(item); }}
                                                            className="text-gray-300 hover:text-[#0B4550] opacity-0 group-hover:opacity-100 transition-opacity"
                                                          >
                                                            <Edit3 size={14} />
                                                          </button>
                                                        )}
                                                        <button 
                                                          onClick={(e) => { e.stopPropagation(); handleDeleteHistoryEntry(item); }}
                                                          className="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                          <Trash2 size={14} />
                                                        </button>
                                                      </div>
                                                    </div>
                                                    <p className="text-sm font-medium text-[#898A8D] mb-1">{item.detail}</p>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase">{item.time}</span>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

{/* VIEW: FULL CALENDAR */}
{activePage === 'Calendar' && (
          <div className="animate-in fade-in duration-500 flex flex-col h-full">
            <div className="flex justify-between items-center mb-1">
              <div>
              </div>
              <button 
                onClick={() => setShowGoogleSyncModal(true)} 
                className={`border-2 px-6 py-3 rounded-2xl font-bold flex items-center gap-3 transition-all ${isGoogleCalendarConnected ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm' : 'bg-white border-gray-100 text-[#0B4550] hover:border-[#0B4550] hover:shadow-md'}`}
              >
                {isGoogleCalendarConnected ? (
                  <>
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] font-black tracking-tighter">✓</div>
                    Google Calendar Connected
                  </>
                ) : (
                  <>
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] font-black tracking-tighter">G</div>
                    Connect Google Calendar
                  </>
                )}
              </button>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-extrabold text-[#0B4550]">April 2026</h3>
                <div className="flex gap-2">
                  <button className="w-8 h-8 bg-[#F9F7F2] rounded-full flex items-center justify-center text-[#0B4550] hover:bg-gray-200"><ChevronLeft size={16}/></button>
                  <button className="w-8 h-8 bg-[#F9F7F2] rounded-full flex items-center justify-center text-[#0B4550] hover:bg-gray-200"><ChevronRight size={16}/></button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-4 mb-4 text-center">
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                  <div key={day} className="text-l font-bold text-[#898A8D] tracking-widest">{day}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-4 flex-1">
                {[...Array(30)].map((_, i) => {
                  const day = i + 1;
                  // Find sessions for this specific day to plot on the calendar
                  const daySessions = sessions.filter(s => new Date(s.date).getDate() === day);
                  
                  return (
                    <div key={day} className="border border-gray-100 rounded-2xl p-3 min-h-[100px] hover:border-[#0B4550] transition-colors group cursor-pointer flex flex-col">
                      <span className={`text-l font-extrabold mb-2 ${day === new Date().getDate() ? 'bg-[#0B4550] text-[#E6FF2B] w-7 h-7 rounded-full flex items-center justify-center' : 'text-[#0B4550]'}`}>
                        {day}
                      </span>
                      <div className="flex-1 flex flex-col gap-1 overflow-y-auto no-scrollbar">
                        {daySessions.map(s => (
                          <div key={s.id} className="bg-[#F9F7F2] text-[#0B4550] text-[15px] font-bold px-2 py-1.5 rounded-lg truncate group-hover:bg-[#E6FF2B] transition-colors">
                            {s.time} - {s.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: SCHEDULE (NOW LIVE!) */}
        {activePage === 'Schedule' && (
           <div className="animate-in fade-in duration-500 flex flex-col h-full">
            <div className="flex justify-between items-center mb-8 bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-6 px-4">
                <ChevronLeft size={28} className="text-[#898A8D] cursor-pointer hover:text-[#0B4550] transition-colors" />
                <h2 className="text-2xl font-medium text-[#0B4550] w-48 text-center">April 2026</h2>
                <ChevronRight size={28} className="text-[#898A8D] cursor-pointer hover:text-[#0B4550] transition-colors" />
              </div>
              <div className="flex gap-2 flex-1 justify-center border-l border-r border-gray-100 px-6">
                <Day date="20" day="Mon" />
                <Day date="21" day="Tue" />
                <Day date="22" day="Wed" />
                <Day date="23" day="Thu" />
                <Day date="24" day="Fri" />
                <Day date="25" day="Sat" active />
              </div>
              <div className="px-4">
                <button onClick={() => setShowEventModal(true)} className="bg-[#E6FF2B] text-[#0B4550] px-6 py-3 rounded-xl font-medium text-lg flex items-center gap-2 hover:brightness-95 transition-all shadow-sm">
                  <Plus size={24} /> New Event
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 pb-10">
              <div className="lg:col-span-2 space-y-6">
                <h3 className="font-medium text-2xl text-[#0B4550] mb-4">Upcoming</h3>
                <div className="space-y-4">
                  {sessions.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                      <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
                      <h2 className="text-2xl font-medium text-[#0B4550] mb-2">No upcoming sessions</h2>
                      <p className="text-[#898A8D]">Click "New Event" to schedule your first class.</p>
                    </div>
                  ) : (
                    sessions.map((session) => {
                      const isSelected = selectedSession?.id === session.id;
                      const is1on1 = session.type === '1-on-1';
                      const isBlocked = session.type === 'Blocked';

                      return (
                        <div key={session.id} onClick={() => setSelectedSession(session)} className={`flex gap-6 items-center cursor-pointer group transition-all ${isBlocked ? 'opacity-50' : ''}`}>
                          <div className="w-24 text-right shrink-0">
                            <p className={`text-xl font-medium ${isSelected ? 'text-[#0B4550]' : 'text-[#898A8D]'}`}>{session.time}</p>
                            <p className="text-sm font-medium text-[#898A8D]">{session.duration}</p>
                          </div>
                          <div className={`flex-1 rounded-3xl p-6 shadow-sm border transition-all ${isSelected ? 'scale-[1.02] shadow-md' : ''} ${is1on1 ? 'bg-[#0B4550] border-[#0B4550] text-white' : isBlocked ? 'bg-transparent border-dashed border-2 border-gray-300' : 'bg-white border-gray-100 hover:border-[#E6FF2B]'}`}>
                            <div className="flex justify-between items-start">
                              <div>
                                <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium mb-3 ${is1on1 ? 'bg-[#E6FF2B] text-[#0B4550]' : 'bg-gray-100 text-[#898A8D]'}`}>
                                  {session.type}
                                </span>
                                <h3 className={`text-2xl font-medium mb-1 ${is1on1 ? 'text-white' : 'text-[#0B4550]'}`}>{session.title}</h3>
                                <div className={`flex items-center gap-2 text-lg font-medium ${is1on1 ? 'text-white/70' : 'text-[#898A8D]'}`}>
                                  <MapPin size={18} /> {session.location} • {formatDbDate(session.date)}
                                </div>
                              </div>
                              {!isBlocked && (
                                <div className="flex flex-col items-end">
                                  <div className="flex -space-x-3 mb-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 ${is1on1 ? 'bg-white text-[#0B4550] border-[#0B4550]' : 'bg-[#F9F7F2] text-[#0B4550] border-white'}`}>
                                      ?
                                    </div>
                                  </div>
                                  <span className={`text-sm font-medium ${is1on1 ? 'text-[#E6FF2B]' : 'text-[#898A8D]'}`}>{session.attendees ? session.attendees.length : 0} / {session.capacity} Booked</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="lg:col-span-1">
                {selectedSession && (
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-4">
                    <span className="inline-block px-4 py-1.5 rounded-xl bg-gray-100 text-[#898A8D] font-medium text-sm mb-4">{selectedSession.type}</span>
                    <h2 className="text-4xl font-medium text-[#0B4550] mb-6 leading-tight">{selectedSession.title}</h2>
                    <div className="space-y-5 border-b border-gray-100 pb-8 mb-8">
                      <div className="flex items-center gap-4 text-xl font-medium text-[#0B4550]"><Clock className="text-[#898A8D]" size={28} /> {formatDbDate(selectedSession.date)} - {selectedSession.time}</div>
                      <div className="flex items-center gap-4 text-xl font-medium text-[#0B4550]"><MapPin className="text-[#898A8D]" size={28} /> {selectedSession.location}</div>
                    </div>

                    {selectedSession.type !== 'Blocked' ? (
                      <>
                        <div className="flex justify-between items-end mb-6">
                          <h3 className="text-2xl font-medium text-[#0B4550]">Roster</h3>
                          <span className="text-[#898A8D] font-medium text-lg">Capacity: {selectedSession.capacity}</span>
                        </div>
                        {selectedSession.attendees.length === 0 ? (
  <div className="text-center py-10 bg-[#F9F7F2] rounded-2xl border border-gray-100">
     <p className="text-lg font-medium text-[#898A8D]">No bookings yet.</p>
  </div>
) : (
  <div className="space-y-3 mb-8">
    {selectedSession.attendees.map((attendee) => (
      <div key={attendee.booking_id} className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#0B4550] transition-colors">
        <div className="w-12 h-12 rounded-full bg-[#0B4550] text-[#E6FF2B] flex items-center justify-center text-lg font-medium">
          {getInitials(attendee.name)}
        </div>
        <div className="flex-1">
          <span className="text-lg font-medium text-[#0B4550] block">{attendee.name}</span>
          <span className={`text-xs font-medium uppercase tracking-widest ${attendee.status === 'Attended' ? 'text-emerald-500' : 'text-[#898A8D]'}`}>
            {attendee.status}
          </span>
        </div>
        {/* ATTENDANCE TOGGLE */}
        <button onClick={() => toggleAttendance(attendee.booking_id, attendee.status)} className={`p-3 rounded-xl transition-colors ${attendee.status === 'Attended' ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-gray-300 hover:text-emerald-500 shadow-sm border border-gray-200'}`}>
          <CheckSquare size={24} />
        </button>
      </div>
    ))}
  </div>
)}
                      </>
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-xl font-medium text-[#898A8D]">Time block reserved for personal tasks.</p>
                      </div>
                    )}

                    {/* CANCEL & DELETE EVENT */}
                    <button 
                      onClick={() => handleDeleteSession(selectedSession.id)} 
                      className="w-full mt-6 py-3 rounded-2xl border border-red-200 text-red-500 font-bold hover:bg-red-50 hover:border-red-500 transition-colors flex items-center justify-center gap-2"
                      title="Cancel & Delete Event"
                    >
                      <Trash2 size={18} /> Cancel & Delete Event
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: PACKAGES */}
        {activePage === 'Packages' && (
          <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8">
              <div className="flex-1"></div>
              <div className="flex gap-3">
                <div className="bg-white border border-gray-100 rounded-xl p-1 flex items-center shadow-sm">
                  <button onClick={() => setPackageViewMode('grid')} className={`p-2 rounded-lg transition-colors ${packageViewMode === 'grid' ? 'bg-[#0B4550] text-[#E6FF2B]' : 'text-[#898A8D] hover:text-[#0B4550]'}`} title="Grid View">
                    <LayoutGrid size={20} />
                  </button>
                  <button onClick={() => setPackageViewMode('list')} className={`p-2 rounded-lg transition-colors ${packageViewMode === 'list' ? 'bg-[#0B4550] text-[#E6FF2B]' : 'text-[#898A8D] hover:text-[#0B4550]'}`} title="List View">
                    <List size={20} />
                  </button>
                </div>

                <select 
                  value={packageSortBy} 
                  onChange={(e) => setPackageSortBy(e.target.value)}
                  className="bg-white border border-gray-100 text-[#0B4550] px-4 py-3 rounded-xl font-medium text-base outline-none shadow-sm cursor-pointer"
                >
                  <option value="newest">Recently Added</option>
                  <option value="az">Alphabetical (A-Z)</option>
                  <option value="za">Alphabetical (Z-A)</option>
                  <option value="price_low">Price (Low to High)</option>
                  <option value="price_high">Price (High to Low)</option>
                </select>

                <button onClick={() => handleOpenPackageModal()} className="bg-[#0B4550] text-[#E6FF2B] px-6 py-3 rounded-xl font-medium text-lg flex items-center gap-2 hover:brightness-95 transition-all shadow-sm">
                  <Plus size={24} /> Create Package
                </button>
              </div>
            </div>

            {packageViewMode === 'list' ? (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-sm font-medium text-[#898A8D] uppercase tracking-wider border-b border-gray-100">
                      <th className="pb-4 px-4 font-bold">Package Name</th>
                      <th className="pb-4 px-4 font-bold">Type</th>
                      <th className="pb-4 px-4 font-bold">Sessions</th>
                      <th className="pb-4 px-4 font-bold">Validity</th>
                      <th className="pb-4 px-4 font-bold">Price</th>
                      <th className="pb-4 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-lg font-medium text-[#0B4550]">
                    {sortedPackages.map(pkg => (
                      <tr key={pkg.id} onClick={() => handleOpenPackageModal(pkg)} className="border-b border-gray-50 hover:bg-[#F9F7F2] transition-colors cursor-pointer group">
                        <td className="py-4 px-4">
                          <span className="font-bold">{pkg.name}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-lg text-sm font-medium ${pkg.type === 'Unlimited' ? 'bg-[#E6FF2B]/30 text-[#0B4550]' : 'bg-gray-100 text-[#898A8D]'}`}>
                            {pkg.type}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-base">
                          {pkg.type === 'Unlimited' ? '∞' : `${pkg.session_count} Sessions`}
                        </td>
                        <td className="py-4 px-4 text-base">
                          {pkg.validity_days} Days
                        </td>
                        <td className="py-4 px-4 font-bold">
                          RM {pkg.price}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button className="p-2 text-[#898A8D] hover:text-[#0B4550] bg-white rounded-lg shadow-sm hover:shadow transition-all">
                            <Plus size={18} className="rotate-45" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sortedPackages.map(pkg => (
                  <div key={pkg.id} className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-[#0B4550] transition-colors flex flex-col">
                    {pkg.type === 'Unlimited' && <div className="absolute top-0 right-0 bg-[#E6FF2B] text-[#0B4550] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl shadow-sm">Unlimited</div>}
                    
                    <h3 className="text-2xl font-extrabold text-[#0B4550] mb-2 pr-10">{pkg.name}</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-sm font-bold text-[#898A8D]">RM</span>
                      <span className="text-4xl font-black text-[#0B4550]">{pkg.price}</span>
                    </div>

                    <div className="space-y-3 mb-8 flex-1">
                      <div className="flex items-center gap-3 text-sm font-bold text-[#898A8D]">
                        <div className="w-8 h-8 rounded-full bg-[#F9F7F2] flex items-center justify-center text-[#0B4550] shrink-0"><Package size={16}/></div>
                        {pkg.type === 'Unlimited' ? 'Unlimited Sessions' : `${pkg.session_count} Sessions`}
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold text-[#898A8D]">
                        <div className="w-8 h-8 rounded-full bg-[#F9F7F2] flex items-center justify-center text-[#0B4550] shrink-0"><Clock size={16}/></div>
                        Valid for {pkg.validity_days} days
                      </div>
                    </div>

                    <button onClick={() => handleOpenPackageModal(pkg)} className="w-full py-4 rounded-xl font-bold bg-[#F9F7F2] text-[#0B4550] group-hover:bg-[#0B4550] group-hover:text-[#E6FF2B] transition-colors">
                      Edit Package
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW: ANALYTICS */}
        {activePage === 'Analytics' && (
          <div className="animate-in fade-in duration-500">
            <div className="flex justify-end items-center mb-8">
              <div className="flex bg-white rounded-full p-1.5 shadow-sm border border-gray-100">
                {['1M', '3M', '6M', '1Y', 'All Time'].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-full text-lg font-medium transition-all ${activeTab === tab ? 'bg-[#898A8D] text-white' : 'text-[#898A8D] hover:text-[#0B4550]'}`}>{tab}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
               <div className="bg-[#0B4550] rounded-3xl p-6 shadow-md">
                 <h3 className="text-white/80 font-medium text-lg mb-2">Net Revenue Growth</h3>
                 <div className="flex items-end gap-3">
                   <h2 className="text-5xl font-medium text-white">{analyticsData.revenueGrowthStr}</h2>
                   {analyticsData.revenueGrowthPositive ? (
                     <TrendingUp size={24} className="text-[#E6FF2B] mb-2" />
                   ) : (
                     <TrendingDown size={24} className="text-red-400 mb-2" />
                   )}
                 </div>
               </div>
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                 <h3 className="text-[#898A8D] font-medium text-lg mb-2">Client Retention Rate</h3>
                 <h2 className="text-5xl font-medium text-[#0B4550]">{analyticsData.retentionRate}%</h2>
               </div>
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                 <h3 className="text-[#898A8D] font-medium text-lg mb-2">Avg. Session Attendance</h3>
                 <h2 className="text-5xl font-medium text-[#0B4550]">{analyticsData.attendanceRate}%</h2>
               </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-medium text-2xl text-[#0B4550]">Revenue & Client Growth</h3>
                    <p className="text-sm text-[#898A8D] mt-1">Comparing 6-month historical trends</p>
                  </div>
                  <div className="flex gap-4 text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-[#0B4550]"><span className="w-3 h-3 rounded-full bg-[#0B4550] inline-block"></span> Revenue</span>
                    <span className="flex items-center gap-1.5 text-[#898A8D]"><span className="w-3 h-3 rounded-full bg-[#E6FF2B] inline-block"></span> Active Clients</span>
                  </div>
                </div>
                <div className="h-64 w-full border-b-2 border-l-2 border-gray-100 relative flex items-end justify-between px-4 pb-0 pt-10">
                    <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 500 240">
                      {svgPathRevenue && <path d={svgPathRevenue} fill="none" stroke="#0B4550" strokeWidth="5" strokeLinecap="round" className="transition-all duration-500" />}
                      {svgPathClients && <path d={svgPathClients} fill="none" stroke="#E6FF2B" strokeWidth="5" strokeLinecap="round" className="transition-all duration-500" />}
                    </svg>
                    <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-sm font-medium text-[#898A8D] px-2">
                      {analyticsData.chartData.map((m, idx) => (
                        <span key={idx} className="w-16 text-center">{m.label}</span>
                      ))}
                    </div>
                </div>
              </div>
              <div className="col-span-1 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col">
                <h3 className="font-medium text-2xl text-[#0B4550] mb-6">Top Packages</h3>
                <div className="flex-1 flex flex-col justify-center space-y-6">
                  {analyticsData.topPackages.map((pkg, idx) => {
                    const colors = ['bg-[#0B4550]', 'bg-[#898A8D]', 'bg-[#E6FF2B]'];
                    return (
                      <div key={pkg.name}>
                        <div className="flex justify-between text-base font-medium mb-2">
                          <span className="text-[#0B4550] truncate max-w-[180px]" title={pkg.name}>{pkg.name}</span>
                          <span className="text-[#898A8D]">{pkg.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-4">
                          <div className={`${colors[idx % colors.length]} h-4 rounded-full`} style={{ width: `${pkg.percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: SETTINGS */}
        {activePage === 'Settings' && (
          <div className="animate-in fade-in duration-500 max-w-3xl">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="font-medium text-2xl text-[#0B4550] mb-6 border-b border-gray-100 pb-4">Personal Information</h3>
              {settingsMessage && (
                <div className="mb-6 bg-emerald-50 text-emerald-600 p-4 rounded-xl text-base font-medium flex items-center gap-2">
                  <Check size={20} /> {settingsMessage}
                </div>
              )}
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Full Name</label>
                  <input type="text" value={settingsForm.full_name} onChange={(e) => setSettingsForm({...settingsForm, full_name: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-xl py-3 px-4 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B]" placeholder="Your Name" />
                </div>
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Company / Business Name</label>
                  <input type="text" value={settingsForm.company_name} onChange={(e) => setSettingsForm({...settingsForm, company_name: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-xl py-3 px-4 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B]" placeholder="e.g. XYZ Fitness" />
                </div>
                <button type="submit" disabled={isSavingSettings} className="bg-[#0B4550] text-[#E6FF2B] px-8 py-4 rounded-xl font-medium text-lg flex items-center gap-3 hover:brightness-95 transition-all shadow-sm">
                  {isSavingSettings ? <RotateCw className="animate-spin" size={24} /> : <Save size={24} />} Save Changes
                </button>
              </form>
            </div>
          </div>
        )}

{/* CREATE / EDIT PACKAGE MODAL */}
{isPackageModalOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[150] flex justify-center items-center p-4">
            <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200">
              <button onClick={() => setIsPackageModalOpen(false)} className="absolute top-6 right-6 w-8 h-8 bg-[#F9F7F2] rounded-full flex items-center justify-center text-[#0B4550] hover:bg-gray-200 transition-colors"><X size={18}/></button>
              
              <h2 className="text-2xl font-extrabold text-[#0B4550] mb-6">{editingPackage ? 'Edit Package' : 'Create New Package'}</h2>
              
              <div className="space-y-4 mb-8">
                <div><label className="text-xs font-bold text-[#898A8D] uppercase">Package Name</label><input type="text" value={packageForm.name} onChange={e => setPackageForm({...packageForm, name: e.target.value})} placeholder="e.g. 10 Class Pack" className="w-full bg-[#F9F7F2] rounded-xl p-3 text-[#0B4550] font-bold outline-none border border-transparent focus:border-[#E6FF2B]" /></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#898A8D] uppercase">Type</label>
                    <select value={packageForm.type} onChange={e => setPackageForm({...packageForm, type: e.target.value})} className="w-full bg-[#F9F7F2] rounded-xl p-3 text-[#0B4550] font-bold outline-none">
                      <option value="Session Pack">Session Pack</option>
                      <option value="Unlimited">Unlimited</option>
                    </select>
                  </div>
                  <div><label className="text-xs font-bold text-[#898A8D] uppercase">Price (RM)</label><input type="number" value={packageForm.price} onChange={e => setPackageForm({...packageForm, price: e.target.value})} className="w-full bg-[#F9F7F2] rounded-xl p-3 text-[#0B4550] font-bold outline-none border border-transparent focus:border-[#E6FF2B]" /></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-xs font-bold text-[#898A8D] uppercase">Sessions Included</label><input type="number" disabled={packageForm.type === 'Unlimited'} value={packageForm.type === 'Unlimited' ? 0 : packageForm.session_count} onChange={e => setPackageForm({...packageForm, session_count: e.target.value})} className="w-full bg-[#F9F7F2] rounded-xl p-3 text-[#0B4550] font-bold outline-none border border-transparent focus:border-[#E6FF2B] disabled:opacity-50" /></div>
                  <div><label className="text-xs font-bold text-[#898A8D] uppercase">Validity (Days)</label><input type="number" value={packageForm.validity_days} onChange={e => setPackageForm({...packageForm, validity_days: e.target.value})} className="w-full bg-[#F9F7F2] rounded-xl p-3 text-[#0B4550] font-bold outline-none border border-transparent focus:border-[#E6FF2B]" /></div>
                </div>
              </div>

              <div className="flex gap-3">
                {editingPackage && (
                  <button onClick={() => handleDeletePackage(editingPackage.id)} className="px-5 py-4 rounded-xl font-bold bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                    <Trash2 size={20} />
                  </button>
                )}
                <button onClick={handleSavePackage} className="flex-1 py-4 rounded-xl font-extrabold bg-[#0B4550] text-[#E6FF2B] hover:scale-105 transition-transform shadow-md">
                  {editingPackage ? 'Save Changes' : 'Create Package'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: CLASS MODE */}
        {activePage === 'ClassMode' && (
          <div className="absolute inset-0 bg-white z-[60] flex flex-col animate-in fade-in duration-500 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white sticky top-0 z-10 shadow-sm">
              <h1 className="text-3xl font-black text-[#0B4550]">Class Check-In</h1>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#898A8D]" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search your name..." 
                    value={classSearchQuery}
                    onChange={(e) => setClassSearchQuery(e.target.value)}
                    className="w-72 pl-12 pr-4 py-3 bg-[#F9F7F2] border-none rounded-full text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#E6FF2B] text-[#0B4550] placeholder-[#898A8D]"
                  />
                </div>
                <button 
                  onClick={() => setShowExitPinModal(true)}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                >
                  <Lock size={20} />
                </button>
              </div>
            </div>

            {/* Client Grid */}
            <div className="flex-1 overflow-y-auto p-8 bg-[#F9F7F2]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...clients]
                  .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
                  .filter(c => {
                    if (!classSearchQuery) return true;
                    return (c.name || '').toLowerCase().includes(classSearchQuery.toLowerCase());
                  })
                  .map(client => (
                  <button 
                    key={client.id}
                    onClick={() => {
                      setSelectedClassClient(client);
                      setShowCheckInModal(true);
                    }}
                    className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 hover:border-[#0B4550] transition-all flex flex-col items-center gap-3 active:scale-95 group"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#0B4550] text-[#E6FF2B] flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform">
                      {getInitials(client.name)}
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-lg text-[#0B4550] text-center line-clamp-1 leading-tight">{client.name}</span>
                      <span className="text-xs font-medium text-[#898A8D] mt-1">
                        {client.unlimited ? 'Unlimited Access' : `${client.remaining_package || 0} Sessions Left`}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Check-in Modal */}
            {showCheckInModal && selectedClassClient && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
                <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl text-center">
                  <div className="w-20 h-20 rounded-full bg-[#0B4550] text-[#E6FF2B] flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                    {getInitials(selectedClassClient.name)}
                  </div>
                  <h2 className="text-3xl font-black text-[#0B4550] mb-2">Check In?</h2>
                  <p className="text-xl text-[#898A8D] mb-8 font-medium">{selectedClassClient.name}</p>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setShowCheckInModal(false)}
                      className="flex-1 py-4 rounded-xl font-bold text-[#898A8D] bg-[#F9F7F2] hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleConfirmClassCheckIn}
                      className="flex-1 py-4 rounded-xl font-bold text-[#E6FF2B] bg-[#0B4550] hover:scale-105 transition-transform"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && undoTargetClient && (
              <div className="fixed inset-0 bg-[#0B4550] z-[80] flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-300">
                <div className="w-32 h-32 bg-[#E6FF2B] rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(230,255,43,0.3)]">
                  <Check size={64} className="text-[#0B4550]" />
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                  Thank you!<br/>Have a great workout session today,<br/>
                  <span className="text-[#E6FF2B]">{undoTargetClient.name}</span>!
                </h1>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-12 max-w-lg w-full border border-white/20">
                  {undoTargetClient.unlimited ? (
                    <p className="text-2xl text-white font-medium">
                      You have <span className="text-[#E6FF2B] font-black">
                        {Math.max(0, Math.ceil((new Date(undoTargetClient.expiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
                      </span> days till expiry.
                    </p>
                  ) : (
                    <p className="text-2xl text-white font-medium">
                      After today your updated session count is <span className="text-[#E6FF2B] font-black">{(undoTargetClient.initial_package || 0) - (undoTargetClient.remaining_package || 0)}/{undoTargetClient.initial_package}</span>.
                      <br/><span className="text-lg opacity-80 mt-2 block">You have {undoTargetClient.remaining_package} more sessions to go!</span>
                    </p>
                  )}
                </div>

                <div className="flex gap-4 w-full max-w-md">
                  <button 
                    onClick={() => setShowUndoPinModal(true)}
                    className="flex-1 py-4 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
                  >
                    Undo Mistake
                  </button>
                  <button 
                    onClick={() => setShowSuccessModal(false)}
                    className="flex-1 py-4 rounded-xl font-bold text-[#0B4550] bg-[#E6FF2B] hover:scale-105 transition-transform"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PIN MODAL FOR EXIT */}
        {showExitPinModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm text-center shadow-2xl">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock size={32} />
              </div>
              <h3 className="text-2xl font-black text-[#0B4550] mb-2">Exit Class Mode</h3>
              <p className="text-[#898A8D] mb-6 font-medium text-sm">Enter Gym Owner PIN to return to Dashboard</p>
              <input 
                type="password" 
                maxLength={4}
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full text-center text-4xl tracking-[1rem] font-black py-4 bg-[#F9F7F2] rounded-xl border-none outline-none focus:ring-2 focus:ring-[#0B4550] text-[#0B4550] mb-6"
                placeholder="••••"
              />
              <div className="flex gap-3">
                <button onClick={() => { setShowExitPinModal(false); setPinInput(''); }} className="flex-1 py-4 rounded-xl font-bold text-[#898A8D] bg-[#F9F7F2] hover:bg-gray-200">Cancel</button>
                <button onClick={handleExitClassMode} className="flex-1 py-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600">Exit</button>
              </div>
            </div>
          </div>
        )}

        {/* PIN MODAL FOR UNDO */}
        {showUndoPinModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm text-center shadow-2xl">
              <div className="w-16 h-16 bg-[#F9F7F2] text-[#0B4550] rounded-full flex items-center justify-center mx-auto mb-4">
                <Unlock size={32} />
              </div>
              <h3 className="text-2xl font-black text-[#0B4550] mb-2">Undo Check-in</h3>
              <p className="text-[#898A8D] mb-6 font-medium text-sm">Enter Gym Owner PIN to reverse this check-in</p>
              <input 
                type="password" 
                maxLength={4}
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full text-center text-4xl tracking-[1rem] font-black py-4 bg-[#F9F7F2] rounded-xl border-none outline-none focus:ring-2 focus:ring-[#0B4550] text-[#0B4550] mb-6"
                placeholder="••••"
              />
              <div className="flex gap-3">
                <button onClick={() => { setShowUndoPinModal(false); setPinInput(''); }} className="flex-1 py-4 rounded-xl font-bold text-[#898A8D] bg-[#F9F7F2] hover:bg-gray-200">Cancel</button>
                <button onClick={handleUndoClassCheckIn} className="flex-1 py-4 rounded-xl font-bold text-[#E6FF2B] bg-[#0B4550] hover:scale-105">Confirm</button>
              </div>
            </div>
          </div>
        )}

      </main>

{/* HISTORICAL DATA MODAL */}
{showBacklogModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-[#0B4550]">Add Historical Sale</h3>
        <button onClick={() => setShowBacklogModal(false)} className="text-gray-400"><X size={24} /></button>
      </div>

      <form onSubmit={async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const payload = {
    clientId: formData.get('clientId'), // Now we are getting the ID again!
    amount: backlogSelectedPrice, 
    packageName: formData.get('packageName'),
    date: formData.get('date')
  };
  await handleAddBacklog(payload);
}} className="space-y-4">
  
  {/* 1. SELECT CLIENT (The missing piece!) */}
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-1">Select Client</label>
    <select 
      name="clientId" 
      required 
      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#E6FF2B]"
    >
      <option value="">Choose a client...</option>
      {clients.map(c => (
        <option key={c.id} value={c.id}>{c.name}</option>
      ))}
    </select>
  </div>

  {/* 2. SELECT PACKAGE */}
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-1">Select Package</label>
    <select 
      name="packageName" 
      required 
      onChange={handlePackageSelection}
      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#E6FF2B]"
    >
      <option value="">Choose a package...</option>
      {packages.map((pkg) => (
        <option key={pkg.id} value={pkg.name}>{pkg.name}</option>
      ))}
      <option value="Custom">Custom / Other</option>
    </select>
  </div>

  {/* 3. AMOUNT */}
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-1">Amount (RM)</label>
    <input 
      name="amount" 
      type="number" 
      step="0.01" 
      required 
      value={backlogSelectedPrice}
      onChange={(e) => setBacklogSelectedPrice(e.target.value)}
      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#E6FF2B]" 
    />
  </div>

  {/* 4. DATE */}
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-1">Transaction Date</label>
    <input name="date" type="date" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#E6FF2B]" />
  </div>

  <button type="submit" className="w-full bg-[#E6FF2B] text-[#0B4550] font-bold py-4 rounded-xl mt-4 hover:opacity-90 transition-all shadow-lg">
    Sync to History
  </button>
</form>
    </div>
  </div>
)}

      {/* MODAL OVERLAY: MEGA ADD CLIENT FORM */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#0B4550]/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 py-8 overflow-hidden">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-4xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[95vh] overflow-y-auto">
            
            <button onClick={() => setShowAddModal(false)} className="absolute top-8 right-8 text-[#898A8D] hover:text-[#0B4550] transition-colors bg-gray-100 p-2 rounded-full">
              <X size={24} />
            </button>

            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-4xl font-medium text-[#0B4550] mb-2">New Client</h2>
                <p className="text-[#898A8D] font-medium text-lg">Add client details or bulk import your roster.</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleDownloadCSVTemplate}
                  type="button"
                  className="bg-transparent border border-[#0B4550] text-[#0B4550] px-5 py-2.5 rounded-xl font-medium text-base flex items-center gap-2 hover:bg-[#0B4550] hover:text-[#E6FF2B] transition-all shadow-sm"
                >
                  <Download size={20} /> Template
                </button>
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImportCSV}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  type="button"
                  className="bg-[#F9F7F2] border border-gray-200 text-[#0B4550] px-5 py-2.5 rounded-xl font-medium text-base flex items-center gap-2 hover:bg-gray-100 transition-all shadow-sm"
                >
                  <Upload size={20} /> Import CSV
                </button>
              </div>
            </div>
            
            <form onSubmit={handleAddClient} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Full Name</label>
                  <input type="text" required value={newClientData.name} onChange={(e) => setNewClientData({...newClientData, name: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B]" placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Date of Birth</label>
                  <input type="date" value={newClientData.dob} onChange={(e) => setNewClientData({...newClientData, dob: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B]" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Email</label>
                  <input type="email" required value={newClientData.email} onChange={(e) => setNewClientData({...newClientData, email: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B]" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Phone</label>
                  <input type="text" required value={newClientData.phone} onChange={(e) => setNewClientData({...newClientData, phone: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B]" placeholder="+1 (555) 000-0000" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Client Type</label>
                  <select value={newClientData.client_type} onChange={(e) => setNewClientData({...newClientData, client_type: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B] appearance-none cursor-pointer">
                    <option value="Group">Group Class</option>
                    <option value="PT">Personal Training</option>
                    <option value="Group & PT">Group + PT</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Member Status</label>
                  <select value={newClientData.member_status} onChange={(e) => setNewClientData({...newClientData, member_status: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B] appearance-none cursor-pointer">
                    <option value="Member">Member</option>
                    <option value="Non-Member">Non-Member / Drop-in</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Package Type</label>
                  <select value={newClientData.package} onChange={(e) => setNewClientData({...newClientData, package: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B] appearance-none cursor-pointer">
                    <option value="5 Class Pack">5 Class Pack</option>
                    <option value="10 Class Pack">10 Class Pack</option>
                    <option value="15 Class Pack">15 Class Pack</option>
                    <option value="30 Class Pack">30 Class Pack</option>
                    <option value="Monthly Unlimited">Monthly Unlimited</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Initial Pkg</label>
                  <input type="number" min="0" value={newClientData.initial_package} onChange={(e) => setNewClientData({...newClientData, initial_package: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-4 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B]" placeholder="e.g. 10" />
                </div>
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Remaining</label>
                  <input type="number" min="0" value={newClientData.remaining_package} onChange={(e) => setNewClientData({...newClientData, remaining_package: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-4 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B]" placeholder="e.g. 10" />
                </div>
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Date Paid</label>
                  <input type="date" value={newClientData.date_paid} onChange={(e) => setNewClientData({...newClientData, date_paid: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-3 font-medium text-base text-[#0B4550] outline-none focus:border-[#E6FF2B]" />
                </div>
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Expiry Date</label>
                  <input type="date" value={newClientData.expiry_date} onChange={(e) => setNewClientData({...newClientData, expiry_date: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-3 font-medium text-base text-[#0B4550] outline-none focus:border-[#E6FF2B]" />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="unlimited"
                  checked={newClientData.unlimited}
                  onChange={(e) => setNewClientData({...newClientData, unlimited: e.target.checked})}
                  className="w-6 h-6 text-[#0B4550] bg-[#F9F7F2] border-gray-200 rounded focus:ring-[#E6FF2B]" 
                />
                <label htmlFor="unlimited" className="text-[#0B4550] font-medium text-lg cursor-pointer">Unlimited (Time-Based Package)</label>
              </div>

              <button type="submit" disabled={isAddingClient} className="w-full bg-[#0B4550] text-[#E6FF2B] py-4 rounded-2xl font-medium text-xl hover:bg-[#0B4550]/90 transition-all shadow-md mt-4 flex justify-center">
                {isAddingClient ? <RotateCw className="animate-spin" size={28} /> : 'Save Client Profile'}
              </button>
            </form>
            
          </div>
        </div>
      )}

      {/* MODAL OVERLAY: ADD EVENT (NEW!) */}
      {showEventModal && (
        <div className="fixed inset-0 bg-[#0B4550]/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 py-8 overflow-hidden">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setShowEventModal(false)} className="absolute top-8 right-8 text-[#898A8D] hover:text-[#0B4550] transition-colors bg-gray-100 p-2 rounded-full">
              <X size={24} />
            </button>

            <h2 className="text-4xl font-medium text-[#0B4550] mb-2">New Event</h2>
            <p className="text-[#898A8D] font-medium text-lg mb-8">Schedule a class or block time off.</p>
            
            <form onSubmit={handleAddEvent} className="space-y-6">
              
              <div>
                <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Event Title</label>
                <input type="text" required value={newEventData.title} onChange={(e) => setNewEventData({...newEventData, title: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B]" placeholder="e.g. Morning HIIT Bootcamp" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Date</label>
                  <input type="date" required value={newEventData.date} onChange={(e) => setNewEventData({...newEventData, date: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B]" />
                </div>
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Start Time</label>
                  <select required value={newEventData.time} onChange={(e) => setNewEventData({...newEventData, time: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B] appearance-none cursor-pointer">
                    {["06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "12:00 PM", "03:00 PM", "04:30 PM", "05:00 PM", "06:00 PM", "07:00 PM"].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Duration</label>
                  <select required value={newEventData.duration} onChange={(e) => setNewEventData({...newEventData, duration: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B] appearance-none cursor-pointer">
                    <option value="30 min">30 min</option>
                    <option value="45 min">45 min</option>
                    <option value="60 min">60 min</option>
                    <option value="90 min">90 min</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Type</label>
                  <select required value={newEventData.type} onChange={(e) => setNewEventData({...newEventData, type: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B] appearance-none cursor-pointer">
                    <option value="Group Class">Group Class</option>
                    <option value="1-on-1">1-on-1 Session</option>
                    <option value="Blocked">Blocked / Busy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Location</label>
                  <input type="text" value={newEventData.location} onChange={(e) => setNewEventData({...newEventData, location: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B]" placeholder="e.g. Main Floor" />
                </div>
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Max Capacity</label>
                  <input type="number" min="1" disabled={newEventData.type === '1-on-1' || newEventData.type === 'Blocked'} value={newEventData.type === '1-on-1' ? 1 : newEventData.capacity} onChange={(e) => setNewEventData({...newEventData, capacity: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B] disabled:opacity-50" />
                </div>
              </div>

              <button type="submit" disabled={isAddingEvent} className="w-full bg-[#0B4550] text-[#E6FF2B] py-4 rounded-2xl font-medium text-xl hover:bg-[#0B4550]/90 transition-all shadow-md mt-4 flex justify-center">
                {isAddingEvent ? <RotateCw className="animate-spin" size={28} /> : 'Save to Schedule'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL OVERLAY: GOOGLE CALENDAR SYNC */}
      {showGoogleSyncModal && (
        <div className="fixed inset-0 bg-[#0B4550]/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 py-8 overflow-hidden">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowGoogleSyncModal(false)} 
              className="absolute top-8 right-8 text-[#898A8D] hover:text-[#0B4550] transition-colors bg-gray-100 p-2 rounded-full"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-xl font-black">G</div>
              <div>
                <h2 className="text-3xl font-bold text-[#0B4550]">Calendar Sync</h2>
                <p className="text-[#898A8D] font-medium text-sm">Keep your schedule in sync across all devices.</p>
              </div>
            </div>

            <div className="space-y-6 mt-8">
              {/* Option A: Direct Sync */}
              <div className="bg-[#F9F7F2] rounded-3xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-[#0B4550] mb-2">Option A: Link Google Account</h3>
                <p className="text-sm text-[#898A8D] mb-4">Authorize TrackPoint to sync and push classes/appointments directly into your Google Calendar.</p>
                
                <button
                  onClick={handleLinkGoogleCalendar}
                  disabled={isLinkingGoogle}
                  className={`w-full py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${isGoogleCalendarConnected ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-[#0B4550] text-white hover:bg-opacity-90'}`}
                >
                  {isLinkingGoogle ? (
                    <>
                      <RotateCw size={18} className="animate-spin" /> Connecting Account...
                    </>
                  ) : isGoogleCalendarConnected ? (
                    <>
                      <Check size={18} /> Account Connected! (Click to Unlink)
                    </>
                  ) : (
                    <>
                      Link Google Calendar Account
                    </>
                  )}
                </button>
              </div>

              {/* Option B: iCal Live Feed */}
              <div className="bg-[#F9F7F2] rounded-3xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-[#0B4550] mb-2">Option B: Live iCal Feed Link</h3>
                <p className="text-sm text-[#898A8D] mb-4">Compatible with Google Calendar, Apple Calendar, Outlook, and others. Subscribes your device to a live-updated schedule feed.</p>
                
                <div className="flex gap-2 mb-4 bg-white border border-gray-200 rounded-xl p-1.5 items-center">
                  <input 
                    type="text" 
                    readOnly 
                    value={`${window.location.origin}/api/feeds/schedule.ics?trainer_id=${userId}`} 
                    className="flex-1 bg-transparent px-3 text-xs font-mono text-gray-500 overflow-x-auto outline-none"
                  />
                  <button 
                    onClick={handleCopyFeedLink} 
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${copiedFeedLink ? 'bg-emerald-100 text-emerald-700' : 'bg-[#E6FF2B] text-[#0B4550] hover:brightness-95'}`}
                  >
                    {copiedFeedLink ? 'Copied!' : 'Copy Feed Link'}
                  </button>
                </div>

                <div className="text-[11px] text-[#898A8D] space-y-1 bg-white p-3.5 rounded-xl border border-gray-50 font-medium">
                  <p className="font-bold text-gray-600 uppercase tracking-widest text-[9px] mb-1">To add to Google Calendar:</p>
                  <p>1. Open Google Calendar on desktop.</p>
                  <p>2. Next to "Other calendars" on the left, click **+** &rarr; **From URL**.</p>
                  <p>3. Paste this feed link and click **Add Calendar**.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RENEW PACKAGE (ADVANCED) */}
      {showRenewModal && (
        <div className="fixed inset-0 bg-[#0B4550]/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 my-auto">
            <button onClick={() => setShowRenewModal(false)} className="absolute top-8 right-8 text-[#898A8D] hover:text-[#0B4550] bg-gray-100 p-2 rounded-full transition-colors">
              <X size={24} />
            </button>
            <h2 className="text-3xl font-bold text-[#0B4550] mb-2">Renew Package</h2>
            <p className="text-[#898A8D] font-medium mb-8">Set the details for this renewal/purchase.</p>
            
            <div className="space-y-6">
              <div>
                <label className="text-[#898A8D] font-bold text-xs uppercase tracking-widest mb-2 block">Select Package</label>
                <select 
                  value={renewForm.packageId} 
                  onChange={(e) => {
                    const pkg = packagesList.find(p => p.id === e.target.value);
                    setRenewForm({
                      ...renewForm, 
                      packageId: e.target.value,
                      amount: pkg?.price || 0,
                      sessions: pkg?.session_count || 0
                    });
                  }}
                  className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-bold text-[#0B4550] outline-none"
                >
                  {packagesList.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>{pkg.name} (RM {pkg.price})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#898A8D] font-bold text-xs uppercase tracking-widest mb-2 block">Renewal Date</label>
                  <input 
                    type="date" 
                    value={renewForm.renewalDate} 
                    onChange={(e) => setRenewForm({...renewForm, renewalDate: e.target.value})}
                    className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-4 font-bold text-[#0B4550] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#898A8D] font-bold text-xs uppercase tracking-widest mb-2 block">Expiry Date (Optional)</label>
                  <input 
                    type="date" 
                    value={renewForm.expiryDate} 
                    onChange={(e) => setRenewForm({...renewForm, expiryDate: e.target.value})}
                    className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-4 font-bold text-[#0B4550] outline-none"
                    placeholder="Auto-calculated if blank"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#898A8D] font-bold text-xs uppercase tracking-widest mb-2 block">Amount Paid (RM)</label>
                  <input 
                    type="number" 
                    value={renewForm.amount} 
                    onChange={(e) => setRenewForm({...renewForm, amount: e.target.value})}
                    className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-4 font-bold text-[#0B4550] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#898A8D] font-bold text-xs uppercase tracking-widest mb-2 block">Credits Added</label>
                  <input 
                    type="number" 
                    value={renewForm.sessions} 
                    onChange={(e) => setRenewForm({...renewForm, sessions: e.target.value})}
                    className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-4 font-bold text-[#0B4550] outline-none"
                  />
                </div>
              </div>

              <button 
                onClick={processRenewal}
                className="w-full bg-[#0B4550] text-[#E6FF2B] py-4 rounded-2xl font-bold text-xl hover:scale-[1.01] transition-all shadow-lg mt-4"
              >
                Confirm Renewal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: MANUAL LEDGER ENTRY */}
      {showLedgerModal && (
        <div className="fixed inset-0 bg-[#0B4550]/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 my-auto">
            <button onClick={() => { setShowLedgerModal(false); setEditingLedgerItem(null); setIsBulkMode(false); }} className="absolute top-8 right-8 text-[#898A8D] hover:text-[#0B4550] bg-gray-100 p-2 rounded-full transition-colors">
              <X size={24} />
            </button>
            <h2 className="text-3xl font-bold text-[#0B4550] mb-2">{isBulkMode ? 'Bulk History Entry' : (editingLedgerItem ? 'Edit Ledger Entry' : 'New Ledger Entry')}</h2>
            <p className="text-[#898A8D] font-medium mb-8">{isBulkMode ? `Importing multiple records for ${selectedClient?.name}.` : (editingLedgerItem ? 'Update the details for this record.' : `Add a manual record for ${selectedClient?.name}.`)}</p>
            
            <div className="space-y-6">
              {!editingLedgerItem && (
                <div className="flex bg-[#F9F7F2] p-1 rounded-2xl mb-2">
                  <button onClick={() => setIsBulkMode(false)} className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${!isBulkMode ? 'bg-white text-[#0B4550] shadow-sm' : 'text-[#898A8D]'}`}>Single Entry</button>
                  <button onClick={() => setIsBulkMode(true)} className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${isBulkMode ? 'bg-white text-[#0B4550] shadow-sm' : 'text-[#898A8D]'}`}>Bulk Import</button>
                </div>
              )}

              {isBulkMode ? (
                <div className="space-y-4">
                  {/* IMPORT ACTIONS BAR */}
                  <div className="flex gap-2 mb-4 bg-[#F9F7F2] p-2 rounded-2xl border border-gray-100">
                    <button 
                      onClick={handleDownloadHistoryTemplate}
                      className="flex-1 flex flex-col items-center justify-center py-2 bg-white rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-[#E6FF2B]"
                    >
                      <Download size={16} className="text-[#0B4550] mb-1" />
                      <span className="text-[10px] font-bold text-[#898A8D] uppercase">Template</span>
                    </button>
                    <button 
                      onClick={() => historyFileInputRef.current?.click()}
                      className="flex-1 flex flex-col items-center justify-center py-2 bg-white rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-[#E6FF2B]"
                    >
                      <Upload size={16} className="text-[#0B4550] mb-1" />
                      <span className="text-[10px] font-bold text-[#898A8D] uppercase">CSV Import</span>
                    </button>
                    <input type="file" accept=".csv" className="hidden" ref={historyFileInputRef} onChange={handleImportHistoryCSV} />
                  </div>

                  {/* PASTE AREA */}
                  <div className="relative group">
                    <textarea 
                      placeholder="Paste from Excel/Sheets here... (Date, Time, Type, Desc, Amount, Price)"
                      className="w-full bg-[#F9F7F2] border-2 border-dashed border-gray-200 rounded-2xl p-3 text-xs font-medium text-[#0B4550] outline-none focus:border-[#E6FF2B] transition-all h-20 resize-none"
                      onChange={handlePasteHistory}
                    />
                    <div className="absolute right-3 bottom-3 text-[10px] font-bold text-gray-300 group-focus-within:text-[#0B4550]">PASTE DATA</div>
                  </div>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                  {bulkEntries.map((entry, index) => (
                    <div key={entry.id} className="p-4 bg-[#F9F7F2] rounded-2xl relative space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex gap-2">
                        <select 
                          value={entry.type} 
                          onChange={(e) => {
                            const newEntries = [...bulkEntries];
                            newEntries[index].type = e.target.value;
                            setBulkEntries(newEntries);
                          }}
                          className="flex-1 bg-white border border-gray-100 rounded-xl py-2 px-3 text-xs font-bold text-[#0B4550] outline-none"
                        >
                          <option value="purchase">Purchase</option>
                          <option value="usage">Usage</option>
                          <option value="note">Note</option>
                        </select>
                        <input 
                          type="date" 
                          value={entry.date} 
                          onChange={(e) => {
                            const newEntries = [...bulkEntries];
                            newEntries[index].date = e.target.value;
                            setBulkEntries(newEntries);
                          }}
                          className="flex-1 bg-white border border-gray-100 rounded-xl py-2 px-3 text-[10px] font-bold text-[#0B4550] outline-none"
                        />
                        <input 
                          type="time" 
                          value={entry.time} 
                          onChange={(e) => {
                            const newEntries = [...bulkEntries];
                            newEntries[index].time = e.target.value;
                            setBulkEntries(newEntries);
                          }}
                          className="flex-1 bg-white border border-gray-100 rounded-xl py-2 px-3 text-[10px] font-bold text-[#0B4550] outline-none"
                        />
                        {bulkEntries.length > 1 && (
                          <button onClick={() => setBulkEntries(bulkEntries.filter(e => e.id !== entry.id))} className="text-red-300 hover:text-red-500"><X size={16}/></button>
                        )}
                      </div>
                      <input 
                        type="text" 
                        placeholder="Description..." 
                        value={entry.title}
                        onChange={(e) => {
                          const newEntries = [...bulkEntries];
                          newEntries[index].title = e.target.value;
                          setBulkEntries(newEntries);
                        }}
                        className="w-full bg-white border border-gray-100 rounded-xl py-2 px-3 text-sm font-medium text-[#0B4550] outline-none"
                      />
                      <div className="flex gap-3">
                        {entry.type === 'purchase' && (
                          <div className="flex-1">
                            <label className="text-[10px] font-bold text-[#898A8D] uppercase ml-1">Price (RM)</label>
                            <input 
                              type="number" 
                              value={entry.price}
                              onChange={(e) => {
                                const newEntries = [...bulkEntries];
                                newEntries[index].price = e.target.value;
                                setBulkEntries(newEntries);
                              }}
                              className="w-full bg-white border border-gray-100 rounded-xl py-2 px-3 text-xs font-bold text-[#0B4550] outline-none"
                            />
                          </div>
                        )}
                        {entry.type !== 'note' && (
                          <div className="flex-1">
                            <label className="text-[10px] font-bold text-[#898A8D] uppercase ml-1">{entry.type === 'purchase' ? 'Add Credits' : 'Use Credits'}</label>
                            <input 
                              type="number" 
                              value={entry.amount}
                              onChange={(e) => {
                                const newEntries = [...bulkEntries];
                                newEntries[index].amount = e.target.value;
                                setBulkEntries(newEntries);
                              }}
                              className="w-full bg-white border border-gray-100 rounded-xl py-2 px-3 text-xs font-bold text-[#0B4550] outline-none"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setBulkEntries([...bulkEntries, { id: Date.now(), type: 'usage', title: '', amount: 1, date: new Date().toISOString().split('T')[0], time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), price: 0 }])}
                    className="w-full py-3 border-2 border-dashed border-gray-100 rounded-2xl text-[#898A8D] font-bold text-sm hover:border-[#0B4550] hover:text-[#0B4550] transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Add Another Row
                  </button>
                </div>
              </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="text-[#898A8D] font-bold text-xs uppercase tracking-widest mb-2 block">Entry Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => setLedgerForm({...ledgerForm, type: 'purchase', amount: 0})}
                        className={`py-3 rounded-xl font-bold border-2 transition-all text-xs ${ledgerForm.type === 'purchase' ? 'bg-[#0B4550] text-white border-[#0B4550]' : 'bg-white text-[#898A8D] border-gray-100 hover:border-[#0B4550]'}`}
                      >
                        Purchase
                      </button>
                      <button 
                        onClick={() => setLedgerForm({...ledgerForm, type: 'usage', amount: 1})}
                        className={`py-3 rounded-xl font-bold border-2 transition-all text-xs ${ledgerForm.type === 'usage' ? 'bg-[#0B4550] text-white border-[#0B4550]' : 'bg-white text-[#898A8D] border-gray-100 hover:border-[#0B4550]'}`}
                      >
                        Usage
                      </button>
                      <button 
                        onClick={() => setLedgerForm({...ledgerForm, type: 'note', amount: 0})}
                        className={`py-3 rounded-xl font-bold border-2 transition-all text-xs ${ledgerForm.type === 'note' ? 'bg-[#0B4550] text-white border-[#0B4550]' : 'bg-white text-[#898A8D] border-gray-100 hover:border-[#0B4550]'}`}
                      >
                        Note
                      </button>
                    </div>
                  </div>

                  {ledgerForm.type === 'purchase' && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-200 space-y-4">
                      <div>
                        <label className="text-[#898A8D] font-bold text-xs uppercase tracking-widest mb-2 block">Select Package</label>
                        <select 
                          value={ledgerForm.packageId} 
                          onChange={(e) => {
                            const pkg = packagesList.find(p => p.id === e.target.value);
                            setLedgerForm({
                              ...ledgerForm, 
                              packageId: e.target.value,
                              price: pkg?.price || 0,
                              amount: pkg?.session_count || 0,
                              title: `Purchase: ${pkg?.name}`
                            });
                          }}
                          className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-bold text-[#0B4550] outline-none"
                        >
                          <option value="">Choose a package...</option>
                          {packagesList.map(pkg => (
                            <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[#898A8D] font-bold text-xs uppercase tracking-widest mb-2 block">Price (RM)</label>
                          <input 
                            type="number" 
                            value={ledgerForm.price} 
                            onChange={(e) => setLedgerForm({...ledgerForm, price: e.target.value})}
                            className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-4 font-bold text-[#0B4550] outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[#898A8D] font-bold text-xs uppercase tracking-widest mb-2 block">Sessions Added</label>
                          <input 
                            type="number" 
                            value={ledgerForm.amount} 
                            onChange={(e) => setLedgerForm({...ledgerForm, amount: e.target.value})}
                            className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-4 font-bold text-[#0B4550] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-[#898A8D] font-bold text-xs uppercase tracking-widest mb-2 block">Description / Note</label>
                    <input 
                      type="text" 
                      value={ledgerForm.title} 
                      onChange={(e) => setLedgerForm({...ledgerForm, title: e.target.value})}
                      className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-bold text-[#0B4550] outline-none"
                      placeholder={ledgerForm.type === 'usage' ? 'e.g. Manual Session Deduction' : ledgerForm.type === 'purchase' ? 'e.g. Bought 10 Class Pack' : 'e.g. Injury Update or Client Goal'}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[#898A8D] font-bold text-xs uppercase tracking-widest mb-2 block">Date</label>
                        <input 
                          type="date" 
                          value={ledgerForm.date} 
                          onChange={(e) => setLedgerForm({...ledgerForm, date: e.target.value})}
                          className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-4 font-bold text-[#0B4550] outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[#898A8D] font-bold text-xs uppercase tracking-widest mb-2 block">Time</label>
                        <input 
                          type="time" 
                          value={ledgerForm.time} 
                          onChange={(e) => setLedgerForm({...ledgerForm, time: e.target.value})}
                          className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-4 font-bold text-[#0B4550] outline-none"
                        />
                      </div>
                    </div>
                    {ledgerForm.type === 'usage' && (
                      <div>
                        <label className="text-[#898A8D] font-bold text-xs uppercase tracking-widest mb-2 block">Credits to Deduct</label>
                        <input 
                          type="number" 
                          value={ledgerForm.amount} 
                          onChange={(e) => setLedgerForm({...ledgerForm, amount: e.target.value})}
                          className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-4 font-bold text-[#0B4550] outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button 
                onClick={isBulkMode ? handleBulkLedgerEntry : handleManualLedgerEntry}
                className="w-full bg-[#0B4550] text-[#E6FF2B] py-4 rounded-2xl font-bold text-xl hover:scale-[1.01] transition-all shadow-lg mt-4"
              >
                {isBulkMode ? `Save ${bulkEntries.length} Records` : (editingLedgerItem ? 'Update Entry' : 'Save Entry')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- AI COPILOT FLOATING BUTTON --- */}
      <button 
        onClick={() => setShowAICopilot(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#0B4550] text-[#E6FF2B] rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-40 group border-4 border-white"
      >
        <Sparkles size={28} className="group-hover:rotate-12 transition-transform" />
      </button>

      {/* --- AI COPILOT DRAWER --- */}
      {showAICopilot && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-[#0B4550]/20 backdrop-blur-sm" onClick={() => setShowAICopilot(false)}></div>
          <div className="w-full max-w-md bg-white h-full shadow-2xl relative flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#0B4550] text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E6FF2B] text-[#0B4550] flex items-center justify-center">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">TrackPoint Assistant</h3>
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-[#E6FF2B]/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                    AI Copilot Online
                  </div>
                </div>
              </div>
              <button onClick={() => setShowAICopilot(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {aiChatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl font-medium text-sm shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#0B4550] text-white rounded-tr-none' 
                      : 'bg-[#F9F7F2] text-[#0B4550] rounded-tl-none border border-gray-100'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#F9F7F2] p-4 rounded-2xl rounded-tl-none border border-gray-100 flex gap-2">
                    <div className="w-2 h-2 bg-[#898A8D] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#898A8D] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-[#898A8D] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-[#F9F7F2]">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="relative"
              >
                <input 
                  type="text"
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  placeholder="Ask about your business..."
                  className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-5 pr-14 font-medium text-[#0B4550] outline-none shadow-sm focus:border-[#0B4550] transition-all"
                />
                <button 
                  type="submit"
                  disabled={!aiMessage.trim() || isAiLoading}
                  className="absolute right-2 top-2 bottom-2 w-10 bg-[#0B4550] text-[#E6FF2B] rounded-xl flex items-center justify-center hover:scale-105 disabled:opacity-50 transition-all"
                >
                  <Send size={18} />
                </button>
              </form>
              <p className="text-[10px] text-[#898A8D] text-center mt-3 font-medium">
                Powered by Gemini AI • Contextual Business Analytics
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* --- Helper Components --- */
function NavItem({ icon, label, isActive, onClick }) {
  return (
    <div onClick={onClick} className={`flex items-center gap-4 px-4 py-4 rounded-2xl cursor-pointer transition-all ${isActive ? 'bg-[#F9F7F2] text-[#0B4550] font-medium' : 'text-[#898A8D] font-medium hover:bg-gray-50 hover:text-[#0B4550]'}`}>
      {icon}
      <span className="text-lg">{label}</span>
      {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-[#E6FF2B]"></div>}
    </div>
  );
}

function StatCard({ title, value, trend, isPositive, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-[150px] ${onClick ? 'cursor-pointer hover:shadow-md hover:border-[#E6FF2B] transition-all group' : ''}`}
    >
      <h3 className="text-[#898A8D] font-medium text-lg">{title}</h3>
      <div>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-medium text-[#0B4550] mb-1">{value}</h2>
        <div className={`flex items-center text-base font-medium gap-1.5 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
          <span>{trend} from last month</span>
        </div>
      </div>
    </div>
  );
}

function ChartBar({ month, height, active }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 md:w-14 lg:w-16 h-36 flex items-end">
        <div className={`w-full rounded-t-xl transition-all ${active ? 'bg-[#E6FF2B]' : 'bg-[#0B4550]'} ${height}`}></div>
      </div>
      <span className={`text-xl font-medium ${active ? 'text-[#0B4550]' : 'text-[#898A8D]'}`}>{month}</span>
    </div>
  );
}

function Day({ date, day, active }) {
  return (
    <div className={`flex flex-col items-center justify-center w-14 h-20 rounded-xl cursor-pointer transition-all ${active ? 'bg-[#898A8D] text-white shadow-md' : 'text-[#898A8D] hover:bg-[#F9F7F2]'}`}>
      <span className="text-base mb-1 font-medium">{day}</span>
      <span className={`text-3xl font-medium ${active ? 'text-white' : 'text-[#0B4550]'}`}>{date}</span>
    </div>
  );
}

function TransactionRow({ name, avatar, desc, method, amount }) {
  return (
    <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
      <td className="py-4 w-1/4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#F9F7F2] text-[#0B4550] flex items-center justify-center text-base font-medium shrink-0">{avatar}</div>
          <span className="truncate">{name}</span>
        </div>
      </td>
      <td className="py-4 text-[#898A8D] w-1/4">{desc}</td>
      <td className="py-4 text-[#898A8D] w-1/4">{method}</td>
      <td className="py-4 w-1/6 text-emerald-600 font-medium">{amount}</td>
      <td className="py-4 w-1/12 text-center">
        <button className="p-2 rounded-xl bg-[#F9F7F2] text-[#0B4550] hover:bg-[#E6FF2B] hover:text-[#0B4550] transition-all inline-flex items-center justify-center group relative shadow-sm border border-gray-100">
          <FileText size={22} className="group-hover:hidden" />
          <Download size={22} className="hidden group-hover:block" />
        </button>
      </td>
    </tr>
  );
}