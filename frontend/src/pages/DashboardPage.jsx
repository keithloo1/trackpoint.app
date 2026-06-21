import React, { useState, useEffect, useRef, useMemo } from 'react';
import { supabase } from '../supabaseClient'; 
import { 
  Home, Users, Calendar, CalendarSearch, BarChart2, Package,
  Settings, LogOut, Search, Bell,
  ChevronLeft, ChevronRight, ChevronDown, TrendingUp, TrendingDown, ArrowUpRight, RotateCw,
  DollarSign, Download, FileText, Plus, ArrowLeft, Copy, Check, Clock, MapPin, CheckSquare, X, Square, ArrowRight, Save, Trash2, Upload, Minus, LayoutGrid, List, Edit3, Lock, Monitor, Unlock, Sparkles, Send, Bot, MessageSquare, Award, Camera, CreditCard, Eye, EyeOff, User
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

const formatExpiryDate = (expiryStr) => {
  if (!expiryStr) return 'No expiry';
  try {
    const d = new Date(expiryStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return expiryStr;
  }
};

const getDailyQuote = () => {
  const quotes = [
    "“What gets measured gets managed.” – Peter Drucker",
    "“Action is the foundational key to all success.” – Pablo Picasso",
    "“Success is the sum of small efforts, repeated day-in and day-out.” – Robert Collier",
    "“Don’t count the days, make the days count.” – Muhammad Ali",
    "“The secret of getting ahead is getting started.” – Mark Twain",
    "“Today I will do what others won't, so tomorrow I can accomplish what others can't.” – Jerry Rice",
    "“The only place where success comes before work is in the dictionary.” – Vidal Sassoon",
    "“You miss 100% of the shots you don’t take.” – Wayne Gretzky",
    "“Strength does not come from physical capacity. It comes from an indomitable will.” – Mahatma Gandhi",
    "“It never gets easier, you just get better.” – Greg LeMond",
    "“The difference between the impossible and the possible lies in a person’s determination.” – Tommy Lasorda",
    "“If you want something you’ve never had, you must be willing to do something you’ve never done.” – Thomas Jefferson",
    "“Your body can stand almost anything. It’s your mind that you have to convince.” – Unknown",
    "“I've failed over and over again in my life and that is why I succeed.” – Michael Jordan",
    "“The hard part isn’t getting your body in shape. The hard part is getting your mind in shape.” – Unknown",
    "“Energy and persistence conquer all things.” – Benjamin Franklin",
    "“Perseverance is the hard work you do after you get tired of doing the hard work you already did.” – Newt Gingrich",
    "“Success isn’t always about greatness. It’s about consistency.” – Dwayne Johnson",
    "“We are what we repeatedly do. Excellence, then, is not an act, but a habit.” – Aristotle",
    "“The only way to define your limits is by going beyond them.” – Arthur C. Clarke",
    "“Small daily improvements over time lead to stunning results.” – Robin Sharma",
    "“Do something today that your future self will thank you for.” – Unknown",
    "“Believe you can and you're halfway there.” – Theodore Roosevelt",
    "“Difficulty is the excuse history never accepts.” – Edward R. Murrow",
    "“There are no shortcuts to any place worth going.” – Beverly Sills",
    "“It’s not whether you get knocked down; it’s whether you get up.” – Vince Lombardi",
    "“Continuous improvement is better than delayed perfection.” – Mark Twain",
    "“If it doesn’t challenge you, it doesn’t change you.” – Fred Devito",
    "“You don't have to be extreme, just consistent.” – Unknown",
    "“Look in the mirror. That’s your competition.” – Unknown",
    "“The clock is ticking. Are you becoming the person you want to be?” – Greg Plitt"
  ];
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = new Date() - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return quotes[dayOfYear % quotes.length];
};

const getExpiryText = (client) => {
  if (!client.expiry) return 'No expiry date';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiryDate = new Date(client.expiry);
  expiryDate.setHours(0, 0, 0, 0);
  
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    const absDays = Math.abs(diffDays);
    return `Expired ${absDays} day${absDays > 1 ? 's' : ''} ago`;
  } else if (diffDays === 0) {
    return 'Expires today';
  } else if (diffDays === 1) {
    return 'Expires tomorrow';
  } else {
    return `Expires in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
  }
};

const getInitials = (name) => {
  if (!name || name === 'Trainer') return 'T';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

const getWeekDays = (date) => {
  const current = new Date(date);
  const day = current.getDay();
  const diff = current.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(current.getFullYear(), current.getMonth(), diff);
  
  const days = [];
  for (let i = 0; i < 7; i++) {
    const next = new Date(monday);
    next.setDate(monday.getDate() + i);
    days.push(next);
  }
  return days;
};

const getCalendarDays = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  let startDay = firstDay.getDay(); 
  startDay = startDay === 0 ? 6 : startDay - 1;
  const totalDays = new Date(year, month + 1, 0).getDate();
  
  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push({ isPlaceholder: true, day: '' });
  }
  for (let i = 1; i <= totalDays; i++) {
    days.push({ isPlaceholder: false, day: i, date: new Date(year, month, i) });
  }
  return days;
};

const parseNotesAndMetadata = (rawNotes) => {
  if (!rawNotes) return { 
    notes: '', 
    trialMeta: { checklist: [false, false, false, false], status: 'Pending' },
    sessionNotes: {},
    address: '',
    workoutLogs: []
  };
  
  let notes = '';
  let trialMeta = { checklist: [false, false, false, false], status: 'Pending' };
  let sessionNotes = {};
  let address = '';
  let workoutLogs = [];

  // Extract Workout Logs
  if (rawNotes.includes('---WORKOUT_LOGS---')) {
    const workoutParts = rawNotes.split('---WORKOUT_LOGS---');
    let workoutContent = workoutParts[1] || '';
    const delimiters = ['---TRIAL_META---', '---SESSION_NOTES---', '---ADDRESS_META---'];
    for (const d of delimiters) {
      if (workoutContent.includes(d)) {
        workoutContent = workoutContent.split(d)[0];
      }
    }
    try {
      workoutLogs = JSON.parse(workoutContent.trim());
    } catch (e) {
      console.error("Error parsing workout logs: ", e);
    }
  }

  // Extract Session Notes
  if (rawNotes.includes('---SESSION_NOTES---')) {
    const sessionParts = rawNotes.split('---SESSION_NOTES---');
    let sessionContent = sessionParts[1] || '';
    const delimiters = ['---TRIAL_META---', '---ADDRESS_META---', '---WORKOUT_LOGS---'];
    for (const d of delimiters) {
      if (sessionContent.includes(d)) {
        sessionContent = sessionContent.split(d)[0];
      }
    }
    try {
      sessionNotes = JSON.parse(sessionContent.trim());
    } catch (e) {
      console.error("Error parsing session notes: ", e);
    }
  }

  // Extract Address Meta
  if (rawNotes.includes('---ADDRESS_META---')) {
    const addressParts = rawNotes.split('---ADDRESS_META---');
    let addressContent = addressParts[1] || '';
    const delimiters = ['---SESSION_NOTES---', '---TRIAL_META---', '---WORKOUT_LOGS---'];
    for (const d of delimiters) {
      if (addressContent.includes(d)) {
        addressContent = addressContent.split(d)[0];
      }
    }
    address = addressContent.trim();
  }

  // Extract Trial Meta
  if (rawNotes.includes('---TRIAL_META---')) {
    const trialParts = rawNotes.split('---TRIAL_META---');
    let trialContent = trialParts[1] || '';
    const delimiters = ['---SESSION_NOTES---', '---ADDRESS_META---', '---WORKOUT_LOGS---'];
    for (const d of delimiters) {
      if (trialContent.includes(d)) {
        trialContent = trialContent.split(d)[0];
      }
    }
    try {
      trialMeta = JSON.parse(trialContent.trim());
    } catch (e) {
      console.error("Error parsing trial metadata: ", e);
    }
  }

  // Clean raw notes of all metadata sections to get the user's plain text notes
  let cleanNotes = rawNotes;
  const sections = ['---TRIAL_META---', '---SESSION_NOTES---', '---ADDRESS_META---', '---WORKOUT_LOGS---'];
  for (const sec of sections) {
    if (cleanNotes.includes(sec)) {
      cleanNotes = cleanNotes.split(sec)[0];
    }
  }
  notes = cleanNotes.trim();

  return { notes, trialMeta, sessionNotes, address, workoutLogs };
};

const serializeNotesAndMetadata = (notes, trialMeta, sessionNotes = {}, address = '', workoutLogs = []) => {
  let result = `${notes.trim()}`;
  result += `\n\n---TRIAL_META---\n${JSON.stringify(trialMeta)}`;
  result += `\n\n---SESSION_NOTES---\n${JSON.stringify(sessionNotes)}`;
  result += `\n\n---ADDRESS_META---\n${address.trim()}`;
  result += `\n\n---WORKOUT_LOGS---\n${JSON.stringify(workoutLogs)}`;
  return result;
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

const parseTimeToMinutes = (timeString) => {
  if (!timeString) return 0;
  const match = timeString.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) return 0;
  
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  
  if (ampm === 'PM' && hours !== 12) {
    hours += 12;
  } else if (ampm === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return hours * 60 + minutes;
};

const isSessionPast = (session) => {
  if (!session?.date || !session?.time) return false;
  
  const match = session.time.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) return false;
  
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  
  if (ampm === 'PM' && hours !== 12) {
    hours += 12;
  } else if (ampm === 'AM' && hours === 12) {
    hours = 0;
  }
  
  const [year, month, day] = session.date.split('-').map(num => parseInt(num, 10));
  const sessionDateObj = new Date(year, month - 1, day, hours, minutes, 0, 0);
  
  return sessionDateObj < new Date();
};

const getSessionDisplayTitle = (s) => {
  if (!s) return '';
  const type = (s.type || '').toLowerCase();
  const title = (s.title || '').toLowerCase();
  const is1on1 = type === '1-on-1' || title.includes('1-on-1') || title.includes('1 on 1') || title.includes('personal training') || title.includes('pt session');
  
  if (is1on1 && s.attendees && s.attendees.length > 0) {
    return s.attendees.map(a => a.name).join(', ');
  }
  return s.title;
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
};

export default function Dashboard({ session }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // --- REVENUE SECURITY STATES ---
  const [showSecurityPinModal, setShowSecurityPinModal] = useState(false);
  const [securityPinInput, setSecurityPinInput] = useState('');
  const [securityPinError, setSecurityPinError] = useState(false);
  const [pendingPageAction, setPendingPageAction] = useState(null); // 'Revenue' or 'RevealRevenue'
  const [pendingTabAction, setPendingTabAction] = useState(null);
  const [isRevenueUnlocked, setIsRevenueUnlocked] = useState(false);
  const [isRevenueHidden, setIsRevenueHidden] = useState(true);

  const handleSecurityPinChange = (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 4);
    setSecurityPinInput(cleaned);
    setSecurityPinError(false);

    if (cleaned.length === 4) {
      if (cleaned === CLASS_PIN) {
        setIsRevenueUnlocked(true);
        setShowSecurityPinModal(false);
        setSecurityPinInput('');
        
        if (pendingPageAction === 'Revenue' || pendingPageAction === 'Analytics' || pendingPageAction === 'Clients') {
          setActivePage(pendingPageAction);
          if (pendingTabAction) {
            setActiveTab(pendingTabAction);
          }
        } else if (pendingPageAction === 'RevealRevenue') {
          setIsRevenueHidden(false);
        }
        setPendingPageAction(null);
        setPendingTabAction(null);
      } else {
        setSecurityPinError(true);
        setTimeout(() => {
          setSecurityPinInput('');
          setSecurityPinError(false);
        }, 800);
      }
    }
  };

  const handleNavigateToPage = (pageName, initialTab = null) => {
    let targetTab = initialTab;
    if (!targetTab) {
      if (pageName === 'Clients') {
        targetTab = 'All Clients';
      } else if (pageName === 'Revenue') {
        targetTab = 'Month';
      } else if (pageName === 'Analytics') {
        targetTab = '1M';
      }
    }

    if (pageName === 'Revenue' || pageName === 'Analytics' || pageName === 'Clients') {
      if (isRevenueUnlocked) {
        setActivePage(pageName);
        if (targetTab) {
          setActiveTab(targetTab);
        }
      } else {
        setPendingPageAction(pageName);
        setPendingTabAction(targetTab);
        setSecurityPinInput('');
        setSecurityPinError(false);
        setShowSecurityPinModal(true);
      }
    } else {
      setActivePage(pageName);
      if (targetTab) {
        setActiveTab(targetTab);
      }
    }
  };

  const handleToggleRevenueVisibility = () => {
    if (isRevenueHidden) {
      if (isRevenueUnlocked) {
        setIsRevenueHidden(false);
      } else {
        setPendingPageAction('RevealRevenue');
        setSecurityPinInput('');
        setSecurityPinError(false);
        setShowSecurityPinModal(true);
      }
    } else {
      setIsRevenueHidden(true);
    }
  };

  const [activePage, setActivePage] = useState('Dashboard');
  const [mobileDashboardTab, setMobileDashboardTab] = useState('schedule');
  const [showMobileRosterDrawer, setShowMobileRosterDrawer] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isArchiveMode, setIsArchiveMode] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [packageViewMode, setPackageViewMode] = useState('grid');
  const [packageSortBy, setPackageSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [showBacklogModal, setShowBacklogModal] = useState(false);
  const [backlogSelectedPrice, setBacklogSelectedPrice] = useState("");
  const [isCustomPackage, setIsCustomPackage] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [packages, setPackages] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const transactionsWithInvoices = useMemo(() => {
    // Sort transactions chronologically to calculate sequential invoice numbers
    const sortedAsc = [...transactions].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    const invoiceNumMap = {};
    let invoiceCounter = 101;
    sortedAsc.forEach((t) => {
      if (t.amount > 0 && !t.is_backlog) {
        invoiceNumMap[t.id] = invoiceCounter++;
      }
    });
    return transactions.map(t => ({
      ...t,
      invoiceNumber: invoiceNumMap[t.id] ? `INV-${invoiceNumMap[t.id]}` : null
    }));
  }, [transactions]);
  const [packagesList, setPackagesList] = useState([]);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [packageForm, setPackageForm] = useState({ name: '', type: 'Session Pack', session_count: 0, price: 0, validity_days: 30 });
  const fileInputRef = useRef(null);
  const historyFileInputRef = useRef(null);

  // --- CLASS MODE STATES ---
  const [showExitPinModal, setShowExitPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [exitPinError, setExitPinError] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedClassClient, setSelectedClassClient] = useState(null);
  const [selectedClassSession, setSelectedClassSession] = useState(null);
  const [undoTargetClient, setUndoTargetClient] = useState(null);
  const [undoTargetTransactionId, setUndoTargetTransactionId] = useState(null);
  const [undoTargetBookingId, setUndoTargetBookingId] = useState(null);
  const [showUndoPinModal, setShowUndoPinModal] = useState(false);
  const [classSearchQuery, setClassSearchQuery] = useState('');
  
  // --- ATTENDANCE SUMMARY MODAL STATES ---
  const [showAttendanceSummaryModal, setShowAttendanceSummaryModal] = useState(false);
  const [attendanceSummaryList, setAttendanceSummaryList] = useState([]);
  const [isSavingAttendanceSummary, setIsSavingAttendanceSummary] = useState(false);
  
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
  const [activeRevenuePeriod, setActiveRevenuePeriod] = useState('Year');
  
  // --- REAL DATA STATES ---
  const [clients, setClients] = useState([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);

  // --- SCHEDULE CONFIGURATION STATES & HELPERS ---
  const [scheduleSettings, setScheduleSettings] = useState({
    coaches: ["Coach Keith", "Coach John", "Coach Sarah"],
    locations: ["Main Ring", "Studio A", "Gym Floor"],
    classes: [
      { name: "Muay Thai Class", credits: 1 },
      { name: "PT Session", credits: 2 },
      { name: "Group Class", credits: 1 },
      { name: "Open Gym", credits: 1 }
    ]
  });
  const [settingsClientId, setSettingsClientId] = useState(null);

  const mapClientWithAddress = (c) => {
    const parsed = parseNotesAndMetadata(c.notes);
    return {
      ...c,
      address: parsed.address || ''
    };
  };

  const getClassCreditCost = (title) => {
    if (!title) return 1;
    const match = scheduleSettings.classes.find(cls => cls.name.toLowerCase() === title.toLowerCase());
    return match ? parseInt(match.credits) || 1 : 1;
  };

  // --- State for Revenue Tab ---
  useEffect(() => {
    // 1. Fetch the initial data when the page first loads
    const fetchTransactions = async () => {
      try {
        let user = session?.user;
        if (!user) {
          const { data: { session: localSession } } = await supabase.auth.getSession();
          user = localSession?.user;
        }
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
  const [companyLogo, setCompanyLogo] = useState('');
  const [trainerProfile, setTrainerProfile] = useState(null);
  const [settingsForm, setSettingsForm] = useState({
    full_name: '',
    company_name: '',
    company_address: '',
    company_phone: '',
    company_email: '',
    company_logo: '',
    bank_name: '',
    bank_account_name: '',
    bank_account_number: ''
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState(null);

  // States for Scheduling Settings CRUD in Settings Page
  const [newCoachName, setNewCoachName] = useState('');
  const [newLocationName, setNewLocationName] = useState('');
  const [newClassName, setNewClassName] = useState('');
  const [newClassCredits, setNewClassCredits] = useState(1);

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
  const [trialMeta, setTrialMeta] = useState({ checklist: [false, false, false, false], status: 'Pending' });
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSavedMsg, setNotesSavedMsg] = useState(false);
  
  // State for client profile tabs & workout logs
  const [clientDetailTab, setClientDetailTab] = useState('notes');
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [activeWorkoutLogId, setActiveWorkoutLogId] = useState(null);
  const [isSavingWorkoutLogs, setIsSavingWorkoutLogs] = useState(false);
  const [workoutLogsSavedMsg, setWorkoutLogsSavedMsg] = useState(false);
  
  // State for Schedule (NOW LIVE!)
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [selectedScheduleDate, setSelectedScheduleDate] = useState(new Date());

  // State for scheduled session workout logs
  const [sessionDetailTab, setSessionDetailTab] = useState('roster');
  const [sessionWorkoutTitle, setSessionWorkoutTitle] = useState('');
  const [sessionWorkoutDate, setSessionWorkoutDate] = useState('');
  const [sessionWorkoutContent, setSessionWorkoutContent] = useState('');
  const [isSyncingSessionWorkout, setIsSyncingSessionWorkout] = useState(false);
  const [sessionWorkoutSyncMsg, setSessionWorkoutSyncMsg] = useState('');

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { clients: [], sessions: [] };
    const q = searchQuery.toLowerCase();
    
    const matchedClients = clients.filter(c => 
      c.status !== 'Archived' && (
        (c.name || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.phone || '').toLowerCase().includes(q)
      )
    ).slice(0, 5);
    
    const matchedSessions = sessions.filter(s => 
      s.type !== 'Blocked' && (
        (s.title || '').toLowerCase().includes(q) ||
        (s.location || '').toLowerCase().includes(q) ||
        (s.date || '').toLowerCase().includes(q)
      )
    ).slice(0, 5);
    
    return {
      clients: matchedClients,
      sessions: matchedSessions
    };
  }, [searchQuery, clients, sessions]);

  const handleSelectClientFromSearch = (client) => {
    setSelectedClient(client);
    setActivePage('Clients');
    setSearchQuery('');
  };

  const handleSelectSessionFromSearch = (session) => {
    setSelectedSession(session);
    setActivePage('Calendar');
    if (session.date) {
      const sDate = new Date(session.date);
      setCurrentCalendarDate(sDate);
      setSelectedScheduleDate(sDate);
    }
    setSearchQuery('');
  };

  // State for Todo List
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  // MEGA ADD CLIENT MODAL STATES
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [selectedInvoiceTransaction, setSelectedInvoiceTransaction] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [newClientData, setNewClientData] = useState({
    name: '', email: '', phone: '', dob: '', address: '',
    package: '', expiry_date: '', unlimited: false, 
    client_type: 'Group', member_status: 'Member', 
    initial_package: '', remaining_package: '', date_paid: ''
  });

  // ADD EVENT MODAL STATES (NEW!)
  const [showEventModal, setShowEventModal] = useState(false);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEventData, setNewEventData] = useState({
    title: '', date: '', time: '09:00 AM', duration: '60 min', type: 'Group Class', location: 'Main Floor', capacity: 10, coach: '', recurrence: 'none', recurrenceCount: 4, recurrenceDays: []
  });
  const [eventAssignedClients, setEventAssignedClients] = useState([]);
  const [searchEventClientsQuery, setSearchEventClientsQuery] = useState('');
  const [showEventClientsDropdown, setShowEventClientsDropdown] = useState(false);

  // EDIT EVENT MODAL STATES
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [editEventData, setEditEventData] = useState({
    id: '', title: '', date: '', time: '09:00 AM', duration: '60 min', type: 'Group Class', location: 'Main Floor', capacity: 10, coach: ''
  });

  // ROSTER MULTI-SELECT CLIENT STATES
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [searchStudentQuery, setSearchStudentQuery] = useState('');
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);

  // SESSION NOTE EDIT STATES
  const [editingSessionNoteBookingId, setEditingSessionNoteBookingId] = useState(null);
  const [editingSessionNoteTitle, setEditingSessionNoteTitle] = useState('');
  const [sessionNoteText, setSessionNoteText] = useState('');
  const [showSessionNoteModal, setShowSessionNoteModal] = useState(false);
  const [isSavingSessionNote, setIsSavingSessionNote] = useState(false);

  // MOVE CLIENT MODAL STATES
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [movingAttendee, setMovingAttendee] = useState(null);
  const [moveTargetDate, setMoveTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [moveTargetSessionId, setMoveTargetSessionId] = useState('');

  // ATTENDANCE TAB STATE
  const [expandedDates, setExpandedDates] = useState({});

  const greeting = getGreeting();
  const quote = getDailyQuote();
  
  const todayFormattedFull = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const todayMonthDay = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const [userId, setUserId] = useState(session?.user?.id || 'trainer_default');
  const [showGoogleSyncModal, setShowGoogleSyncModal] = useState(false);
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1036495166418-fallbacksynthesizerdefault.apps.googleusercontent.com';
  const [isLinkingGoogle, setIsLinkingGoogle] = useState(false);
  const [copiedFeedLink, setCopiedFeedLink] = useState(false);

  const isGcalConnected = useMemo(() => {
    return !!trainerProfile?.gcal_refresh_token;
  }, [trainerProfile?.gcal_refresh_token]);

  const isGcalExpired = false;

  const handleLinkGoogleCalendar = async () => {
    if (isGcalConnected) {
      if (!window.confirm("Are you sure you want to unlink your Google Calendar account? Syncing will stop.")) return;
      setIsLinkingGoogle(true);
      try {
        const { error } = await supabase.from('profiles').update({ gcal_refresh_token: null }).eq('id', userId);
        if (error) throw error;
        setTrainerProfile(prev => ({ ...prev, gcal_refresh_token: null }));
        alert("Successfully unlinked Google Calendar account.");
      } catch (err) {
        alert("Error unlinking account: " + err.message);
      } finally {
        setIsLinkingGoogle(false);
      }
      return;
    }

    setIsLinkingGoogle(true);
    try {
      if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
        throw new Error("Google Identity Services script not loaded. Please refresh the page and try again.");
      }

      const client = window.google.accounts.oauth2.initCodeClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/calendar.events',
        ux_mode: 'popup',
        access_type: 'offline',
        select_account: true,
        callback: async (response) => {
          if (response.error) {
            setIsLinkingGoogle(false);
            alert("Google Authentication failed: " + response.error_description);
            return;
          }
          if (response.code) {
            try {
              const exchangeRes = await fetch('/api/gcal/exchange', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: response.code, trainer_id: userId })
              });
              const data = await exchangeRes.json();
              if (data.success) {
                setTrainerProfile(prev => ({ ...prev, gcal_refresh_token: 'active_refresh_token' }));
                alert("Google Calendar account linked permanently! Direct, real-time background sync is now active.");
              } else {
                throw new Error(data.error || "Token exchange failed.");
              }
            } catch (err) {
              alert("Error exchanging token with server: " + err.message);
            } finally {
              setIsLinkingGoogle(false);
            }
          }
        },
        error_callback: (err) => {
          setIsLinkingGoogle(false);
          alert("Error opening auth prompt: " + (err.message || JSON.stringify(err)));
        }
      });

      client.requestCode();
    } catch (err) {
      setIsLinkingGoogle(false);
      alert("Failed to initialize Google Authentication: " + err.message);
    }
  };

  const syncToGoogleCalendar = async (action, sessionData) => {
    if (!isGcalConnected) {
      console.warn("Google Calendar direct sync skipped: Calendar is not connected.");
      return;
    }

    // Dynamic 1-on-1 title resolution for Google Calendar integration
    const resolvedTitle = getSessionDisplayTitle(sessionData);
    const enrichedSessionData = {
      ...sessionData,
      title: resolvedTitle
    };

    try {
      const response = await fetch('/api/gcal/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          sessionData: enrichedSessionData,
          trainer_id: userId
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Sync server responded with status ${response.status}`);
      }

      console.log(`Successfully processed ${data.action} sync for Google Calendar event.`);
    } catch (err) {
      console.error("Failed to sync to Google Calendar: ", err);
    }
  };

  const parseTimeToParts = (timeStr) => {
    const defaultParts = { hour: '09', minute: '00', ampm: 'AM' };
    if (!timeStr) return defaultParts;
    const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match) {
      return { 
        hour: match[1].padStart(2, '0'), 
        minute: match[2], 
        ampm: match[3].toUpperCase() 
      };
    }
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
      const hour = parts[0].padStart(2, '0');
      const minAmpm = parts[1].trim();
      const minMatch = minAmpm.match(/^(\d{2})/);
      const minute = minMatch ? minMatch[1] : '00';
      const ampm = minAmpm.toUpperCase().includes('PM') ? 'PM' : 'AM';
      return { hour, minute, ampm };
    }
    return defaultParts;
  };

  const handleNewEventTimeChange = (part, value) => {
    const parts = parseTimeToParts(newEventData.time || '09:00 AM');
    parts[part] = value;
    setNewEventData(prev => ({
      ...prev,
      time: `${parts.hour}:${parts.minute} ${parts.ampm}`
    }));
  };

  const handleEditEventTimeChange = (part, value) => {
    const parts = parseTimeToParts(editEventData.time || '09:00 AM');
    parts[part] = value;
    setEditEventData(prev => ({
      ...prev,
      time: `${parts.hour}:${parts.minute} ${parts.ampm}`
    }));
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
      const hasValidPackage = c.package && packagesList.some(p => p.name === c.package);
      if (hasValidPackage) {
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

    // Calculate total payments per client
    const clientRevenueMap = {};
    transactions.forEach(t => {
      const amt = Number(t.amount) || 0;
      if (amt > 0) {
        const clientKey = t.client_name || 'Unknown';
        clientRevenueMap[clientKey] = (clientRevenueMap[clientKey] || 0) + amt;
      }
    });

    const clientRevenueList = Object.keys(clientRevenueMap).map(clientId => {
      const client = clients.find(c => c.id === clientId);
      return {
        id: clientId,
        name: client ? client.name : 'Unknown Client',
        totalPaid: clientRevenueMap[clientId]
      };
    }).sort((a, b) => b.totalPaid - a.totalPaid);

    const totalPositiveRevenue = clientRevenueList.reduce((sum, item) => sum + item.totalPaid, 0);

    const topRevenueClients = clientRevenueList.slice(0, 5);
    const otherRevenueSum = clientRevenueList.slice(5).reduce((sum, item) => sum + item.totalPaid, 0);

    const colors = ['#0B4550', '#E6FF2B', '#898A8D', '#0ea5e9', '#f43f5e'];
    const pieChartData = topRevenueClients.map((item, idx) => ({
      name: item.name,
      amount: item.totalPaid,
      percentage: totalPositiveRevenue > 0 ? ((item.totalPaid / totalPositiveRevenue) * 100).toFixed(1) : "0.0",
      color: colors[idx % colors.length]
    }));

    if (otherRevenueSum > 0) {
      pieChartData.push({
        name: 'Others',
        amount: otherRevenueSum,
        percentage: totalPositiveRevenue > 0 ? ((otherRevenueSum / totalPositiveRevenue) * 100).toFixed(1) : "0.0",
        color: '#10b981'
      });
    }

    return {
      revenueGrowthStr,
      revenueGrowthPositive,
      thisMonthRev,
      activeClientsCount,
      retentionRate,
      attendanceRate,
      topPackages,
      chartData: last6Months,
      clientRevenueList,
      totalPositiveRevenue,
      pieChartData
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

  const dashboardMetrics = useMemo(() => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // Filter transactions to only those with non-zero financial amount
    let filtered = transactions.filter(t => Number(t.amount) !== 0);
    
    if (activeTab === 'Day') {
      filtered = filtered.filter(t => new Date(t.created_at) >= startOfDay);
    } else if (activeTab === 'Week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      filtered = filtered.filter(t => new Date(t.created_at) >= oneWeekAgo);
    } else if (activeTab === 'Month') {
      filtered = filtered.filter(t => {
        const d = new Date(t.created_at);
        return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
      });
    } else if (activeTab === 'Year') {
      filtered = filtered.filter(t => new Date(t.created_at).getFullYear() === today.getFullYear());
    }
    
    const totalRevenue = filtered.reduce((sum, t) => sum + Number(t.amount), 0);
    const totalCount = filtered.length;
    
    return { totalRevenue, totalCount };
  }, [transactions, activeTab]);

  const filteredTransactions = useMemo(() => {
    const today = new Date();
    // Filter transactions to only those with non-zero financial amount
    const revenueOnly = transactionsWithInvoices.filter(t => Number(t.amount) !== 0);

    return revenueOnly.filter(t => {
      const d = new Date(t.created_at);
      if (activeRevenuePeriod === 'Day') {
        return d.toDateString() === today.toDateString();
      } else if (activeRevenuePeriod === 'Week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return d >= oneWeekAgo;
      } else if (activeRevenuePeriod === 'Month') {
        return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
      } else if (activeRevenuePeriod === 'Year') {
        return d.getFullYear() === today.getFullYear();
      }
      return true; // 'All Time'
    });
  }, [transactionsWithInvoices, activeRevenuePeriod]);

  const groupedTransactions = useMemo(() => {
    const years = {};
    filteredTransactions.forEach(t => {
      const date = new Date(t.created_at);
      const year = date.getFullYear();
      const monthName = date.toLocaleDateString('en-US', { month: 'long' });
      
      if (!years[year]) {
        years[year] = {
          year: year,
          totalEarned: 0,
          months: {}
        };
      }
      
      if (!years[year].months[monthName]) {
        years[year].months[monthName] = {
          monthName: monthName,
          monthYear: `Rev-${monthName}-${year}`,
          items: [],
          totalEarned: 0,
          maxTimestamp: date.getTime()
        };
      }
      
      years[year].months[monthName].items.push(t);
      const amt = Number(t.amount);
      years[year].months[monthName].totalEarned += amt;
      years[year].totalEarned += amt;
    });
    return years;
  }, [filteredTransactions]);

  const groupedAttendance = useMemo(() => {
    const years = {};
    sessions.forEach(session => {
      if (!session.date) return;

      const attended = session.attendees?.filter(a => a.status === 'Attended') || [];
      if (attended.length === 0) return;

      const [yr, mo, dy] = session.date.split('-').map(num => parseInt(num, 10));
      const sessionDate = new Date(yr, mo - 1, dy);
      const year = sessionDate.getFullYear();
      const monthName = sessionDate.toLocaleDateString('en-US', { month: 'long' });
      const monthYear = `${monthName} ${year}`;

      const durationMins = parseInt(session.duration, 10) || 60;

      if (!years[year]) {
        years[year] = {
          year,
          totalHours: 0,
          totalClasses: 0,
          totalAttendances: 0,
          months: {}
        };
      }

      if (!years[year].months[monthYear]) {
        years[year].months[monthYear] = {
          monthName,
          monthYear,
          year,
          monthIndex: mo - 1,
          totalHours: 0,
          totalClasses: 0,
          totalAttendances: 0,
          dates: {}
        };
      }

      const dateStr = session.date;
      if (!years[year].months[monthYear].dates[dateStr]) {
        const formattedDate = sessionDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        years[year].months[monthYear].dates[dateStr] = {
          dateStr,
          formattedDate,
          timestamp: sessionDate.getTime(),
          sessions: []
        };
      }

      years[year].months[monthYear].dates[dateStr].sessions.push({
        ...session,
        attended,
        durationMins
      });

      years[year].totalHours += durationMins / 60;
      years[year].totalClasses += 1;
      years[year].totalAttendances += attended.length;

      years[year].months[monthYear].totalHours += durationMins / 60;
      years[year].months[monthYear].totalClasses += 1;
      years[year].months[monthYear].totalAttendances += attended.length;
    });

    // Sort sessions chronologically by time for each date
    Object.values(years).forEach(yearData => {
      Object.values(yearData.months).forEach(monthData => {
        Object.values(monthData.dates).forEach(dateData => {
          dateData.sessions.sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));
        });
      });
    });

    return years;
  }, [sessions]);

  const attendanceMonthStats = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonthName = today.toLocaleDateString('en-US', { month: 'long' });
    const currentMonthYear = `${currentMonthName} ${currentYear}`;

    let thisMonthHours = 0;
    let thisMonthClasses = 0;
    let thisMonthAttendances = 0;

    if (groupedAttendance[currentYear]?.months[currentMonthYear]) {
      const monthData = groupedAttendance[currentYear].months[currentMonthYear];
      thisMonthHours = monthData.totalHours;
      thisMonthClasses = monthData.totalClasses;
      thisMonthAttendances = monthData.totalAttendances;
    }

    return {
      hours: thisMonthHours,
      classes: thisMonthClasses,
      attendances: thisMonthAttendances
    };
  }, [groupedAttendance]);

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
      setClientDetailTab('notes');
      const parsed = parseNotesAndMetadata(selectedClient.notes);
      setClientNotes(parsed.notes);
      setTrialMeta(parsed.trialMeta);
      setWorkoutLogs(parsed.workoutLogs || []);
      if (parsed.workoutLogs && parsed.workoutLogs.length > 0) {
        setActiveWorkoutLogId(parsed.workoutLogs[0].id);
      } else {
        setActiveWorkoutLogId(null);
      }
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
        date_paid: selectedClient.date_paid || '',
        address: selectedClient.address || ''
      });
      setIsEditingClient(false); // Reset to read-only when clicking a new client
      fetchClientHistory(selectedClient);
    }
  }, [selectedClient]);

  useEffect(() => {
    if (selectedSession) {
      setSessionDetailTab('roster');
      setSessionWorkoutTitle(selectedSession.title || 'Workout Log');
      
      // Format date from YYYY-MM-DD to DD/MM/YYYY
      let displayDate = '';
      if (selectedSession.date) {
        const parts = selectedSession.date.split('-');
        if (parts.length === 3) {
          displayDate = `${parseInt(parts[2])}/${parseInt(parts[1])}/${parts[0]}`;
        } else {
          displayDate = selectedSession.date;
        }
      }
      setSessionWorkoutDate(displayDate);

      // Load draft from localStorage
      const cachedContent = localStorage.getItem('session_workout_' + selectedSession.id);
      setSessionWorkoutContent(cachedContent || '');
      setSessionWorkoutSyncMsg('');
    }
  }, [selectedSession]);

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
      let user = session?.user;
      if (!user) {
        const { data: { session: localSession } } = await supabase.auth.getSession();
        user = localSession?.user;
      }
      if (!user) return;
      setUserId(user.id);

      // Fetch Profile
      const { data: profileData, error: profileError } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (profileData) {
        setTrainerName(profileData.full_name || 'Trainer');
        setCompanyName(profileData.company_name || 'TrackPoint');
        setCompanyLogo(profileData.company_logo || '');
        setTrainerProfile(profileData);
        setSettingsForm({
          full_name: profileData.full_name || '',
          company_name: profileData.company_name || '',
          company_address: profileData.company_address || '',
          company_phone: profileData.company_phone || '',
          company_email: profileData.company_email || '',
          company_logo: profileData.company_logo || '',
          bank_name: profileData.bank_name || '',
          bank_account_name: profileData.bank_account_name || '',
          bank_account_number: profileData.bank_account_number || ''
        });
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
      if (clientData) {
        await loadSystemSettings(clientData);
        const normalClients = clientData.filter(c => c.email !== 'system_settings@trackpoint.app');
        setClients(normalClients.map(mapClientWithAddress));
        cleanUpAccidentalPackages(normalClients);
      }
      setIsLoadingClients(false);
    };
    fetchInitialData();
  }, []);

  const loadSystemSettings = async (allClients) => {
    const settingsClient = allClients.find(c => c.email === 'system_settings@trackpoint.app');
    if (settingsClient) {
      setSettingsClientId(settingsClient.id);
      if (settingsClient.notes) {
        // Try parsing via serialize metadata parser first
        const parsedMeta = parseNotesAndMetadata(settingsClient.notes);
        if (parsedMeta.sessionNotes && parsedMeta.sessionNotes.coaches && parsedMeta.sessionNotes.locations) {
          setScheduleSettings(parsedMeta.sessionNotes);
        } else {
          // Fallback to raw JSON parse for legacy compatibility
          try {
            const parsed = JSON.parse(settingsClient.notes);
            if (parsed.coaches && parsed.locations && parsed.classes) {
              setScheduleSettings(parsed);
            }
          } catch (e) {
            console.error("Error parsing system settings:", e);
          }
        }
      }
    } else {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const defaultSettings = {
          coaches: ["Coach Keith", "Coach John", "Coach Sarah"],
          locations: ["Main Ring", "Studio A", "Gym Floor"],
          classes: [
            { name: "Muay Thai Class", credits: 1 },
            { name: "PT Session", credits: 2 },
            { name: "Group Class", credits: 1 },
            { name: "Open Gym", credits: 1 }
          ]
        };

        const { data, error } = await supabase.from('clients').insert([{
          trainer_id: user.id,
          name: "__SYSTEM_SETTINGS__",
          email: "system_settings@trackpoint.app",
          phone: "00000000",
          notes: JSON.stringify(defaultSettings),
          package: "System",
          status: "Active",
          initial_package: 0,
          remaining_package: 0,
          used_sessions: 0,
          unlimited: true
        }]).select('*');
        
        if (data && data[0]) {
          setSettingsClientId(data[0].id);
        }
      } catch (err) {
        console.error("Error initializing system settings:", err);
      }
    }
  };

  const cleanUpAccidentalPackages = async (normalClients) => {
    try {
      const clientsWithBadDefault = normalClients.filter(c => c.package === '10 Class Pack');
      if (clientsWithBadDefault.length > 0) {
        const { data: realPkgs } = await supabase.from('packages').select('name');
        const hasRealTenClassPack = realPkgs && realPkgs.some(p => p.name === '10 Class Pack');
        if (!hasRealTenClassPack) {
          const clientIds = clientsWithBadDefault.map(c => c.id);
          await supabase
            .from('clients')
            .update({ package: '' })
            .in('id', clientIds);
          setClients(prev => prev.map(c => c.package === '10 Class Pack' ? { ...c, package: '' } : c));
        }
      }
    } catch (err) {
      console.error("Error in package default migration:", err);
    }
  };

  const fetchClients = async () => {
    const { data } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    if (data) {
      await loadSystemSettings(data);
      const normalClients = data.filter(c => c.email !== 'system_settings@trackpoint.app');
      setClients(normalClients.map(mapClientWithAddress));
      cleanUpAccidentalPackages(normalClients);
    }
  };

  const fetchSessions = async () => {
    let user = session?.user;
    if (!user) {
      const { data: { session: localSession } } = await supabase.auth.getSession();
      user = localSession?.user;
    }
    if (user) {
      await fetchLiveSchedule(user.id);
    }
  };

  // --- SCHEDULE HANDLERS (NEW!) ---
  const handleAddEvent = async (e) => {
    e.preventDefault();
    setIsAddingEvent(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const fullLocation = newEventData.coach ? `${newEventData.location} | Coach: ${newEventData.coach}` : newEventData.location;
      const capacityVal = newEventData.type === '1-on-1' ? 1 : parseInt(newEventData.capacity);

      const baseDate = new Date(newEventData.date);
      const sessionsToInsert = [];

      const baseSession = {
        trainer_id: user.id,
        title: newEventData.title,
        time: newEventData.time,
        duration: newEventData.duration,
        type: newEventData.type,
        location: fullLocation,
        capacity: capacityVal
      };

      // Push initial instance
      sessionsToInsert.push({
        ...baseSession,
        date: newEventData.date
      });

      if (newEventData.recurrence && newEventData.recurrence !== 'none') {
        let currentDate = new Date(baseDate);

        if (newEventData.recurrence === 'custom') {
          const weeksCount = parseInt(newEventData.recurrenceCount) || 1;
          // Cap custom scan to a maximum of 6 weeks to keep performance extremely high
          const safeWeeks = Math.min(6, Math.max(1, weeksCount));
          const selectedDays = newEventData.recurrenceDays || [];

          if (selectedDays.length > 0) {
            const totalDaysToScan = safeWeeks * 7;
            for (let i = 1; i <= totalDaysToScan; i++) {
              currentDate.setDate(currentDate.getDate() + 1);
              const dayIndex = currentDate.getDay();

              if (selectedDays.includes(dayIndex)) {
                const year = currentDate.getFullYear();
                const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                const day = String(currentDate.getDate()).padStart(2, '0');
                const dateString = `${year}-${month}-${day}`;

                sessionsToInsert.push({
                  ...baseSession,
                  date: dateString
                });
              }
            }
          }
        } else {
          const repeatsCount = parseInt(newEventData.recurrenceCount) || 1;
          const safeRepeats = Math.min(20, Math.max(1, repeatsCount));

          for (let i = 1; i <= safeRepeats; i++) {
            if (newEventData.recurrence === 'daily') {
              currentDate.setDate(currentDate.getDate() + 1);
            } else if (newEventData.recurrence === 'weekly') {
              currentDate.setDate(currentDate.getDate() + 7);
            } else if (newEventData.recurrence === 'weekdays') {
              do {
                currentDate.setDate(currentDate.getDate() + 1);
              } while (currentDate.getDay() === 0 || currentDate.getDay() === 6);
            }

            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const dateString = `${year}-${month}-${day}`;

            sessionsToInsert.push({
              ...baseSession,
              date: dateString
            });
          }
        }
      }

      const { data: insertedData, error } = await supabase.from('sessions').insert(sessionsToInsert).select();

      if (error) throw error;

      // Assign clients selected in the modal
      if (insertedData && insertedData.length > 0 && eventAssignedClients && eventAssignedClients.length > 0) {
        const bookingsToInsert = [];
        const clientUpdates = {}; // Track client session balance changes

        insertedData.forEach(session => {
          eventAssignedClients.forEach(clientId => {
            bookingsToInsert.push({
              client_id: clientId,
              session_id: session.id,
              session_date: session.date,
              time_slot: session.time,
              status: 'Booked'
            });

            // Deduct session credits
            const client = clients.find(c => c.id === clientId);
            if (client && !client.unlimited) {
              const creditCost = getClassCreditCost(session.title);
              if (!clientUpdates[clientId]) {
                clientUpdates[clientId] = {
                  remaining: client.remaining_package || 0,
                  used: client.used_sessions || 0
                };
              }
              clientUpdates[clientId].remaining = Math.max(0, clientUpdates[clientId].remaining - creditCost);
              clientUpdates[clientId].used = clientUpdates[clientId].used + creditCost;
            }
          });
        });

        // Insert all bookings in a single query!
        if (bookingsToInsert.length > 0) {
          const { error: bookingsErr } = await supabase.from('bookings').insert(bookingsToInsert);
          if (bookingsErr) console.error("Error inserting pre-assigned client bookings:", bookingsErr);
        }

        // Apply all client package updates in database
        for (const clientId of Object.keys(clientUpdates)) {
          const update = clientUpdates[clientId];
          await supabase.from('clients')
            .update({ remaining_package: update.remaining, used_sessions: update.used })
            .eq('id', clientId);
        }

        // Refresh clients state local list
        setClients(prev => prev.map(c => {
          if (clientUpdates[c.id]) {
            return {
              ...c,
              remaining_package: clientUpdates[c.id].remaining,
              used_sessions: clientUpdates[c.id].used
            };
          }
          return c;
        }));
      }

      // Direct Google Calendar Live Sync push (NEW!)
      if (insertedData && insertedData.length > 0) {
        insertedData.forEach(session => {
          syncToGoogleCalendar('CREATE', session);
        });
      }
      setShowEventModal(false);
      setNewEventData({ 
        title: '', 
        date: '', 
        time: '09:00 AM', 
        duration: '60 min', 
        type: 'Group Class', 
        location: 'Main Floor', 
        capacity: 10, 
        coach: '',
        recurrence: 'none',
        recurrenceCount: 4,
        recurrenceDays: []
      });
      setEventAssignedClients([]);
      setSearchEventClientsQuery('');
      setShowEventClientsDropdown(false);
      fetchSessions();
      alert(`Successfully scheduled ${sessionsToInsert.length} session(s)!`);
    } catch (error) {
      alert("Error adding event: " + error.message);
    } finally {
      setIsAddingEvent(false);
    }
  };

  const handleOpenEditEvent = () => {
    if (!selectedSession) return;
    const locationParts = selectedSession.location ? selectedSession.location.split(' | Coach: ') : [];
    const displayLocation = locationParts[0] || 'Main Floor';
    const displayCoach = locationParts[1] || '';

    setEditEventData({
      id: selectedSession.id,
      title: selectedSession.title || '',
      date: selectedSession.date || '',
      time: selectedSession.time || '09:00 AM',
      duration: selectedSession.duration || '60 min',
      type: selectedSession.type || 'Group Class',
      location: displayLocation,
      capacity: selectedSession.capacity || 10,
      coach: displayCoach
    });
    setShowEditEventModal(true);
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    setIsEditingEvent(true);
    try {
      const fullLocation = editEventData.coach ? `${editEventData.location} | Coach: ${editEventData.coach}` : editEventData.location;
      const capacityVal = editEventData.type === '1-on-1' ? 1 : parseInt(editEventData.capacity);

      const { error } = await supabase.from('sessions').update({
        title: editEventData.title,
        date: editEventData.date,
        time: editEventData.time,
        duration: editEventData.duration,
        type: editEventData.type,
        location: fullLocation,
        capacity: capacityVal
      }).eq('id', editEventData.id);

      if (error) throw error;

      // Direct Google Calendar Live Sync update (NEW!)
      syncToGoogleCalendar('UPDATE', {
        id: editEventData.id,
        title: editEventData.title,
        date: editEventData.date,
        time: editEventData.time,
        duration: editEventData.duration,
        type: editEventData.type,
        location: fullLocation,
        capacity: capacityVal
      });

      // Update local state
      const updatedSession = {
        ...selectedSession,
        title: editEventData.title,
        date: editEventData.date,
        time: editEventData.time,
        duration: editEventData.duration,
        type: editEventData.type,
        location: fullLocation,
        capacity: capacityVal
      };

      setSessions(prev => prev.map(s => s.id === editEventData.id ? updatedSession : s));
      setSelectedSession(updatedSession);
      setShowEditEventModal(false);
      alert("Event updated successfully!");
    } catch (error) {
      alert("Error updating event: " + error.message);
    } finally {
      setIsEditingEvent(false);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSettingsForm(prev => ({ ...prev, company_logo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // --- SCHEDULING SETTINGS CRUD HANDLERS ---
  const handleAddCoachSetting = () => {
    if (!newCoachName.trim()) return;
    if (scheduleSettings.coaches.includes(newCoachName.trim())) return;
    setScheduleSettings(prev => ({
      ...prev,
      coaches: [...prev.coaches, newCoachName.trim()]
    }));
    setNewCoachName('');
  };

  const handleRemoveCoachSetting = (coach) => {
    setScheduleSettings(prev => ({
      ...prev,
      coaches: prev.coaches.filter(c => c !== coach)
    }));
  };

  const handleAddLocationSetting = () => {
    if (!newLocationName.trim()) return;
    if (scheduleSettings.locations.includes(newLocationName.trim())) return;
    setScheduleSettings(prev => ({
      ...prev,
      locations: [...prev.locations, newLocationName.trim()]
    }));
    setNewLocationName('');
  };

  const handleRemoveLocationSetting = (loc) => {
    setScheduleSettings(prev => ({
      ...prev,
      locations: prev.locations.filter(l => l !== loc)
    }));
  };

  const handleAddClassSetting = () => {
    if (!newClassName.trim()) return;
    if (scheduleSettings.classes.some(c => c.name.toLowerCase() === newClassName.trim().toLowerCase())) return;
    setScheduleSettings(prev => ({
      ...prev,
      classes: [...prev.classes, { name: newClassName.trim(), credits: parseInt(newClassCredits) || 1 }]
    }));
    setNewClassName('');
    setNewClassCredits(1);
  };

  const handleRemoveClassSetting = (className) => {
    setScheduleSettings(prev => ({
      ...prev,
      classes: prev.classes.filter(c => c.name !== className)
    }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsMessage(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const updatedFields = {
        full_name: settingsForm.full_name,
        company_name: settingsForm.company_name,
        company_address: settingsForm.company_address,
        company_phone: settingsForm.company_phone,
        company_email: settingsForm.company_email,
        company_logo: settingsForm.company_logo,
        bank_name: settingsForm.bank_name,
        bank_account_name: settingsForm.bank_account_name,
        bank_account_number: settingsForm.bank_account_number,
        updated_at: new Date()
      };
      
      const { error } = await supabase.from('profiles')
        .update(updatedFields)
        .eq('id', user.id);
        
      if (error) throw error;

      // Sync the schedule settings to Supabase
      if (settingsClientId) {
        const serialized = serializeNotesAndMetadata('', { checklist: [], status: 'Settings' }, scheduleSettings);
        const { error: settingsErr } = await supabase
          .from('clients')
          .update({ notes: serialized })
          .eq('id', settingsClientId);
        if (settingsErr) console.error("Error updating system settings client:", settingsErr);
      }
      
      setTrainerName(settingsForm.full_name);
      setCompanyName(settingsForm.company_name);
      setCompanyLogo(settingsForm.company_logo);
      setTrainerProfile({
        id: user.id,
        ...updatedFields
      });
      
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
      
      const clientAddress = newClientData.address || '';
      const notesWithAddress = serializeNotesAndMetadata('', { checklist: [false, false, false, false], status: 'Pending' }, {}, clientAddress);

      const { error } = await supabase
        .from('clients')
        .insert([{
            trainer_id: user.id,
            name: newClientData.name,
            email: newClientData.email,
            phone: newClientData.phone,
            dob: newClientData.dob || null,
            notes: notesWithAddress,
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
      setNewClientData({ name: '', email: '', phone: '', dob: '', address: '', package: '', expiry_date: '', unlimited: false, client_type: 'Group', member_status: 'Member', initial_package: '', remaining_package: '', date_paid: '' });
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
              const packageType = row['Package Type'] || row['Package'] || '';
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
    const parsed = parseNotesAndMetadata(selectedClient.notes);
    const notesToSave = serializeNotesAndMetadata(clientNotes, parsed.trialMeta, parsed.sessionNotes, parsed.address, parsed.workoutLogs);

    const { error } = await supabase.from('clients').update({ notes: notesToSave }).eq('id', selectedClient.id);
    setIsSavingNotes(false);
    if (error) {
      alert("Error saving notes: " + error.message);
    } else {
      setSelectedClient({ ...selectedClient, notes: notesToSave });
      setClients(clients.map(c => c.id === selectedClient.id ? { ...c, notes: notesToSave } : c));
      setNotesSavedMsg(true);
      setTimeout(() => setNotesSavedMsg(false), 2000);
    }
  };

  const handleCreateWorkoutLog = () => {
    const today = new Date();
    const dayStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    const newLog = {
      id: 'log_' + Date.now(),
      title: 'Workout Log',
      date: dayStr,
      content: ''
    };
    
    const updated = [newLog, ...workoutLogs];
    setWorkoutLogs(updated);
    setActiveWorkoutLogId(newLog.id);
  };

  const handleUpdateActiveWorkoutLog = (field, value) => {
    setWorkoutLogs(prev => prev.map(log => {
      if (log.id === activeWorkoutLogId) {
        return { ...log, [field]: value };
      }
      return log;
    }));
  };

  const handleDeleteWorkoutLog = (id) => {
    if (!window.confirm("Are you sure you want to delete this workout log?")) return;
    const updated = workoutLogs.filter(log => log.id !== id);
    setWorkoutLogs(updated);
    if (activeWorkoutLogId === id) {
      setActiveWorkoutLogId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const handleSaveWorkoutLogs = async () => {
    if (!selectedClient) return;
    setIsSavingWorkoutLogs(true);
    const parsed = parseNotesAndMetadata(selectedClient.notes);
    const notesToSave = serializeNotesAndMetadata(
      clientNotes, 
      parsed.trialMeta, 
      parsed.sessionNotes, 
      parsed.address, 
      workoutLogs
    );

    const { error } = await supabase.from('clients').update({ notes: notesToSave }).eq('id', selectedClient.id);
    setIsSavingWorkoutLogs(false);
    if (error) {
      alert("Error saving workout logs: " + error.message);
    } else {
      setSelectedClient({ ...selectedClient, notes: notesToSave });
      setClients(clients.map(c => c.id === selectedClient.id ? { ...c, notes: notesToSave } : c));
      setWorkoutLogsSavedMsg(true);
      setTimeout(() => setWorkoutLogsSavedMsg(false), 2000);
    }
  };

  const handleSyncSessionWorkout = async () => {
    if (!selectedSession) return;
    setIsSyncingSessionWorkout(true);
    setSessionWorkoutSyncMsg('');
    try {
      // 1. Save draft to localStorage
      localStorage.setItem('session_workout_' + selectedSession.id, sessionWorkoutContent);

      // 2. Filter attended attendees
      const attendedAttendees = (selectedSession.attendees || []).filter(
        (a) => a.status === 'Attended'
      );

      if (attendedAttendees.length === 0) {
        alert("No students in the roster are marked as 'Attended'. Please mark attendance first.");
        setIsSyncingSessionWorkout(false);
        return;
      }

      // 3. Sync to each attended student
      let syncedCount = 0;
      for (const attendee of attendedAttendees) {
        // Find the client in our active clients list
        const client = clients.find(c => c.id === attendee.client_id);
        if (!client) continue;

        // Parse their current notes and metadata
        const parsed = parseNotesAndMetadata(client.notes || '');
        let updatedLogs = [...(parsed.workoutLogs || [])];

        // Check if a workout log for this session date & title already exists
        const existingLogIndex = updatedLogs.findIndex(
          (log) => log.date === sessionWorkoutDate && log.title === sessionWorkoutTitle
        );

        if (existingLogIndex > -1) {
          // Update existing log content
          updatedLogs[existingLogIndex] = {
            ...updatedLogs[existingLogIndex],
            content: sessionWorkoutContent
          };
        } else {
          // Prepend new log
          const newLog = {
            id: `session_log_${selectedSession.id}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
            title: sessionWorkoutTitle,
            date: sessionWorkoutDate,
            content: sessionWorkoutContent
          };
          updatedLogs = [newLog, ...updatedLogs];
        }

        // Serialize updated metadata back to notes string
        const notesToSave = serializeNotesAndMetadata(
          parsed.notes,
          parsed.trialMeta,
          parsed.sessionNotes,
          parsed.address,
          updatedLogs
        );

        // Update database
        const { error } = await supabase
          .from('clients')
          .update({ notes: notesToSave })
          .eq('id', client.id);

        if (error) throw error;

        // Update local component state
        setClients(prevClients => 
          prevClients.map(c => c.id === client.id ? { ...c, notes: notesToSave } : c)
        );

        // If this attended client is currently selected in the Client Detail view, reflect it immediately
        if (selectedClient && selectedClient.id === client.id) {
          setWorkoutLogs(updatedLogs);
          setSelectedClient(prev => ({ ...prev, notes: notesToSave }));
          if (updatedLogs.length > 0) {
            setActiveWorkoutLogId(updatedLogs[0].id);
          }
        }

        syncedCount++;
      }

      setSessionWorkoutSyncMsg(`Synced successfully with ${syncedCount} attended student(s)!`);
      setTimeout(() => setSessionWorkoutSyncMsg(''), 4000);
    } catch (err) {
      console.error("Error syncing session workout log:", err);
      alert("Failed to sync workout log: " + err.message);
    } finally {
      setIsSyncingSessionWorkout(false);
    }
  };

  const handleSaveTrialMeta = async (newMeta) => {
    setTrialMeta(newMeta);
    const parsed = parseNotesAndMetadata(selectedClient.notes);
    const notesToSave = serializeNotesAndMetadata(clientNotes, newMeta, parsed.sessionNotes, parsed.address, parsed.workoutLogs);
    
    const updatedClient = { ...selectedClient, notes: notesToSave };
    setSelectedClient(updatedClient);
    setClients(clients.map(c => c.id === selectedClient.id ? updatedClient : c));
    
    const { error } = await supabase
      .from('clients')
      .update({ notes: notesToSave })
      .eq('id', selectedClient.id);
      
    if (error) {
      console.error("Error saving trial metadata: ", error.message);
    }
  };

  const handleConvertToMember = async (client) => {
    const confirmConvert = window.confirm(`Are you sure you want to convert ${client.name} to a Full Member?`);
    if (!confirmConvert) return;
    
    try {
      const { error } = await supabase
        .from('clients')
        .update({ member_status: 'Member' })
        .eq('id', client.id);
        
      if (error) throw error;
      
      const updatedClient = { ...client, member_status: 'Member' };
      setSelectedClient(updatedClient);
      setClients(clients.map(c => c.id === client.id ? updatedClient : c));
      
      alert(`🎉 ${client.name} is now a Full Member! Let's set up their package.`);
      
      const defaultPkg = packagesList[0];
      setRenewForm({
        packageId: defaultPkg?.id || '',
        renewalDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        amount: defaultPkg?.price || 0,
        sessions: defaultPkg?.session_count || 0
      });
      setShowRenewModal(true);
    } catch (err) {
      alert("Error converting client to member: " + err.message);
    }
  };

  const handleToggleFollowUp = async (client) => {
    const isCurrentlyFollowUp = client.member_status === 'Follow Up';
    const nextStatus = isCurrentlyFollowUp ? 'Member' : 'Follow Up';
    
    try {
      const { error } = await supabase
        .from('clients')
        .update({ member_status: nextStatus })
        .eq('id', client.id);
        
      if (error) throw error;
      
      const updatedClient = { ...client, member_status: nextStatus };
      setSelectedClient(updatedClient);
      setClients(clients.map(c => c.id === client.id ? updatedClient : c));
      
      alert(isCurrentlyFollowUp ? `Removed ${client.name} from Follow Up.` : `Moved ${client.name} to Follow Up!`);
    } catch (err) {
      alert("Error moving client to Follow Up: " + err.message);
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
      
      if (selectedSession) {
        const updated = formattedSessions.find(s => s.id === selectedSession.id);
        if (updated) {
          setSelectedSession(updated);
        } else {
          setSelectedSession(formattedSessions[0] || null);
        }
      } else if (formattedSessions.length > 0) {
        setSelectedSession(formattedSessions[0]);
      }
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

      const sanitizedForm = { ...editClientForm };
      if (sanitizedForm.dob === '') sanitizedForm.dob = null;
      if (sanitizedForm.expiry === '') sanitizedForm.expiry = null;
      if (sanitizedForm.date_paid === '') sanitizedForm.date_paid = null;

      // Extract address and serialize it to the notes field
      const clientAddress = sanitizedForm.address || '';
      delete sanitizedForm.address; // Prevent PostgREST column missing error

      const parsedNotes = parseNotesAndMetadata(selectedClient.notes);
      const updatedNotes = serializeNotesAndMetadata(parsedNotes.notes, parsedNotes.trialMeta, parsedNotes.sessionNotes, clientAddress, parsedNotes.workoutLogs);
      sanitizedForm.notes = updatedNotes;

      const { error } = await supabase.from('clients').update(sanitizedForm).eq('id', selectedClient.id);
      if (error) throw error;
      
      if (sessionsChanged) {
        const { data: { user } } = await supabase.auth.getUser();
        await supabase.from('transactions').insert([{
          trainer_id: user?.id,
          client_name: selectedClient.id,
          amount: 0,
          description: `Profile Update: Adjusted sessions to ${sanitizedForm.remaining_package}/${sanitizedForm.initial_package}`,
          is_backlog: true,
          created_at: new Date().toISOString()
        }]);
      }

      // Instantly update the UI without reloading
      const updatedClient = { ...selectedClient, ...sanitizedForm, address: clientAddress };
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
      
      // Direct Google Calendar Live Sync delete (NEW!)
      syncToGoogleCalendar('DELETE', { id: id });
      
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

  const handleAssignClient = async (clientId) => {
    if (!selectedSession) return;
    
    const alreadyBooked = selectedSession.attendees.some(a => a.client_id === clientId);
    if (alreadyBooked) {
      alert("This client is already booked in this session!");
      return;
    }

    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    try {
      const { data, error } = await supabase.from('bookings').insert([{
        client_id: clientId,
        session_id: selectedSession.id,
        session_date: selectedSession.date,
        time_slot: selectedSession.time,
        status: 'Booked'
      }]).select('id');

      if (error) throw error;

      let updatedClient = { ...client };
      if (!client.unlimited) {
        const creditCost = getClassCreditCost(selectedSession.title);
        const newRemaining = Math.max(0, (client.remaining_package || 0) - creditCost);
        const newUsed = (client.used_sessions || 0) + creditCost;
        
        const { error: clientErr } = await supabase.from('clients')
          .update({ remaining_package: newRemaining, used_sessions: newUsed })
          .eq('id', clientId);
          
        if (clientErr) console.error("Error updating client sessions remaining:", clientErr);
        
        updatedClient.remaining_package = newRemaining;
        updatedClient.used_sessions = newUsed;
        
        setClients(prev => prev.map(c => c.id === clientId ? updatedClient : c));
      }

      const newBookingId = data[0].id;
      const newAttendee = {
        booking_id: newBookingId,
        client_id: clientId,
        name: client.name,
        status: 'Booked'
      };

      const updatedAttendees = [...(selectedSession.attendees || []), newAttendee];
      const updatedSessions = sessions.map(s => {
        if (s.id === selectedSession.id) {
          return { ...s, attendees: updatedAttendees };
        }
        return s;
      });

      setSessions(updatedSessions);
      setSelectedSession({ ...selectedSession, attendees: updatedAttendees });
      
      // Update Google Calendar so the event title shows the newly assigned client
      syncToGoogleCalendar('UPDATE', {
        ...selectedSession,
        attendees: updatedAttendees
      });

      alert(`${client.name} has been successfully assigned to ${selectedSession.title}!`);
    } catch (err) {
      alert("Error assigning client: " + err.message);
    }
  };

  const handleRemoveStudent = async (bookingId, clientId) => {
    if (!window.confirm("Are you sure you want to remove this student from the class roster? If they are on a session package, their session count will be refunded.")) return;

    try {
      const { error } = await supabase.from('bookings').delete().eq('id', bookingId);
      if (error) throw error;

      // Delete any transactions related to this class attendance or check-in to keep history clean
      if (selectedSession && selectedSession.title) {
        await supabase.from('transactions')
          .delete()
          .eq('client_name', clientId)
          .ilike('description', `%${selectedSession.title}%`);
      }

      const client = clients.find(c => c.id === clientId);
      if (client && !client.unlimited) {
        const creditCost = getClassCreditCost(selectedSession.title);
        const newRemaining = (client.remaining_package || 0) + creditCost;
        const newUsed = Math.max(0, (client.used_sessions || 0) - creditCost);

        const { error: clientErr } = await supabase.from('clients')
          .update({ remaining_package: newRemaining, used_sessions: newUsed })
          .eq('id', clientId);

        if (clientErr) console.error("Error refunding client session:", clientErr);

        const updatedClient = {
          ...client,
          remaining_package: newRemaining,
          used_sessions: newUsed
        };

        setClients(prev => prev.map(c => c.id === clientId ? updatedClient : c));
      }

      const updatedAttendees = (selectedSession.attendees || []).filter(a => a.booking_id !== bookingId);
      const updatedSessions = sessions.map(s => {
        if (s.id === selectedSession.id) {
          return { ...s, attendees: updatedAttendees };
        }
        return s;
      });

      setSessions(updatedSessions);
      setSelectedSession({ ...selectedSession, attendees: updatedAttendees });

      // Update Google Calendar so the event title updates to remove the client name
      syncToGoogleCalendar('UPDATE', {
        ...selectedSession,
        attendees: updatedAttendees
      });

      alert("Student removed successfully and session package refunded (if applicable).");
    } catch (err) {
      alert("Error removing student: " + err.message);
    }
  };

  const handleAssignMultipleClients = async () => {
    if (!selectedSession || selectedStudentIds.length === 0) return;

    try {
      const successfulAssignments = [];
      const updatedClients = [...clients];

      for (const clientId of selectedStudentIds) {
        // Skip if already booked
        const alreadyBooked = selectedSession.attendees.some(a => a.client_id === clientId);
        if (alreadyBooked) continue;

        const client = updatedClients.find(c => c.id === clientId);
        if (!client) continue;

        const { data, error } = await supabase.from('bookings').insert([{
          client_id: clientId,
          session_id: selectedSession.id,
          session_date: selectedSession.date,
          time_slot: selectedSession.time,
          status: 'Booked'
        }]).select('id');

        if (error) {
          console.error(`Error booking client ${client.name}:`, error);
          continue;
        }

        // Deduct session if not unlimited
        if (!client.unlimited) {
          const creditCost = getClassCreditCost(selectedSession.title);
          const newRemaining = Math.max(0, (client.remaining_package || 0) - creditCost);
          const newUsed = (client.used_sessions || 0) + creditCost;

          const { error: clientErr } = await supabase.from('clients')
            .update({ remaining_package: newRemaining, used_sessions: newUsed })
            .eq('id', clientId);

          if (clientErr) console.error("Error updating client sessions remaining:", clientErr);

          client.remaining_package = newRemaining;
          client.used_sessions = newUsed;
        }

        const newBookingId = data[0].id;
        successfulAssignments.push({
          booking_id: newBookingId,
          client_id: clientId,
          name: client.name,
          status: 'Booked'
        });
      }

      if (successfulAssignments.length > 0) {
        setClients(updatedClients);

        const updatedAttendees = [...(selectedSession.attendees || []), ...successfulAssignments];
        const updatedSessions = sessions.map(s => {
          if (s.id === selectedSession.id) {
            return { ...s, attendees: updatedAttendees };
          }
          return s;
        });

        setSessions(updatedSessions);
        setSelectedSession({ ...selectedSession, attendees: updatedAttendees });
        
        // Update Google Calendar so the event title shows the newly assigned client(s)
        syncToGoogleCalendar('UPDATE', {
          ...selectedSession,
          attendees: updatedAttendees
        });

        alert(`Successfully assigned ${successfulAssignments.length} student(s) to ${selectedSession.title}!`);
      }

      setSelectedStudentIds([]);
      setShowStudentDropdown(false);
    } catch (err) {
      alert("Error assigning students: " + err.message);
    }
  };

  const handleMoveClientSubmit = async (e) => {
    e.preventDefault();
    if (!movingAttendee || !moveTargetSessionId) return;

    const targetSession = sessions.find(s => s.id === moveTargetSessionId);
    if (!targetSession) return;

    if (targetSession.attendees && targetSession.attendees.length >= targetSession.capacity) {
      alert("Target session capacity has been reached!");
      return;
    }

    const alreadyBooked = targetSession.attendees?.some(a => a.client_id === movingAttendee.client_id);
    if (alreadyBooked) {
      alert(`${movingAttendee.name} is already booked in the target session.`);
      return;
    }

    try {
      // 1. Update the booking in Supabase
      const { error: bookingErr } = await supabase
        .from('bookings')
        .update({ 
          session_id: targetSession.id, 
          session_date: targetSession.date, 
          time_slot: targetSession.time 
        })
        .eq('id', movingAttendee.booking_id);

      if (bookingErr) throw bookingErr;

      // 2. Delete any transactions related to old session check-in to keep history clean
      if (selectedSession && selectedSession.title) {
        await supabase.from('transactions')
          .delete()
          .eq('client_name', movingAttendee.client_id)
          .ilike('description', `%${selectedSession.title}%`);
      }

      // 3. Handle credit refund & charge
      const oldCost = getClassCreditCost(selectedSession.title);
      const newCost = getClassCreditCost(targetSession.title);
      const costDiff = newCost - oldCost;

      const client = clients.find(c => c.id === movingAttendee.client_id);
      if (client && !client.unlimited && costDiff !== 0) {
        const newRemaining = Math.max(0, (client.remaining_package || 0) - costDiff);
        const newUsed = Math.max(0, (client.used_sessions || 0) + costDiff);

        const { error: clientErr } = await supabase.from('clients')
          .update({ remaining_package: newRemaining, used_sessions: newUsed })
          .eq('id', client.id);

        if (clientErr) console.error("Error updating client credits during move:", clientErr);

        const updatedClient = {
          ...client,
          remaining_package: newRemaining,
          used_sessions: newUsed
        };

        setClients(prev => prev.map(c => c.id === client.id ? updatedClient : c));
      }

      // 4. Update local React states
      const updatedCurrentAttendees = (selectedSession.attendees || []).filter(a => a.booking_id !== movingAttendee.booking_id);
      const movedAttendee = {
        ...movingAttendee,
        status: 'Booked'
      };
      const updatedTargetAttendees = [...(targetSession.attendees || []), movedAttendee];

      const updatedSessions = sessions.map(s => {
        if (s.id === selectedSession.id) {
          return { ...s, attendees: updatedCurrentAttendees };
        }
        if (s.id === targetSession.id) {
          return { ...s, attendees: updatedTargetAttendees };
        }
        return s;
      });

      setSessions(updatedSessions);
      setSelectedSession({ ...selectedSession, attendees: updatedCurrentAttendees });

      // Update Google Calendar for both events
      syncToGoogleCalendar('UPDATE', {
        ...selectedSession,
        attendees: updatedCurrentAttendees
      });
      syncToGoogleCalendar('UPDATE', {
        ...targetSession,
        attendees: updatedTargetAttendees
      });

      setShowMoveModal(false);
      setMovingAttendee(null);
      setMoveTargetSessionId('');

      alert(`Successfully moved ${movingAttendee.name} to ${targetSession.title} (${targetSession.time}) on ${targetSession.date}.`);
    } catch (err) {
      alert("Error moving client: " + err.message);
    }
  };

  const handleOpenSessionNote = (bookingId, classTitle, currentNote) => {
    setEditingSessionNoteBookingId(bookingId);
    setEditingSessionNoteTitle(classTitle);
    setSessionNoteText(currentNote || '');
    setShowSessionNoteModal(true);
  };

  const handleSaveSessionNote = async () => {
    if (!selectedClient || !editingSessionNoteBookingId) return;
    setIsSavingSessionNote(true);

    try {
      const parsed = parseNotesAndMetadata(selectedClient.notes);
      const updatedSessionNotes = {
        ...parsed.sessionNotes,
        [editingSessionNoteBookingId]: sessionNoteText
      };

      // Remove key if empty note
      if (!sessionNoteText.trim()) {
        delete updatedSessionNotes[editingSessionNoteBookingId];
      }

      const notesToSave = serializeNotesAndMetadata(parsed.notes, parsed.trialMeta, updatedSessionNotes, parsed.address, parsed.workoutLogs);

      const { error } = await supabase
        .from('clients')
        .update({ notes: notesToSave })
        .eq('id', selectedClient.id);

      if (error) throw error;

      const updatedClient = { ...selectedClient, notes: notesToSave };
      setSelectedClient(updatedClient);
      setClients(clients.map(c => c.id === selectedClient.id ? updatedClient : c));
      
      setShowSessionNoteModal(false);
      setEditingSessionNoteBookingId(null);
      alert("Session note saved successfully!");
    } catch (err) {
      alert("Error saving session note: " + err.message);
    } finally {
      setIsSavingSessionNote(false);
    }
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

    const queryToUse = clientSearchQuery || searchQuery;
    if (queryToUse) {
      const q = queryToUse.toLowerCase();
      const matchesSearch = 
        (c.name || '').toLowerCase().includes(q) || 
        (c.email || '').toLowerCase().includes(q) ||
        (c.phone || '').toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }
    
    if (activeTab === 'Trial Clients') {
      return c.member_status === 'Trial';
    }

    if (activeTab === 'Follow Up') {
      return c.member_status === 'Follow Up';
    }

    if (activeTab !== 'All Clients' && !searchQuery && !clientSearchQuery && (c.member_status === 'Trial' || c.member_status === 'Follow Up')) {
      return false;
    }
    
    if (activeTab === 'All Clients' || searchQuery || clientSearchQuery) return true;
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

  // --- ATTENDANCE SUMMARY MODAL HANDLERS ---
  const handleOpenAttendanceSummaryModal = () => {
    if (!selectedSession) return;
    
    const summaryList = (selectedSession.attendees || []).map(attendee => {
      const client = clients.find(c => c.id === attendee.client_id);
      return {
        booking_id: attendee.booking_id,
        client_id: attendee.client_id,
        name: attendee.name || attendee.client_name || 'Client',
        status: attendee.status || 'Booked',
        package: client?.package || 'No Package',
        remaining_package: client ? parseInt(client.remaining_package) || 0 : 0,
        expiry: client?.expiry || '',
        unlimited: client?.unlimited || false
      };
    });
    
    setAttendanceSummaryList(summaryList);
    setShowAttendanceSummaryModal(true);
  };

  const handleSaveAttendanceSummary = async () => {
    setIsSavingAttendanceSummary(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Perform batch updates
      for (const item of attendanceSummaryList) {
        // Update booking status
        await supabase.from('bookings').update({ status: item.status }).eq('id', item.booking_id);
        
        // Find existing client to check if remaining credits changed
        const existingClient = clients.find(c => c.id === item.client_id);
        if (existingClient) {
          const creditsChanged = existingClient.remaining_package !== item.remaining_package || existingClient.expiry !== item.expiry;
          
          await supabase.from('clients').update({
            remaining_package: item.remaining_package,
            expiry: item.expiry || null
          }).eq('id', item.client_id);

          // Log transaction if they were marked as Attended or credits were amended
          if (item.status === 'Attended' || creditsChanged) {
            // First, delete any old duplicate transaction for this session to keep history perfectly clean
            await supabase.from('transactions')
              .delete()
              .eq('client_name', item.client_id)
              .ilike('description', `%${selectedSession.title}%`);

            let desc = `Roster Attendance confirmed for ${selectedSession.title}`;
            if (creditsChanged) {
              desc += ` (Amended balance: ${item.remaining_package} credits)`;
            }
            let transactionTime = new Date().toISOString();
            if (selectedSession && selectedSession.start_time) {
              transactionTime = new Date(selectedSession.start_time).toISOString();
            }
            await supabase.from('transactions').insert([{
              trainer_id: user?.id,
              client_name: item.client_id,
              amount: 0,
              description: desc,
              is_backlog: true,
              created_at: transactionTime
            }]);
          } else {
            // If they are not marked as Attended (and credits not amended), delete any previously logged transaction for this session
            await supabase.from('transactions')
              .delete()
              .eq('client_name', item.client_id)
              .ilike('description', `%${selectedSession.title}%`);
          }
        }
      }
      
      // Sync local state
      await fetchClients();
      
      // Update selectedSession's attendees inside the session state
      const updatedAttendees = selectedSession.attendees.map(a => {
        const match = attendanceSummaryList.find(item => item.booking_id === a.booking_id);
        return match ? { ...a, status: match.status } : a;
      });

      const updatedSessions = sessions.map(s => {
        if (s.id === selectedSession.id) {
          return { ...s, attendees: updatedAttendees };
        }
        return s;
      });
      setSessions(updatedSessions);
      setSelectedSession({ ...selectedSession, attendees: updatedAttendees });
      
      // Update Google Calendar with latest attendee status details
      syncToGoogleCalendar('UPDATE', {
        ...selectedSession,
        attendees: updatedAttendees
      });

      setShowAttendanceSummaryModal(false);
      alert("Attendance and credit adjustments confirmed successfully!");
    } catch (err) {
      alert("Error confirming attendance summary: " + err.message);
    } finally {
      setIsSavingAttendanceSummary(false);
    }
  };

  // --- CLASS MODE HANDLERS ---
  const handleConfirmClassCheckIn = async () => {
    if (!selectedClassClient) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const client = selectedClassClient;
      
      let descriptionStr = `Class Mode Check-in`;
      let bookingId = null;
      let cost = 1;
      
      if (selectedClassSession) {
        descriptionStr = `Class Mode Check-in for ${selectedClassSession.title}`;
        cost = getClassCreditCost(selectedClassSession.title);
        
        // Create the booking record
        const { data: bookingData, error: bookingErr } = await supabase
          .from('bookings')
          .insert([{
            client_id: client.id,
            session_id: selectedClassSession.id,
            status: 'Attended'
          }])
          .select('*')
          .single();
          
        if (bookingErr) throw bookingErr;
        bookingId = bookingData?.id;
      }
      
      const { data: transData, error: transError } = await supabase.from('transactions').insert([{
        trainer_id: user?.id,
        client_name: client.id,
        amount: 0,
        description: descriptionStr,
        is_backlog: false,
        created_at: new Date().toISOString()
      }]).select('*').single();
      
      if (transError) throw transError;
      
      let newRemaining = client.remaining_package;
      if (!client.unlimited) {
         newRemaining = Math.max(0, (client.remaining_package || 0) - cost);
         await supabase.from('clients').update({ remaining_package: newRemaining }).eq('id', client.id);
      }
      
      setUndoTargetTransactionId(transData?.id);
      setUndoTargetBookingId(bookingId);
      setUndoTargetClient({ ...client, remaining_package: newRemaining });
      
      const updatedClient = { ...client, remaining_package: newRemaining };
      setClients(clients.map(c => c.id === client.id ? updatedClient : c));
      
      // Sync local session data to update rosters instantly in dashboard
      await fetchSessions();
      
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
      
      if (undoTargetBookingId) {
        await supabase.from('bookings').delete().eq('id', undoTargetBookingId);
      }
      
      if (undoTargetClient && !undoTargetClient.unlimited) {
        // Retrieve cost of the class that was undoed
        let cost = 1;
        if (selectedClassSession) {
          cost = getClassCreditCost(selectedClassSession.title);
        }
        const revertedRemaining = (undoTargetClient.remaining_package || 0) + cost;
        await supabase.from('clients').update({ remaining_package: revertedRemaining }).eq('id', undoTargetClient.id);
        const updatedClient = { ...undoTargetClient, remaining_package: revertedRemaining };
        setClients(clients.map(c => c.id === undoTargetClient.id ? updatedClient : c));
      }
      
      await fetchSessions();
      
      setShowUndoPinModal(false);
      setShowSuccessModal(false);
      setPinInput('');
      setUndoTargetTransactionId(null);
      setUndoTargetBookingId(null);
      setUndoTargetClient(null);
      alert("Check-in reversed successfully.");
    } catch (err) {
      alert("Error undoing check-in: " + err.message);
    }
  };

  const handleSendMessage = async (customPrompt = null) => {
    const promptToSend = customPrompt || aiMessage;
    if (!promptToSend.trim()) return;
    
    const userMsg = { role: 'user', content: promptToSend };
    setAiChatHistory(prev => [...prev, userMsg]);
    if (!customPrompt) setAiMessage('');
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
          message: promptToSend,
          context: context,
          history: aiChatHistory.slice(-5) // Send last 5 messages for history context
        }
      });

      if (error) throw error;
      
      setAiChatHistory(prev => [...prev, { role: 'assistant', content: data.reply }]);
      setIsAiLoading(false);
    } catch (err) {
      console.error("AI Error:", err);
      // Fallback for smart client-side analysis (runs instantly, providing value offline)
      setTimeout(() => {
        const msg = promptToSend.toLowerCase();
        let reply = "";

        // 1. REVENUE / EARNINGS ANALYSIS
        if (msg.includes('revenue') || msg.includes('money') || msg.includes('earning') || msg.includes('sale') || msg.includes('profit') || msg.includes('financial')) {
          const totalEarnings = transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
          const bankTransfer = transactions.filter(t => t.payment_method === 'bank_transfer' || (t.method && t.method.toLowerCase().includes('transfer')));
          const bankTransferTotal = bankTransfer.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
          
          const cash = transactions.filter(t => t.payment_method === 'cash' || (t.method && t.method.toLowerCase().includes('cash')));
          const cashTotal = cash.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
          
          const otherTotal = totalEarnings - bankTransferTotal - cashTotal;
          
          reply = `💵 **Financial Performance Report**\n\n` +
                  `* **Total Revenue**: **RM ${totalEarnings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}**\n` +
                  `* **Total Transactions**: ${transactions.length} payments recorded\n\n` +
                  `💳 **Payment Channel Breakdown:**\n` +
                  `* **Bank Transfer**: RM ${bankTransferTotal.toLocaleString()} (${bankTransfer.length} transactions)\n` +
                  `* **Cash Payments**: RM ${cashTotal.toLocaleString()} (${cash.length} transactions)\n` +
                  `* **Card/Other Channels**: RM ${otherTotal.toLocaleString()} (${transactions.length - bankTransfer.length - cash.length} transactions)\n\n` +
                  `📊 **Business Health Metric**: Average invoice value is **RM ${(transactions.length ? (totalEarnings / transactions.length) : 0).toFixed(2)}** per package purchase.`;
        }
        // 2. LOW REMAINING SESSIONS
        else if (msg.includes('low') || msg.includes('remaining') || msg.includes('expiring soon') || msg.includes('renew') || msg.includes('limit')) {
          const lowSessions = clients.filter(c => {
            const rem = c.remaining_package !== undefined ? c.remaining_package : c.remainingSessions;
            return rem !== undefined && rem <= 3;
          });

          if (lowSessions.length === 0) {
            reply = `✅ **Roster Check**: Excellent news! All your active clients currently have more than 3 sessions remaining on their packages. No urgent renewals needed!`;
          } else {
            reply = `⚠️ **Alert: Clients Nearing Package Expiration**\n\n` +
                    `The following ${lowSessions.length} client(s) have 3 or fewer sessions left and require proactive outreach for package renewals:\n\n` +
                    lowSessions.map(c => {
                      const rem = c.remaining_package !== undefined ? c.remaining_package : c.remainingSessions;
                      return `* 👤 **${c.name}**: **${rem} sessions left** (Expiry: ${c.expiry ? new Date(c.expiry).toLocaleDateString() : 'No Limit'}) • Status: _${getLiveClientStatus(c)}_`;
                    }).join('\n');
          }
        }
        // 3. CLIENT ROSTER STATS
        else if (msg.includes('roster') || msg.includes('client stats') || msg.includes('how many clients') || msg.includes('total clients') || msg.includes('summary')) {
          const activeCount = clients.filter(c => getLiveClientStatus(c) === 'Active').length;
          const expiringCount = clients.filter(c => getLiveClientStatus(c) === 'Expiring Soon').length;
          const inactiveCount = clients.filter(c => getLiveClientStatus(c) === 'Inactive').length;

          reply = `👥 **Interactive Client Roster Analytics**\n\n` +
                  `* **Total Registered**: **${clients.length} clients**\n` +
                  `* **Active Trainees**: **${activeCount} active** (currently booking and training)\n` +
                  `* **Expiring Soon**: **${expiringCount} client(s)** (requiring renewal follow-ups)\n` +
                  `* **Inactive/Completed**: **${inactiveCount} client(s)**\n\n` +
                  `🎯 **Trainer Focus**: Roster utilization is at **${(clients.length ? ((activeCount / clients.length) * 100) : 0).toFixed(0)}%** active status. Your premium target is 80%+ active capacity.`;
        }
        // 4. GROWTH INSIGHTS
        else if (msg.includes('insight') || msg.includes('growth') || msg.includes('advice') || msg.includes('recommend') || msg.includes('strategy')) {
          const activeCount = clients.filter(c => getLiveClientStatus(c) === 'Active').length;
          const lowSessions = clients.filter(c => {
            const rem = c.remaining_package !== undefined ? c.remaining_package : c.remainingSessions;
            return rem !== undefined && rem <= 3;
          });
          
          reply = `💡 **TrackPoint AI Business Growth Insights**\n\n` +
                  `Based on the analysis of your **${clients.length} clients** and financial transaction ledger, here are your personalized growth opportunities:\n\n` +
                  `1. 📞 **Proactive Renewal Campaigns**: You have **${lowSessions.length} clients** with low sessions left. Send them a direct message with their custom portal renewal link to prevent training drop-off.\n` +
                  `2. 📈 **Leverage Payment Trends**: Transfer is your most popular payment channel. Highlight "Instant Bank Transfer" as the preferred payment method on checkout invoices to reduce payment friction.\n` +
                  `3. 👥 **Increase Roster Density**: Your active roster capacity is **${activeCount} clients**. Consider launching a 3-session referral bundle to current active trainees to organically fill open slots.`;
        }
        // 5. CLIENT INDIVIDUAL SEARCH
        else {
          // Look for any client name mentioned in the message
          const matchedClient = clients.find(c => msg.includes(c.name.toLowerCase()) || c.name.toLowerCase().split(' ').some(part => part.length > 2 && msg.includes(part)));
          
          if (matchedClient) {
            const rem = matchedClient.remaining_package !== undefined ? matchedClient.remaining_package : matchedClient.remainingSessions;
            reply = `👤 **AI Client Profile Lookup: ${matchedClient.name}**\n\n` +
                    `* **Current Status**: **${getLiveClientStatus(matchedClient)}**\n` +
                    `* **Remaining Sessions**: **${rem || 0} sessions**\n` +
                    `* **Package Name**: ${matchedClient.packageName || 'Standard Package'}\n` +
                    `* **Package Expiry**: ${matchedClient.expiry ? new Date(matchedClient.expiry).toLocaleDateString() : 'No Limit'}\n` +
                    `* **Trainer Notes**: ${matchedClient.notes || '_No special notes logged._'}\n\n` +
                    `💬 _Tip: Use the "Book Session" command on your sidebar to schedule their next routine training._`;
          } else {
            // General Fallback
            reply = `👋 **Hi! I'm your TrackPoint AI Assistant.**\n\n` +
                    `I'm currently running in high-performance local analysis mode! I can crunch numbers, summarize client profiles, and check your roster in real-time. Try asking me one of these:\n\n` +
                    `* _"How much revenue have I made?"_\n` +
                    `* _"Who has low remaining sessions?"_\n` +
                    `* _"Give me growth insights for my business"_\n` +
                    `* _"Show client profile for Joe"_`;
          }
        }

        setAiChatHistory(prev => [...prev, { role: 'assistant', content: reply }]);
        setIsAiLoading(false);
      }, 800);
    }
  };

  const handleExitPinChange = (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 4);
    setPinInput(cleaned);
    setExitPinError(false);

    if (cleaned.length === 4) {
      if (cleaned === CLASS_PIN) {
        setShowExitPinModal(false);
        setPinInput('');
        setActivePage('Dashboard');
      } else {
        setExitPinError(true);
        setTimeout(() => {
          setPinInput('');
          setExitPinError(false);
        }, 800);
      }
    }
  };

  const handleExitClassMode = () => {
    if (pinInput === CLASS_PIN) {
      setShowExitPinModal(false);
      setPinInput('');
      setActivePage('Dashboard');
    } else {
      setExitPinError(true);
      setTimeout(() => {
        setPinInput('');
        setExitPinError(false);
      }, 800);
    }
  };

  const isMobile = useIsMobile();

  const renderMobileAttendanceLogs = () => {
    if (Object.keys(groupedAttendance).length === 0) {
      return (
        <div className="text-center py-6 text-[#898A8D] font-medium bg-white rounded-2xl border border-gray-100">
          No completed attendance logs found.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {Object.values(groupedAttendance)
          .sort((a, b) => b.year - a.year)
          .map((yearData) => (
            <div key={yearData.year} className="space-y-3">
              {/* Year Header */}
              <div className="border-b border-gray-100 pb-2 mt-2 flex justify-between items-center">
                <span className="font-extrabold text-[#0B4550] flex items-center gap-1 text-xs uppercase tracking-wider">
                  <Calendar size={12} /> {yearData.year}
                </span>
                <span className="text-[10px] font-bold text-[#898A8D] uppercase tracking-wider">
                  {yearData.totalHours.toFixed(1)} hrs ({yearData.totalClasses} classes)
                </span>
              </div>

              {/* Months */}
              {Object.values(yearData.months)
                .sort((a, b) => b.monthIndex - a.monthIndex)
                .map((monthData) => {
                  const monthYearKey = monthData.monthYear;
                  const expanded = expandedMonths[monthYearKey] !== false;

                  return (
                    <div key={monthYearKey} className="space-y-2">
                      {/* Month Trigger */}
                      <div 
                        onClick={() => {
                          setExpandedMonths(prev => ({ ...prev, [monthYearKey]: !expanded }));
                        }}
                        className="flex justify-between items-center bg-[#F9F7F2] px-3.5 py-2.5 rounded-xl border border-gray-100 cursor-pointer active:brightness-95 transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <ChevronRight size={14} className={`text-[#0B4550] transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`} />
                          <span className="font-bold text-[#0B4550] text-xs uppercase tracking-wider">{monthData.monthName}</span>
                        </div>
                        <span className="text-xs font-bold text-[#0B4550]">{monthData.totalHours.toFixed(1)} hrs</span>
                      </div>

                      {/* Dates */}
                      {expanded && (
                        <div className="pl-2.5 space-y-2">
                          {Object.values(monthData.dates)
                            .sort((a, b) => b.timestamp - a.timestamp)
                            .map((dateData) => {
                              const dateKey = `${monthYearKey}-${dateData.date}`;
                              const dateExpanded = expandedDates[dateKey] === true;

                              return (
                                <div key={dateKey} className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-xs">
                                  {/* Date Trigger */}
                                  <div 
                                    onClick={() => {
                                      setExpandedDates(prev => ({ ...prev, [dateKey]: !dateExpanded }));
                                    }}
                                    className="flex justify-between items-center p-3 bg-gray-50/50 cursor-pointer active:bg-gray-100 transition-colors"
                                  >
                                    <span className="font-bold text-xs text-[#0B4550]">{dateData.formattedDate}</span>
                                    <span className="text-[10px] font-bold text-[#898A8D]">{dateData.sessions.length} class(es)</span>
                                  </div>

                                  {/* Sessions list */}
                                  {dateExpanded && (
                                    <div className="p-3 space-y-3 border-t border-gray-100 bg-white">
                                      {dateData.sessions.map((s) => (
                                        <div key={s.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-2.5">
                                          <div className="flex justify-between items-start">
                                            <div>
                                              <span className="font-bold text-sm text-[#0B4550] block">{s.title}</span>
                                              <span className="text-[10px] font-semibold text-[#898A8D] block mt-0.5">{s.time} • {s.duration}</span>
                                            </div>
                                            <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${s.type === '1-on-1' ? 'bg-indigo-50 text-indigo-600' : 'bg-teal-50 text-teal-600'}`}>
                                              {s.type}
                                            </span>
                                          </div>
                                          {s.attended && s.attended.length > 0 && (
                                            <div className="pt-2 border-t border-gray-250/20">
                                              <span className="text-[9px] font-bold text-[#898A8D] uppercase tracking-wider block mb-1">Attended Clients ({s.attended.length})</span>
                                              <div className="flex flex-wrap gap-1">
                                                {s.attended.map(a => (
                                                  <span key={a.client_id} className="inline-flex bg-[#0B4550]/5 text-[#0B4550] px-2 py-0.5 rounded-lg text-[10px] font-bold border border-[#0B4550]/10">
                                                    {a.name}
                                                  </span>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          ))
        }
      </div>
    );
  };

  const renderMobileRosterDrawer = () => {
    if (!selectedSession) return null;
    const attendedCount = selectedSession.attendees ? selectedSession.attendees.length : 0;
    
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-end justify-center" onClick={() => setShowMobileRosterDrawer(false)}>
        <div 
          className="bg-white border-t border-gray-150 rounded-t-[2.5rem] w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative animate-in slide-in-from-bottom duration-300 pb-[calc(2rem+env(safe-area-inset-bottom))]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Handle */}
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
          
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider ${selectedSession.type === '1-on-1' ? 'bg-[#0B4550]/10 text-[#0B4550]' : 'bg-teal-50 text-teal-600'}`}>
                {selectedSession.type}
              </span>
              <h2 className="text-xl font-black text-[#0B4550] mt-2">{getSessionDisplayTitle(selectedSession)}</h2>
              <div className="flex flex-col gap-1 mt-1.5 text-xs text-[#898A8D] font-bold">
                <span className="flex items-center gap-1.5"><Clock size={14} /> {formatDbDate(selectedSession.date)} • {selectedSession.time}</span>
                <span className="flex items-center gap-1.5"><MapPin size={14} /> {selectedSession.location ? selectedSession.location.split(' | Coach: ')[0] : 'Main Floor'}</span>
              </div>
            </div>
            <button 
              onClick={() => setShowMobileRosterDrawer(false)}
              className="p-2.5 bg-[#F9F7F2] rounded-full text-[#898A8D] hover:text-[#0B4550] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {selectedSession.type !== 'Blocked' ? (
            <div className="space-y-6">
              {/* Tabs Header */}
              <div className="flex border-b border-gray-100 gap-6 mb-2">
                <button 
                  type="button"
                  onClick={() => setSessionDetailTab('roster')}
                  className={`pb-3 text-sm font-black transition-all relative ${sessionDetailTab === 'roster' ? 'text-[#0B4550]' : 'text-[#898A8D]'}`}
                >
                  Roster
                  {sessionDetailTab === 'roster' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B4550] rounded-full"></span>}
                </button>
                <button 
                  type="button"
                  onClick={() => setSessionDetailTab('workout')}
                  className={`pb-3 text-sm font-black transition-all relative ${sessionDetailTab === 'workout' ? 'text-[#0B4550]' : 'text-[#898A8D]'}`}
                >
                  Workout Log
                  {sessionDetailTab === 'workout' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B4550] rounded-full"></span>}
                </button>
              </div>

              {sessionDetailTab === 'roster' ? (
                <>
                  {/* Assign Student Dropdown */}
                  <div className="relative">
                    <button 
                      onClick={() => {
                        setShowStudentDropdown(!showStudentDropdown);
                        setSearchStudentQuery('');
                      }}
                      className="w-full bg-[#F9F7F2] border border-gray-150 rounded-2xl px-5 py-4 text-sm text-[#0B4550] font-bold flex justify-between items-center outline-none"
                    >
                      <span>
                        {selectedStudentIds.length === 0 
                          ? 'Book / Assign Students...' 
                          : `${selectedStudentIds.length} student(s) selected`}
                      </span>
                      <ChevronDown size={18} className={`transition-transform duration-200 text-[#0B4550] ${showStudentDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showStudentDropdown && (
                      <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-150 rounded-2xl shadow-xl z-[110] p-4 flex flex-col max-h-64">
                        <div className="relative mb-3 shrink-0">
                          <input 
                            type="text" 
                            placeholder="Search clients..." 
                            value={searchStudentQuery}
                            onChange={(e) => setSearchStudentQuery(e.target.value)}
                            className="w-full bg-[#F9F7F2] border border-gray-150 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold text-[#0B4550] outline-none placeholder-gray-400 focus:border-[#0B4550]"
                          />
                          <Search className="absolute left-3.5 top-3.5 text-[#898A8D]" size={14} />
                        </div>

                        <div className="overflow-y-auto flex-1 space-y-1.5 pr-1">
                          {(() => {
                            const filtered = clients
                              .filter(c => c.status !== 'Archived' && (c.name || '').toLowerCase().includes(searchStudentQuery.toLowerCase()))
                              .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

                            if (filtered.length === 0) {
                              return <p className="text-xs text-[#898A8D] text-center py-4 font-bold">No clients found.</p>;
                            }

                            return filtered.map(c => {
                              const isSelected = selectedStudentIds.includes(c.id);
                              const isAlreadyRostered = selectedSession.attendees?.some(a => a.client_id === c.id);

                              return (
                                <label 
                                  key={c.id} 
                                  className={`flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer ${isAlreadyRostered ? 'opacity-40 cursor-not-allowed bg-[#F9F7F2]' : 'hover:bg-[#F9F7F2]'}`}
                                >
                                  <input 
                                    type="checkbox"
                                    disabled={isAlreadyRostered}
                                    checked={isAlreadyRostered || isSelected}
                                    onChange={() => {
                                      if (isAlreadyRostered) return;
                                      setSelectedStudentIds(prev => 
                                        prev.includes(c.id) ? prev.filter(id => id !== c.id) : [...prev, c.id]
                                      );
                                    }}
                                    className="w-5 h-5 text-[#0B4550] bg-white border-gray-300 rounded focus:ring-[#0B4550] focus:ring-offset-white"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-[#0B4550] truncate">{c.name}</p>
                                    <p className="text-[10px] text-[#898A8D] font-bold uppercase tracking-wider mt-0.5">
                                      {c.unlimited 
                                        ? `Unlimited - Exp: ${formatExpiryDate(c.expiry)}` 
                                        : `${c.remaining_package || 0} left`}
                                    </p>
                                  </div>
                                  {isAlreadyRostered && (
                                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">Booked</span>
                                  )}
                                </label>
                              );
                            });
                          })()}
                        </div>

                        <div className="border-t border-gray-100 pt-3 mt-3 flex gap-3 shrink-0">
                          <button 
                            type="button"
                            onClick={() => {
                              setSelectedStudentIds([]);
                              setShowStudentDropdown(false);
                            }}
                            className="flex-1 py-3 rounded-xl text-xs font-bold text-[#898A8D] bg-[#F9F7F2]"
                          >
                            Cancel
                          </button>
                          <button 
                            type="button"
                            disabled={selectedStudentIds.length === 0}
                            onClick={() => {
                              handleAssignMultipleClients();
                              setShowStudentDropdown(false);
                            }}
                            className="flex-[2] py-3 rounded-xl text-xs font-black text-[#E6FF2B] bg-[#0B4550] disabled:opacity-50 disabled:bg-gray-150 disabled:text-[#898A8D]"
                          >
                            Assign ({selectedStudentIds.length})
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Roster List */}
                  <div>
                    <h3 className="font-bold text-sm text-[#898A8D] uppercase tracking-wider mb-3">Roster ({attendedCount} / {selectedSession.capacity})</h3>

                    {selectedSession.attendees.length === 0 ? (
                      <div className="text-center py-8 bg-[#F9F7F2] rounded-2xl border border-gray-100">
                        <p className="text-sm font-bold text-[#898A8D]">No bookings yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1 no-scrollbar">
                        {selectedSession.attendees.map((attendee) => (
                          <div key={attendee.booking_id} className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F9F7F2] border border-gray-100">
                            <div className="w-10 h-10 rounded-full bg-white text-[#0B4550] border border-gray-150 flex items-center justify-center text-xs font-bold shrink-0">
                              {getInitials(attendee.name)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-bold text-[#0B4550] block truncate">{attendee.name}</span>
                              <span className={`text-[10px] font-black uppercase tracking-widest mt-0.5 block ${attendee.status === 'Attended' ? 'text-emerald-600' : 'text-[#898A8D]'}`}>
                                {attendee.status}
                              </span>
                            </div>
                            
                            <button 
                              onClick={() => toggleAttendance(attendee.booking_id, attendee.status)} 
                              className={`p-3 rounded-xl transition-all ${attendee.status === 'Attended' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-white text-[#898A8D] border border-gray-150'}`}
                            >
                              <CheckSquare size={18} />
                            </button>
                            
                            <button 
                              onClick={() => handleRemoveStudent(attendee.booking_id, attendee.client_id)} 
                              className="p-3 rounded-xl bg-white text-[#898A8D] hover:text-red-500 border border-gray-150 transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Review & Confirm Attendance */}
                  {selectedSession.attendees.length > 0 && (
                    <button 
                      onClick={() => {
                        setShowMobileRosterDrawer(false);
                        handleOpenAttendanceSummaryModal();
                      }}
                      className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg mt-2 active:scale-[0.98] transition-all"
                    >
                      <CheckSquare size={18} /> Review & Confirm Attendance
                    </button>
                  )}
                </>
              ) : (
                <div className="flex flex-col gap-4">
                  <h3 className="font-bold text-sm text-[#898A8D] uppercase tracking-wider">Class Workout Log</h3>
                  <div className="flex flex-col gap-4 bg-[#F9F7F2] p-5 rounded-2xl border border-gray-100">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-[#898A8D] uppercase tracking-wider">Workout Title</label>
                      <input 
                        type="text" 
                        value={sessionWorkoutTitle}
                        onChange={(e) => setSessionWorkoutTitle(e.target.value)}
                        className="w-full bg-white border border-gray-150 rounded-xl px-4 py-3 text-xs font-bold text-[#0B4550] outline-none focus:border-[#0B4550]"
                        placeholder="Workout Title..."
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-[#898A8D] uppercase tracking-wider">Date</label>
                      <input 
                        type="text" 
                        value={sessionWorkoutDate}
                        onChange={(e) => setSessionWorkoutDate(e.target.value)}
                        className="w-full bg-white border border-gray-150 rounded-xl px-4 py-3 text-xs font-bold text-[#0B4550] outline-none focus:border-[#0B4550]"
                        placeholder="Date..."
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-[#898A8D] uppercase tracking-wider">Workout Notes</label>
                      <textarea 
                        value={sessionWorkoutContent}
                        onChange={(e) => setSessionWorkoutContent(e.target.value)}
                        className="w-full h-32 bg-white border border-gray-150 rounded-xl p-4 text-xs font-semibold text-[#0B4550] outline-none resize-none focus:border-[#0B4550]"
                        placeholder="Workouts done today..."
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 mt-2">
                    {sessionWorkoutSyncMsg && (
                      <span className="text-emerald-600 font-bold text-xs flex items-center gap-1.5">
                        <Check size={14}/> {sessionWorkoutSyncMsg}
                      </span>
                    )}
                    <button 
                      onClick={handleSyncSessionWorkout}
                      disabled={isSyncingSessionWorkout}
                      className="w-full bg-[#0B4550] text-[#E6FF2B] py-4 rounded-2xl font-black text-sm hover:scale-[1.01] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                    >
                      {isSyncingSessionWorkout ? <RotateCw className="animate-spin" size={16}/> : <Save size={16}/>}
                      Sync with Attended Clients
                    </button>
                    <p className="text-[10px] text-[#898A8D] font-bold text-center leading-normal px-4">
                      Syncs to workout logs of all check-ins ("Attended").
                    </p>
                  </div>
                </div>
              )}

              {/* Edit / Cancel Class */}
              <div className="flex gap-3 border-t border-gray-100 pt-5 mt-2">
                <button 
                  onClick={() => {
                    setShowMobileRosterDrawer(false);
                    handleOpenEditEvent();
                  }}
                  className="flex-1 py-4 bg-[#F9F7F2] text-[#0B4550] font-black rounded-2xl text-xs flex justify-center items-center gap-2 border border-gray-150"
                >
                  <Edit3 size={16}/> Edit
                </button>
                <button 
                  onClick={() => {
                    handleDeleteSession(selectedSession.id);
                    setShowMobileRosterDrawer(false);
                  }}
                  className="flex-1 py-4 bg-red-50 text-red-500 font-black rounded-2xl text-xs flex justify-center items-center gap-2 border border-red-100"
                >
                  <Trash2 size={16}/> Cancel Class
                </button>
              </div>

            </div>
          ) : (
            <div className="text-center py-10 bg-[#222] rounded-2xl border border-[#333] mt-4">
              <p className="text-sm font-bold text-gray-500">Time block reserved for personal tasks.</p>
            </div>
          )}

        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-[#F9F7F2] font-sans text-[#0B4550] overflow-hidden">
      
      {/* SIDEBAR - Hidden when in ClassMode or on mobile */}
      {activePage !== 'ClassMode' && (
      <aside className="hidden md:flex w-[260px] bg-white h-full flex-col border-r border-gray-100 shrink-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center px-4 md:px-6 py-5 md:py-8">
          <button 
            onClick={() => {
              setActivePage('Dashboard');
              setSelectedClient(null);
            }} 
            className="hover:opacity-70 transition-opacity cursor-pointer focus:outline-none"
          >
            <img 
              src={companyLogo || newLogo} 
              alt={companyName} 
              className="h-20 w-auto object-contain max-h-[80px]" 
              onError={(e) => { e.target.style.display = 'none' }} 
            />
          </button>
        </div>
  
        <nav className="flex-1 px-4 space-y-1 mt-2 overflow-y-auto">
          <NavItem icon={<Home size={28} />} label="Dashboard" isActive={activePage === 'Dashboard'} onClick={() => {setActivePage('Dashboard'); setSelectedClient(null);}} />
          <NavItem icon={<Users size={28} />} label="Clients" isActive={activePage === 'Clients'} onClick={() => { handleNavigateToPage('Clients'); setSelectedClient(null); }} />
          <NavItem icon={<DollarSign size={28} />} label="Revenue" isActive={activePage === 'Revenue'} onClick={() => { handleNavigateToPage('Revenue'); setSelectedClient(null); }} />
          <NavItem icon={<CheckSquare size={28} />} label="Attendance" isActive={activePage === 'Attendance'} onClick={() => { handleNavigateToPage('Attendance'); setSelectedClient(null); }} />
          <NavItem icon={<CalendarSearch size={28} />} label="Schedule" isActive={activePage === 'Schedule'} onClick={() => {setActivePage('Schedule'); setSelectedClient(null);}} />
          <NavItem icon={<Calendar size={28} />} label="Calendar" isActive={activePage === 'Calendar'} onClick={() => { setActivePage('Calendar'); setSelectedClient(null); }} />
          <NavItem icon={<BarChart2 size={28} />} label="Analytics" isActive={activePage === 'Analytics'} onClick={() => handleNavigateToPage('Analytics')} />
          <NavItem icon={<Package size={28} />} label="Packages" isActive={activePage === 'Packages'} onClick={() => setActivePage('Packages')} />
          <NavItem icon={<Monitor size={28} />} label="Class Mode" isActive={activePage === 'ClassMode'} onClick={() => setActivePage('ClassMode')} />
        </nav>
  
        <div className="px-4 pb-6 space-y-1 mt-6">
          <NavItem icon={<Settings size={28} />} label="Settings" isActive={activePage === 'Settings'} onClick={() => setActivePage('Settings')} />
          <NavItem icon={<LogOut size={28} />} label="Log out" onClick={handleLogout} />
        </div>
      </aside>
      )}
  
      {/* MOBILE BOTTOM NAVIGATION - Visible only on small screens, hidden in ClassMode */}
      {activePage !== 'ClassMode' && (
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-150 flex justify-around items-center py-4 px-2 z-[50] pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <button onClick={() => setActivePage('Dashboard')} className={`flex flex-col items-center gap-1 transition-all ${activePage === 'Dashboard' ? 'text-[#0B4550] scale-110' : 'text-[#898A8D] hover:text-[#0B4550]'}`}>
          <Home size={24} strokeWidth={activePage === 'Dashboard' ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button onClick={() => handleNavigateToPage('Clients')} className={`flex flex-col items-center gap-1 transition-all ${activePage === 'Clients' ? 'text-[#0B4550] scale-110' : 'text-[#898A8D] hover:text-[#0B4550]'}`}>
          <Users size={24} strokeWidth={activePage === 'Clients' ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Clients</span>
        </button>
        <button onClick={() => handleNavigateToPage('Revenue')} className={`flex flex-col items-center gap-1 transition-all ${activePage === 'Revenue' ? 'text-[#0B4550] scale-110' : 'text-[#898A8D] hover:text-[#0B4550]'}`}>
          <DollarSign size={24} strokeWidth={activePage === 'Revenue' ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Revenue</span>
        </button>
        <button onClick={() => setActivePage('Schedule')} className={`flex flex-col items-center gap-1 transition-all ${activePage === 'Schedule' ? 'text-[#0B4550] scale-110' : 'text-[#898A8D] hover:text-[#0B4550]'}`}>
          <Calendar size={24} strokeWidth={activePage === 'Schedule' ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Schedule</span>
        </button>
        <button onClick={() => setShowMoreMenu(true)} className={`flex flex-col items-center gap-1 transition-all ${['Calendar', 'Analytics', 'Packages', 'ClassMode', 'Settings', 'Attendance'].includes(activePage) ? 'text-[#0B4550] scale-110' : 'text-[#898A8D] hover:text-[#0B4550]'}`}>
          <LayoutGrid size={24} strokeWidth={['Calendar', 'Analytics', 'Packages', 'ClassMode', 'Settings', 'Attendance'].includes(activePage) ? 2.5 : 2} />
          <span className="text-[10px] font-bold">More</span>
        </button>
      </div>
      )}
  
      {/* MAIN CONTENT AREA */}
      {/* pb-36 ensures content isn't hidden behind the mobile bottom nav */}
      <main className="flex-1 h-full overflow-y-auto p-4 md:p-6 lg:p-8 pb-36 lg:pb-8 relative">

        {/* UNIVERSAL DYNAMIC HEADER - Hidden in ClassMode */}
{activePage !== 'ClassMode' && (
  <>
    {/* MOBILE HEADER */}
    <header className="md:hidden flex items-center justify-between mb-6 gap-2 bg-white p-4 rounded-3xl shadow-sm border border-gray-150">
      <div className="flex items-center gap-3">
        <img src={companyLogo || newLogo} alt={companyName} className="h-10 w-auto object-contain max-h-[40px]" />
        <div>
          <h1 className="text-sm font-black text-[#0B4550] tracking-wide">
            {activePage === 'Dashboard' ? `${greeting}, ${trainerName.split(' ')[0]}` : activePage}
          </h1>
          <p className="text-[10px] text-[#898A8D] font-bold uppercase tracking-widest">{todayFormattedFull}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setShowAICopilot(true)}
          className="w-10 h-10 bg-[#F9F7F2] text-[#0B4550] rounded-full flex items-center justify-center relative hover:scale-105 transition-all shadow-sm border border-gray-150"
        >
          <Sparkles size={18} />
        </button>
        <div className="w-10 h-10 rounded-full bg-[#E6FF2B] flex items-center justify-center text-[#0B4550] text-xs font-black border-2 border-white shadow-md">
          {getInitials(trainerName)}
        </div>
      </div>
    </header>

    {/* DESKTOP HEADER */}
    <header className="hidden md:flex flex-col lg:flex-row lg:justify-between lg:items-start mb-8 gap-4 md:gap-6">
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
        <h1 className="text-2xl md:text-3xl lg:text-5xl font-medium text-[#0B4550] mb-2">Revenue History</h1>
        <p className="text-[#898A8D] font-medium text-base lg:text-xl">Manage payments and download invoices.</p>
      </>
    )}

    {/* ATTENDANCE HEADER */}
    {activePage === 'Attendance' && (
      <>
        <h1 className="text-2xl md:text-3xl lg:text-5xl font-medium text-[#0B4550] mb-2">Attendance History</h1>
        <p className="text-[#898A8D] font-medium text-base lg:text-xl">Track client attendance and total training hours.</p>
      </>
    )}

    {/* CLIENT ROSTER HEADER */}
    {activePage === 'Clients' && !selectedClient && (
      <>
        <h1 className="text-2xl md:text-3xl lg:text-5xl font-medium text-[#0B4550] mb-2">Client Roster</h1>
        <p className="text-[#898A8D] font-medium text-base lg:text-xl">Manage your active clients and memberships.</p>
      </>
    )}

    {/* ... (Repeat the same pattern for other activePage views: text-2xl md:text-3xl lg:text-5xl and text-base lg:text-xl) ... */}
    
    {/* For example, for Settings: */}
    {activePage === 'Settings' && (
      <>
        <h1 className="text-2xl md:text-3xl lg:text-5xl font-medium text-[#0B4550] mb-2">Settings</h1>
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
        placeholder="Search clients, classes, coaches..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full lg:w-72 pl-12 lg:pl-14 pr-4 py-2.5 lg:py-3 bg-white border-none rounded-full text-base lg:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#E6FF2B] shadow-sm text-[#0B4550] placeholder-[#898A8D]"
      />
      {searchQuery.trim() && (
        <div className="absolute right-0 left-0 lg:left-auto lg:w-96 mt-2 bg-white border border-gray-150 rounded-2xl shadow-xl z-[999] p-4 max-h-[400px] overflow-y-auto flex flex-col gap-4">
          {/* CLIENTS RESULTS */}
          <div>
            <h4 className="text-[11px] font-bold text-[#898A8D] uppercase tracking-widest mb-2 border-b border-gray-50 pb-1">Clients ({searchResults.clients.length})</h4>
            <div className="flex flex-col gap-1">
              {searchResults.clients.map(c => (
                <button 
                  key={c.id} 
                  onClick={() => handleSelectClientFromSearch(c)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F9F7F2] transition-all text-left text-sm font-semibold text-[#0B4550]"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="w-8 h-8 rounded-full bg-[#0B4550]/10 text-[#0B4550] flex items-center justify-center text-xs font-bold shrink-0">{getInitials(c.name)}</span>
                    <div className="flex flex-col truncate">
                      <span className="truncate">{c.name}</span>
                      <span className="text-xs text-[#898A8D] truncate font-medium">{c.email || 'No email'}</span>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-gray-300" />
                </button>
              ))}
              {searchResults.clients.length === 0 && (
                <p className="text-xs text-gray-400 font-medium text-center py-2">No matching clients.</p>
              )}
            </div>
          </div>
          
          {/* SCHEDULE RESULTS */}
          <div>
            <h4 className="text-[11px] font-bold text-[#898A8D] uppercase tracking-widest mb-2 border-b border-gray-50 pb-1">Schedule ({searchResults.sessions.length})</h4>
            <div className="flex flex-col gap-1">
              {searchResults.sessions.map(s => (
                <button 
                  key={s.id} 
                  onClick={() => handleSelectSessionFromSearch(s)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F9F7F2] transition-all text-left text-sm font-semibold text-[#0B4550]"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="w-8 h-8 rounded-full bg-[#E6FF2B]/20 text-[#0B4550] flex items-center justify-center shrink-0"><Calendar size={14} /></span>
                    <div className="flex flex-col truncate">
                      <span className="truncate">{s.title || 'Blocked Slot'}</span>
                      <span className="text-xs text-[#898A8D] font-medium truncate">{formatDbDate(s.date)} • {s.time}</span>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-gray-300" />
                </button>
              ))}
              {searchResults.sessions.length === 0 && (
                <p className="text-xs text-gray-400 font-medium text-center py-2">No matching classes.</p>
              )}
            </div>
          </div>
        </div>
      )}
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
  </>
)}
        {/* VIEW: DASHBOARD OVERVIEW */}
        {activePage === 'Dashboard' && (
          <>
            {/* MOBILE DASHBOARD (HIGH FIDELITY) */}
            <div className="md:hidden space-y-4 animate-in fade-in duration-300 pb-8">
              {/* Main Balance / Revenue Card */}
              <div 
                onClick={() => handleNavigateToPage('Revenue')}
                className="bg-gradient-to-br from-[#0B4550] to-[#08353E] p-6 rounded-[2rem] shadow-md relative overflow-hidden cursor-pointer group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                  <ArrowUpRight size={80} className="text-[#E6FF2B]" />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-white/75 text-xs font-bold uppercase tracking-widest">Total Revenue</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleRevenueVisibility();
                      }}
                      className="text-white/60 hover:text-white p-1"
                    >
                      {isRevenueHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  <h2 className="text-4xl font-black text-white tracking-tight mb-6">
                    {isRevenueHidden ? 'RM ••••' : `RM ${dashboardMetrics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                  </h2>
                  <div className="flex items-center justify-between">
                    <span className="text-[#E6FF2B] bg-[#E6FF2B]/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#E6FF2B]/20">
                      {dashboardMetrics.revenueGrowthStr || "+12.4%"} This Month
                    </span>
                  </div>
                </div>
              </div>

              {/* Secondary Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div 
                  onClick={() => handleNavigateToPage('Clients', 'Active')}
                  className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#F9F7F2] flex items-center justify-center mb-3">
                    <Users size={14} className="text-[#0B4550]" />
                  </div>
                  <span className="text-3xl font-black text-[#0B4550] mb-1">{activeClientsCount}</span>
                  <span className="text-[#898A8D] text-[10px] font-bold uppercase tracking-widest">Active Clients</span>
                </div>
                <div 
                  onClick={() => handleNavigateToPage('Schedule')}
                  className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#F9F7F2] flex items-center justify-center mb-3">
                    <Calendar size={14} className="text-[#0B4550]" />
                  </div>
                  <span className="text-3xl font-black text-[#0B4550] mb-1">
                    {sessions.filter(s => s.date === new Date().toLocaleDateString('sv-SE')).length}
                  </span>
                  <span className="text-[#898A8D] text-[10px] font-bold uppercase tracking-widest">Classes Today</span>
                </div>
              </div>

              {/* Segmented Control for Schedule vs Logs */}
              <div className="bg-[#F9F7F2] rounded-[1.5rem] p-1.5 flex border border-gray-100">
                <button 
                  onClick={() => setMobileDashboardTab('schedule')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mobileDashboardTab === 'schedule' ? 'bg-[#0B4550] text-[#E6FF2B] shadow-md' : 'text-[#898A8D]'}`}
                >
                  Schedule
                </button>
                <button 
                  onClick={() => setMobileDashboardTab('history')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mobileDashboardTab === 'history' ? 'bg-[#0B4550] text-[#E6FF2B] shadow-md' : 'text-[#898A8D]'}`}
                >
                  History
                </button>
              </div>

              {/* Schedule Tab Content */}
              {mobileDashboardTab === 'schedule' && (
                <div className="space-y-3">
                  {(() => {
                    const todayStr = new Date().toLocaleDateString('sv-SE');
                    const todaySessions = sessions
                      .filter(s => s.date === todayStr)
                      .sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));

                    if (todaySessions.length === 0) {
                      return (
                        <div className="text-center py-12 bg-white rounded-[2rem] border border-gray-100">
                          <p className="text-[#898A8D] font-bold text-sm">No classes today.</p>
                        </div>
                      );
                    }

                    return todaySessions.map(session => {
                      const isPast = isSessionPast(session);
                      const attendedCount = session.attendees ? session.attendees.length : 0;
                      return (
                        <div 
                          key={session.id}
                          onClick={() => { setSelectedSession(session); setShowMobileRosterDrawer(true); }}
                          className={`bg-white border border-gray-100 rounded-[1.5rem] p-5 flex justify-between items-center transition-all active:scale-[0.98] cursor-pointer ${isPast ? 'opacity-50' : ''}`}
                        >
                          <div className="space-y-2">
                            <span className="font-black text-[#0B4550] text-base block">{getSessionDisplayTitle(session)}</span>
                            <div className="flex items-center gap-3 text-xs font-bold text-[#898A8D] uppercase tracking-widest">
                              <span className="flex items-center gap-1.5 text-[#0B4550]"><Clock size={12} /> {session.time}</span>
                              <span>{session.type}</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0 bg-[#F9F7F2] px-4 py-3 rounded-2xl border border-gray-100">
                            <span className="text-lg font-black text-[#0B4550] block leading-none">{attendedCount}</span>
                            <span className="text-[8px] text-[#898A8D] font-bold uppercase tracking-widest mt-1 block">Booked</span>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              )}

              {/* History Tab Content */}
              {mobileDashboardTab === 'history' && (
                <div className="bg-white rounded-[1.5rem] p-4 border border-gray-100">
                  {renderMobileAttendanceLogs()}
                </div>
              )}
            </div>

            {/* DESKTOP DASHBOARD */}
            <div className="hidden md:block animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center mb-8 gap-4">
              <div className="bg-white px-4 md:px-6 py-3 rounded-xl border-l-4 border-[#E6FF2B] shadow-sm max-w-2xl">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              <div className="bg-[#0B4550] rounded-3xl p-4 md:p-6 shadow-md relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => handleNavigateToPage('Revenue')}>
                <div className="absolute right-6 -top-6 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-all"></div>
                <div className="flex flex-col md:flex-row md:justify-between items-start gap-4 md:gap-0 mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white/80 font-medium text-lg">Total Revenue</h3>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleRevenueVisibility();
                      }}
                      className="text-white/60 hover:text-white transition-colors focus:outline-none p-0.5 rounded"
                      title={isRevenueHidden ? "Show Revenue" : "Hide Revenue"}
                    >
                      {isRevenueHidden ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <ArrowUpRight className="text-white/50 group-hover:text-[#E6FF2B] transition-colors" size={20} />
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-1 tracking-tight">
                  {isRevenueHidden ? 'RM ••••' : `RM ${dashboardMetrics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                </h2>
              </div>
              
              <StatCard 
                title="Total Transactions" 
                value={dashboardMetrics.totalCount} 
                trend="+1" 
                isPositive={true} 
                onClick={() => handleNavigateToPage('Revenue')} 
              />
              
              <StatCard 
                title="Upcoming Expiries" 
                value={liveExpiries.length} 
                trend="-2" 
                isPositive={false} 
                onClick={() => handleNavigateToPage('Clients', 'Expiring Soon')} 
              />
              
              <StatCard 
                title="Active Clients" 
                value={activeClientsCount} 
                trend="+1" 
                isPositive={true} 
                onClick={() => handleNavigateToPage('Clients', 'Active')} 
              />
            </div>

            <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-gray-100 mb-6">
              <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 md:gap-0 mb-8">
                <div>
                  <h3 className="font-medium text-2xl text-[#0B4550]">Upcoming Schedule</h3>
                  <p className="text-sm text-[#898A8D] mt-1">Your next high-value sessions and member check-ins</p>
                </div>
                <button onClick={() => setActivePage('Schedule')} className="flex items-center gap-2 text-[#898A8D] font-medium hover:text-[#0B4550] transition-colors">
                  View Full Calendar <ArrowRight size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {(() => {
                  const upcomingSessions = sessions
                    .filter(s => !isSessionPast(s))
                    .sort((a, b) => {
                      const dateDiff = new Date(a.date) - new Date(b.date);
                      if (dateDiff !== 0) return dateDiff;
                      return parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time);
                    });

                  if (upcomingSessions.length === 0) {
                    return (
                      <div className="md:col-span-3 text-center py-6 md:py-10 text-[#898A8D] font-medium">No upcoming sessions. Head to the Schedule tab to add some!</div>
                    );
                  }

                  return upcomingSessions.slice(0, 3).map((session, index) => {
                    const isNext = index === 0;
                    return (
                      <div 
                        key={session.id} 
                        className={`rounded-2xl p-5 border transition-all duration-300 cursor-pointer group flex flex-col justify-between ${
                          isNext 
                            ? 'bg-[#F9F7F2] border-[#E6FF2B] shadow-[0_4px_20px_rgba(11,69,80,0.05)] hover:scale-[1.03]' 
                            : 'bg-white border-gray-100 hover:border-[#0B4550] hover:scale-[1.01]'
                        }`}
                        onClick={() => setActivePage('Schedule')}
                      >
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                              isNext ? 'bg-[#0B4550] text-[#E6FF2B]' : 'bg-[#F9F7F2] text-[#0B4550]'
                            }`}>
                              {session.type}
                            </span>
                            
                            {isNext && (
                              <span className="flex items-center gap-1 bg-[#E6FF2B]/20 text-[#0B4550] px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse border border-[#E6FF2B]/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#0B4550] inline-block animate-ping"></span>
                                Up Next
                              </span>
                            )}
                          </div>
                          
                          <h4 className="text-xl font-bold text-[#0B4550] mb-2 group-hover:text-black transition-colors">
                            {getSessionDisplayTitle(session)}
                          </h4>
                          
                          <div className="space-y-2 mb-4">
                            <p className="text-xs font-semibold text-[#898A8D] flex items-center gap-1.5">
                              <Clock size={14} className="text-[#0B4550]" /> {formatDbDate(session.date)} - {session.time}
                            </p>
                            <p className="text-xs font-semibold text-[#898A8D] flex items-center gap-1.5">
                              <MapPin size={14} className="text-[#0B4550]" /> {session.location}
                            </p>
                            <p className="text-xs font-semibold text-[#898A8D] flex items-center gap-1.5">
                              <User size={14} className="text-[#0B4550]" /> Coach: {session.coach || session.trainer || trainerName || 'Unassigned'}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 pt-4 border-t border-gray-100 mt-2">
                          <div className="flex justify-between items-center">
                            <div className="flex -space-x-2">
                              {session.attendees && session.attendees.length > 0 ? (
                                session.attendees.slice(0, 4).map((att, idx) => {
                                  const initials = att.name ? att.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?';
                                  return (
                                    <div 
                                      key={idx} 
                                      className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white text-white bg-[#0B4550]"
                                      title={att.name}
                                    >
                                      {initials}
                                    </div>
                                  );
                                })
                              ) : (
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white bg-gray-100 text-gray-400" title="No attendees yet">
                                  ?
                                </div>
                              )}
                              {session.attendees && session.attendees.length > 4 && (
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white bg-[#898A8D] text-white" title={`${session.attendees.length - 4} more`}>
                                  +{session.attendees.length - 4}
                                </div>
                              )}
                            </div>
                            <span className="text-xs font-bold text-[#898A8D]">
                              {session.attendees ? session.attendees.length : 0} / {session.capacity} Booked
                            </span>
                          </div>
                          
                          {session.capacity > (session.attendees ? session.attendees.length : 0) ? (
                            <span className="text-[10px] font-bold text-emerald-600/90 text-right">
                              {session.capacity - (session.attendees ? session.attendees.length : 0)} slots available
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-red-500 text-right">
                              Fully Booked
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
              {/* Quick Tasks */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col min-h-[350px]">
                <h3 className="font-medium text-xl text-[#0B4550] mb-4">Quick Tasks</h3>
                <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2 max-h-[220px]">
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

              {/* Birthdays */}
              <div className="lg:col-span-1 bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col min-h-[350px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-xl text-[#0B4550]">
                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][currentMonth]} Birthdays
                  </h3>
                  <span className="bg-[#E6FF2B]/30 text-[#0B4550] text-xs font-medium px-2 py-1 rounded-lg">{liveBirthdays.length}</span>
                </div>
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[220px] pr-1">
                  {liveBirthdays.length === 0 ? (
                    <p className="text-[#898A8D] font-medium text-sm text-center pt-8">No birthdays this month</p>
                  ) : (
                    liveBirthdays.map(b => (
                      <div key={b.id} className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 md:gap-0 text-sm font-medium p-2 hover:bg-[#F9F7F2] rounded-lg transition-colors cursor-pointer">
                        <span className="text-[#0B4550] flex items-center">
                          {b.name} {b.date === todayMonthDay && <span className="ml-2 text-base" title="Birthday Today!">🎁</span>}
                        </span>
                        <span className="text-[#898A8D]">{b.date}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
  </>
)}

        {/* VIEW: REVENUE */}
        {activePage === 'Revenue' && (
          !isRevenueUnlocked ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm animate-in fade-in duration-300 w-full">
              <div className="w-20 h-20 bg-[#F9F7F2] text-[#0B4550] rounded-full flex items-center justify-center mb-6">
                <Lock size={40} />
              </div>
              <h3 className="text-3xl font-black text-[#0B4550] mb-2">Revenue Access Locked</h3>
              <p className="text-[#898A8D] font-medium mb-8 max-w-sm text-base leading-relaxed">Financial history and analytics require a secure owner verification.</p>
              <button 
                onClick={() => {
                  setPendingPageAction('Revenue');
                  setSecurityPinInput('');
                  setSecurityPinError(false);
                  setShowSecurityPinModal(true);
                }}
                className="bg-[#0B4550] text-[#E6FF2B] font-bold text-lg px-8 py-4 rounded-2xl hover:scale-105 transition-all shadow-md flex items-center gap-2"
              >
                <Unlock size={20} /> Enter Owner PIN
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 md:gap-0 mb-8">
            {/* NEW: Backlog Button */}
            <button 
              onClick={() => setShowBacklogModal(true)}
              className="bg-[#0B4550] text-[#E6FF2B] px-4 md:px-6 py-3 rounded-[1.5rem] md:rounded-full font-black md:font-medium hover:bg-opacity-90 transition-all flex items-center gap-2 shadow-sm border-transparent w-full md:w-auto justify-center md:justify-start"
            >
              <Plus size={20} />
              Add Historical Data
            </button>

            {/* Your existing tabs */}
            <div className="flex bg-[#F9F7F2] md:bg-white rounded-[1.5rem] md:rounded-full p-1.5 shadow-lg md:shadow-sm border border-gray-100 w-full md:w-auto overflow-x-auto no-scrollbar">
              {['Day', 'Week', 'Month', 'Year', 'All Time'].map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => setActiveRevenuePeriod(tab)} 
                  className={`flex-1 min-w-[60px] md:flex-none px-4 md:px-6 py-2 rounded-xl md:rounded-full text-[10px] md:text-lg font-black md:font-medium uppercase tracking-widest md:normal-case md:tracking-normal transition-all ${activeRevenuePeriod === tab ? 'bg-[#0B4550] md:bg-[#898A8D] text-[#E6FF2B] md:text-white shadow-md md:shadow-none' : 'text-[#898A8D] hover:text-[#0B4550]'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

            {/* DESKTOP REVENUE STATS */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
               <div className="bg-[#0B4550] rounded-3xl p-4 md:p-6 shadow-md relative overflow-hidden">
                 <div className="flex justify-between items-center mb-2">
                   <h3 className="text-white/80 font-medium text-lg">Total Collected (This Month)</h3>
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       handleToggleRevenueVisibility();
                     }}
                     className="text-white/60 hover:text-white transition-colors focus:outline-none p-0.5 rounded"
                     title={isRevenueHidden ? "Show Revenue" : "Hide Revenue"}
                   >
                     {isRevenueHidden ? <EyeOff size={18} /> : <Eye size={18} />}
                   </button>
                 </div>
                 <h2 className="text-3xl md:text-4xl font-medium text-white">
                   {isRevenueHidden ? 'RM ••••' : `RM ${totalCollectedThisMonth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                 </h2>
               </div>
               <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100">
                 <h3 className="text-[#898A8D] font-medium text-lg mb-2">Pending Payments</h3>
                 <h2 className="text-3xl md:text-4xl font-medium text-[#0B4550]">
                   {isRevenueHidden ? 'RM ••••' : 'RM 0.00'}
                 </h2>
               </div>
               <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100">
                 <h3 className="text-[#898A8D] font-medium text-lg mb-2">Projected Renewals</h3>
                 <h2 className="text-3xl md:text-4xl font-medium text-[#0B4550]">
                   {isRevenueHidden ? 'RM ••••' : `RM ${estimatedRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                 </h2>
               </div>
            </div>
            
            {/* MOBILE REVENUE STATS */}
            <div className="md:hidden grid grid-cols-2 gap-4 mb-6">
               <div className="bg-gradient-to-br from-[#0B4550] to-[#08353E] rounded-[2rem] p-5 shadow-md col-span-2 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                   <DollarSign size={80} className="text-[#E6FF2B]" />
                 </div>
                 <div className="relative z-10 flex flex-col h-full justify-between">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-white/75 text-[10px] font-bold uppercase tracking-widest">Collected (This Month)</span>
                     <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         handleToggleRevenueVisibility();
                       }}
                       className="text-white/60 hover:text-white p-1"
                     >
                       {isRevenueHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                     </button>
                   </div>
                   <h2 className="text-4xl font-black text-white tracking-tight">
                     {isRevenueHidden ? 'RM ••••' : `RM ${totalCollectedThisMonth.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                   </h2>
                 </div>
               </div>
               <div className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm">
                 <span className="text-[#898A8D] text-[10px] font-bold uppercase tracking-widest block mb-2">Pending</span>
                 <span className="text-xl font-black text-[#0B4550] block">
                   {isRevenueHidden ? 'RM ••••' : 'RM 0'}
                 </span>
               </div>
               <div className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm">
                 <span className="text-[#898A8D] text-[10px] font-bold uppercase tracking-widest block mb-2">Projected</span>
                 <span className="text-xl font-black text-emerald-600 block">
                   {isRevenueHidden ? 'RM ••••' : `RM ${estimatedRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                 </span>
               </div>
            </div>

            <div className="hidden md:block bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-gray-100">
              <h3 className="font-medium text-2xl text-[#0B4550] mb-6 border-b-2 border-gray-100 pb-4">Recent Transactions</h3>
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-6 md:py-10 text-[#898A8D] font-medium">No transactions found for this period.</div>
              ) : (
                <div className="space-y-8">
                  {Object.values(groupedTransactions)
                    .sort((a, b) => b.year - a.year)
                    .map((yearData) => (
                      <div key={yearData.year} className="space-y-6">
                        {/* YEAR HEADER */}
                        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 md:gap-0 border-b border-gray-100 pb-3 mt-4">
                          <h4 className="text-base font-extrabold text-[#0B4550] flex items-center gap-2">
                            <Calendar size={18} /> {yearData.year}
                          </h4>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                            Yearly Collected: <span className="text-emerald-600 font-extrabold">{isRevenueHidden ? 'RM ••••' : `RM ${yearData.totalEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span>
                          </div>
                        </div>

                        {/* MONTHS LIST */}
                        <div className="space-y-4">
                          {Object.values(yearData.months)
                            .sort((a, b) => b.maxTimestamp - a.maxTimestamp)
                            .map((monthData) => {
                              const monthYearKey = monthData.monthYear;
                              const expanded = expandedMonths[monthYearKey] !== false; // Default to open!
                              
                              return (
                                <div key={monthYearKey} className="space-y-4">
                                  {/* COLLAPSIBLE HEADER BAR */}
                                  <div 
                                    onClick={() => {
                                      setExpandedMonths(prev => ({
                                        ...prev,
                                        [monthYearKey]: !expanded
                                      }));
                                    }}
                                    className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 md:gap-0 bg-[#F9F7F2] p-4 rounded-2xl border border-gray-100 shadow-sm sticky top-0 z-10 cursor-pointer hover:bg-gray-100 transition-colors group/header"
                                  >
                                    <div className="flex items-center gap-3">
                                      <ChevronRight size={18} className={`text-[#0B4550] transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`} />
                                      <h4 className="font-bold text-[#0B4550] text-sm uppercase tracking-wider">{monthData.monthName}</h4>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-[10px] font-bold text-[#898A8D] uppercase">Collected</p>
                                      <p className="text-sm font-bold text-emerald-600">{isRevenueHidden ? 'RM ••••' : `RM ${monthData.totalEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p>
                                    </div>
                                  </div>

                                  {/* MONTH TABLE CONTENT */}
                                  {expanded && (
                                    <div className="overflow-x-auto pr-2 no-scrollbar animate-in slide-in-from-top-2 duration-300">
                                      <table className="w-full min-w-[650px] md:min-w-full text-left border-collapse mb-2 md:table-fixed table-auto">
                                        <thead>
                                          <tr className="text-xs font-bold text-[#898A8D] uppercase tracking-wider border-b border-gray-100">
                                            <th className="pb-3 pt-1 pl-4 w-[12%]">Date</th>
                                            <th className="pb-3 pt-1 w-[23%]">Client Name</th>
                                            <th className="pb-3 pt-1 w-[45%]">Description</th>
                                            <th className="pb-3 pt-1 w-[12%] text-right">Amount</th>
                                            <th className="pb-3 pt-1 pr-4 w-[8%] text-right">Actions</th>
                                          </tr>
                                        </thead>
                                        <tbody className="text-base font-semibold text-[#0B4550]">
                                          {monthData.items
                                            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                            .map((t) => (
                                              <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="py-3 pl-4 text-xs font-semibold text-gray-500 w-[12%]">{new Date(t.created_at).toLocaleDateString('en-GB')}</td>
                                                <td className="py-3 font-bold w-[23%]">{clients.find(c => c.id === t.client_name)?.name || t.client_name}</td>
                                                <td className="py-3 text-xs text-gray-500 font-semibold w-[45%]">{t.description}</td>
                                                <td className="py-3 font-black text-emerald-600 text-right w-[12%]">{isRevenueHidden ? 'RM ••••' : `+RM ${Number(t.amount).toFixed(2)}`}</td>
                                                <td className="py-3 pr-4 text-right w-[8%]">
                                                   <div className="flex items-center justify-end gap-2">
                                                     {t.amount > 0 && !t.is_backlog && (
                                                       <button 
                                                         onClick={() => {
                                                           setSelectedInvoiceTransaction(t);
                                                           setIsInvoiceModalOpen(true);
                                                         }}
                                                         className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all flex items-center justify-center" 
                                                         title="Download Invoice PDF"
                                                       >
                                                         <FileText size={14} />
                                                       </button>
                                                     )}
                                                     <button 
                                                       onClick={() => handleDeleteTransaction(t.id)} 
                                                       className="p-1.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex items-center justify-center" 
                                                       title="Delete Transaction"
                                                     >
                                                       <Trash2 size={14} />
                                                     </button>
                                                   </div>
                                                </td>
                                              </tr>
                                            ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* MOBILE TRANSACTIONS LIST (HIGH FIDELITY) */}
            <div className="md:hidden bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm mt-6">
              <h3 className="font-black text-[#0B4550] text-lg mb-4 uppercase tracking-widest pl-2">Recent Transactions</h3>
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-10 bg-[#F9F7F2] rounded-[1.5rem] border border-gray-100">
                  <p className="text-[#898A8D] font-bold text-sm">No transactions found.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.values(groupedTransactions)
                    .sort((a, b) => b.year - a.year)
                    .map((yearData) => (
                      <div key={yearData.year} className="space-y-4">
                        <div className="flex justify-between items-center px-2 border-b border-gray-100 pb-2">
                          <span className="text-[#0B4550] font-black">{yearData.year}</span>
                          <span className="text-[#898A8D] font-bold text-[10px] uppercase tracking-widest">
                            {isRevenueHidden ? 'RM ••••' : `RM ${yearData.totalEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                          </span>
                        </div>
                        
                        {Object.values(yearData.months)
                          .sort((a, b) => b.maxTimestamp - a.maxTimestamp)
                          .map((monthData) => (
                            <div key={monthData.monthYear} className="space-y-2">
                              <h4 className="text-[#898A8D] font-bold text-[10px] uppercase tracking-widest pl-2 border-l-2 border-[#0B4550] ml-1 mb-2">
                                {monthData.monthName}
                              </h4>
                              {monthData.items
                                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                .map((t) => (
                                  <div 
                                    key={t.id} 
                                    className="bg-[#F9F7F2] border border-gray-100 p-4 rounded-[1.5rem] flex items-center justify-between transition-all active:scale-[0.98]"
                                  >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                      <div className="w-10 h-10 rounded-full bg-white text-[#0B4550] flex items-center justify-center shrink-0 border border-gray-150">
                                        <DollarSign size={16} />
                                      </div>
                                      <div className="flex flex-col min-w-0">
                                        <span className="text-[#0B4550] font-bold text-sm truncate">
                                          {clients.find(c => c.id === t.client_name)?.name || t.client_name}
                                        </span>
                                        <span className="text-[#898A8D] text-[10px] font-semibold truncate">
                                          {t.description} • {new Date(t.created_at).toLocaleDateString('en-GB')}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="text-right shrink-0 ml-3">
                                      <span className="text-emerald-600 font-black text-sm block">
                                        {isRevenueHidden ? 'RM ••••' : `+RM ${Number(t.amount).toFixed(2)}`}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                        ))}
                      </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      )}

        {/* VIEW: ATTENDANCE HISTORY */}
        {activePage === 'Attendance' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              <div className="bg-[#0B4550] rounded-3xl p-4 md:p-6 shadow-md relative overflow-hidden">
                <h3 className="text-white/80 font-medium text-lg mb-2">Total Training Hours (This Month)</h3>
                <h2 className="text-3xl md:text-4xl font-medium text-white flex items-center gap-2">
                  <Clock size={28} className="text-[#E6FF2B]" />
                  {attendanceMonthStats.hours.toFixed(1)} hrs
                </h2>
              </div>
              <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100">
                <h3 className="text-[#898A8D] font-medium text-lg mb-2">Classes Conducted (This Month)</h3>
                <h2 className="text-3xl md:text-4xl font-medium text-[#0B4550] flex items-center gap-2">
                  <Calendar size={28} className="text-[#898A8D]" />
                  {attendanceMonthStats.classes}
                </h2>
              </div>
              <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100">
                <h3 className="text-[#898A8D] font-medium text-lg mb-2">Client Attendances (This Month)</h3>
                <h2 className="text-3xl md:text-4xl font-medium text-[#0B4550] flex items-center gap-2">
                  <Users size={28} className="text-[#898A8D]" />
                  {attendanceMonthStats.attendances}
                </h2>
              </div>
            </div>

            {/* COLLAPSIBLE LOGS LIST */}
            <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-gray-100">
              <h3 className="font-medium text-2xl text-[#0B4550] mb-6 border-b-2 border-gray-100 pb-4">Completed Attendance Logs</h3>
              {Object.keys(groupedAttendance).length === 0 ? (
                <div className="text-center py-6 md:py-10 text-[#898A8D] font-medium">No completed attendance logs found. Make sure to mark clients as "Attended" in your roster.</div>
              ) : (
                <div className="space-y-8">
                  {Object.values(groupedAttendance)
                    .sort((a, b) => b.year - a.year)
                    .map((yearData) => (
                      <div key={yearData.year} className="space-y-6">
                        {/* YEAR HEADER */}
                        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 md:gap-0 border-b border-gray-100 pb-3 mt-4">
                          <h4 className="text-base font-extrabold text-[#0B4550] flex items-center gap-2">
                            <Calendar size={18} /> {yearData.year}
                          </h4>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                            Yearly Totals: <span className="text-[#0B4550] font-extrabold">{yearData.totalHours.toFixed(1)} Hours</span> ({yearData.totalClasses} classes, {yearData.totalAttendances} attendances)
                          </div>
                        </div>

                        {/* MONTHS LIST */}
                        <div className="space-y-4">
                          {Object.values(yearData.months)
                            .sort((a, b) => b.monthIndex - a.monthIndex)
                            .map((monthData) => {
                              const monthYearKey = monthData.monthYear;
                              const expanded = expandedMonths[monthYearKey] !== false; // Default to open!

                              return (
                                <div key={monthYearKey} className="space-y-4">
                                  {/* MONTH HEADER BAR */}
                                  <div 
                                    onClick={() => {
                                      setExpandedMonths(prev => ({
                                        ...prev,
                                        [monthYearKey]: !expanded
                                      }));
                                    }}
                                    className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 md:gap-0 bg-[#F9F7F2] p-4 rounded-2xl border border-gray-100 shadow-sm sticky top-0 z-10 cursor-pointer hover:bg-gray-100 transition-colors group/header"
                                  >
                                    <div className="flex items-center gap-3">
                                      <ChevronRight size={18} className={`text-[#0B4550] transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`} />
                                      <h4 className="font-bold text-[#0B4550] text-sm uppercase tracking-wider">{monthData.monthName}</h4>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-[10px] font-bold text-[#898A8D] uppercase">Hours Conducted</p>
                                      <p className="text-sm font-bold text-[#0B4550]">{monthData.totalHours.toFixed(1)} hrs ({monthData.totalClasses} classes)</p>
                                    </div>
                                  </div>

                                  {/* DATE DROPDOWNS */}
                                  {expanded && (
                                    <div className="space-y-3 pl-2">
                                      {Object.values(monthData.dates)
                                        .sort((a, b) => b.timestamp - a.timestamp)
                                        .map((dateData) => {
                                          const dateKey = dateData.dateStr;
                                          const dateExpanded = expandedDates[dateKey] === true;

                                          return (
                                            <div key={dateKey} className="border border-gray-50 rounded-2xl overflow-hidden shadow-sm">
                                              {/* COLLAPSIBLE DATE ROW */}
                                              <div 
                                                onClick={() => {
                                                  setExpandedDates(prev => ({
                                                    ...prev,
                                                    [dateKey]: !dateExpanded
                                                  }));
                                                }}
                                                className="flex items-center justify-between p-3.5 bg-gray-50/50 hover:bg-gray-150/50 transition-colors cursor-pointer"
                                              >
                                                <div className="flex items-center gap-2">
                                                  <ChevronRight size={16} className={`text-[#898A8D] transition-transform duration-300 ${dateExpanded ? 'rotate-90' : ''}`} />
                                                  <span className="font-bold text-[#0B4550] text-base">{dateData.formattedDate}</span>
                                                </div>
                                                <div className="text-right text-xs font-bold text-[#898A8D]">
                                                  {dateData.sessions.length} class(es)
                                                </div>
                                              </div>

                                              {/* CLASSES LIST */}
                                              {dateExpanded && (
                                                <div className="p-4 bg-white border-t border-gray-50 space-y-4 animate-in slide-in-from-top-2 duration-300">
                                                  {dateData.sessions.map((s) => (
                                                    <div key={s.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#0B4550] transition-all">
                                                      <div className="space-y-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                          <span className="font-bold text-[#0B4550] text-lg">{s.title}</span>
                                                          <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${s.type === '1-on-1' ? 'bg-indigo-100 text-indigo-700' : 'bg-teal-100 text-teal-700'}`}>
                                                            {s.type}
                                                          </span>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#898A8D]">
                                                          <span className="flex items-center gap-1"><Clock size={14} /> {s.time}</span>
                                                          <span>•</span>
                                                          <span>Duration: {s.duration}</span>
                                                          {s.location && (
                                                            <>
                                                              <span>•</span>
                                                              <span>Location: {s.location}</span>
                                                            </>
                                                          )}
                                                        </div>
                                                      </div>
                                                      <div className="flex-1 md:max-w-md bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                                                        <span className="text-[10px] font-bold text-[#898A8D] uppercase tracking-wider block mb-1.5">Attended Clients ({s.attended.length})</span>
                                                        <div className="flex flex-wrap gap-1.5">
                                                          {s.attended.map(a => (
                                                            <span key={a.client_id} className="inline-flex items-center bg-[#0B4550]/5 text-[#0B4550] px-2.5 py-1 rounded-lg text-sm font-bold border border-[#0B4550]/10">
                                                              {a.name}
                                                            </span>
                                                          ))}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  ))}
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: CLIENTS */}
        {activePage === 'Clients' && (
          !isRevenueUnlocked ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm animate-in fade-in duration-300 w-full">
              <div className="w-20 h-20 bg-[#F9F7F2] text-[#0B4550] rounded-full flex items-center justify-center mb-6">
                <Lock size={40} />
              </div>
              <h3 className="text-3xl font-black text-[#0B4550] mb-2">Clients Access Locked</h3>
              <p className="text-[#898A8D] font-medium mb-8 max-w-sm text-base leading-relaxed">Member details, activity logs, and profiles require a secure owner verification.</p>
              <button 
                onClick={() => {
                  setPendingPageAction('Clients');
                  setSecurityPinInput('');
                  setSecurityPinError(false);
                  setShowSecurityPinModal(true);
                }}
                className="bg-[#0B4550] text-[#E6FF2B] font-bold text-lg px-8 py-4 rounded-2xl hover:scale-105 transition-all shadow-md flex items-center gap-2"
              >
                <Unlock size={20} /> Enter Owner PIN
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
            {!selectedClient && (
              <>
                {/* MOBILE CONTROLS (HIGH FIDELITY) */}
                <div className="md:hidden flex flex-col gap-4 mb-6">
                  <div className="flex bg-white rounded-[1.5rem] p-1.5 shadow-sm border border-gray-150 overflow-x-auto no-scrollbar">
                    {['All Clients', 'Active', 'Expiring Soon', 'Expired', 'Trial Clients', 'Follow Up'].map((tab) => (
                      <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-[#0B4550] text-[#E6FF2B] shadow-md' : 'text-[#898A8D]'}`}>
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input 
                        type="text" 
                        placeholder="Search clients..." 
                        value={clientSearchQuery}
                        onChange={(e) => setClientSearchQuery(e.target.value)}
                        className="w-full bg-white border border-gray-150 text-[#0B4550] pl-10 pr-4 py-3 rounded-2xl font-bold text-xs outline-none shadow-sm"
                      />
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#898A8D]" size={14} />
                    </div>
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-white border border-gray-150 text-[#0B4550] px-4 py-3 rounded-2xl font-bold text-xs outline-none shadow-sm cursor-pointer appearance-none"
                    >
                      <option value="newest">Recently Added</option>
                      <option value="az">Alphabetical (A-Z)</option>
                      <option value="za">Alphabetical (Z-A)</option>
                      <option value="expire">Earliest to Expire</option>
                      <option value="sessions">Most Sessions</option>
                    </select>
                    <button onClick={() => setShowAddModal(true)} className="bg-[#0B4550] text-[#E6FF2B] w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md shrink-0">
                      <Plus size={20} strokeWidth={3} />
                    </button>
                  </div>
                </div>

                {/* DESKTOP CONTROLS */}
                <div className="hidden md:flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 md:gap-0 mb-8">
                  <div className="flex bg-white rounded-full p-1.5 shadow-sm border border-gray-100 shrink-0 overflow-x-auto no-scrollbar max-w-full">
                    {['All Clients', 'Active', 'Expiring Soon', 'Expired', 'Trial Clients', 'Follow Up'].map((tab) => (
                      <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 md:px-6 py-2 rounded-full text-lg font-medium transition-all whitespace-nowrap ${activeTab === tab ? 'bg-[#898A8D] text-white' : 'text-[#898A8D] hover:text-[#0B4550]'}`}>
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
                      className={`px-4 md:px-6 py-3 rounded-xl font-medium text-lg flex items-center gap-2 transition-all shadow-sm ${isArchiveMode ? 'bg-[#0B4550] text-[#E6FF2B]' : 'bg-white text-[#898A8D] border border-gray-100 hover:text-[#0B4550]'}`}
                    >
                      <Download size={20} className={isArchiveMode ? "" : "opacity-70"} /> 
                      {isArchiveMode ? 'Exit Archive' : 'View Archive'}
                    </button>
                    <button onClick={() => setShowAddModal(true)} className="bg-[#E6FF2B] text-[#0B4550] px-4 md:px-6 py-3 rounded-xl font-medium text-lg flex items-center gap-2 hover:brightness-95 transition-all shadow-sm">
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
                ) : (
                  <>
                  {/* MOBILE CLIENT CARDS */}
                  <div className="md:hidden space-y-4">
                    {sortedAndFilteredClients.map(client => (
                      <div key={client.id} onClick={() => setSelectedClient(client)} className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm relative overflow-hidden group active:scale-[0.98] transition-all cursor-pointer">
                        <div className="flex items-center gap-4 mb-4 relative z-10">
                          <div className="w-14 h-14 rounded-full bg-[#F9F7F2] border border-gray-100 text-[#0B4550] flex items-center justify-center text-xl font-black shadow-inner">
                            {getInitials(client.name)}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <h3 className="text-xl font-black text-[#0B4550] truncate">{client.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[#898A8D] font-bold text-[10px] uppercase tracking-widest truncate">{client.package || 'No package'}</span>
                              {client.member_status === 'Trial' && (
                                <span className="bg-[#E6FF2B]/10 text-[#0B4550] border border-[#E6FF2B]/20 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Trial</span>
                              )}
                              {client.member_status === 'Follow Up' && (
                                <span className="bg-orange-50 text-orange-600 border border-orange-200 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Follow Up</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 relative z-10">
                          <div className="bg-[#F9F7F2] rounded-2xl p-3 border border-gray-100">
                            <span className="text-[#898A8D] font-bold text-[9px] uppercase tracking-widest block mb-1">Sessions Used</span>
                            <span className="text-[#0B4550] font-black text-lg">
                              {client.initial_package ? `${(client.initial_package || 0) - (client.remaining_package || 0)} / ${client.initial_package}` : (client.unlimited ? 'Unlimited' : '-')}
                            </span>
                          </div>
                          <div className="bg-[#F9F7F2] rounded-2xl p-3 border border-gray-100">
                            <span className="text-[#898A8D] font-bold text-[9px] uppercase tracking-widest block mb-1">Expiry Date</span>
                            <span className={`font-black text-sm ${getLiveClientStatus(client) === 'Expired' ? 'text-red-600' : getLiveClientStatus(client) === 'Expiring Soon' ? 'text-amber-600' : 'text-emerald-600'}`}>
                              {client.expiry || 'No date set'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* DESKTOP CLIENTS (LIST / GRID) */}
                  <div className="hidden md:block">
                  {viewMode === 'list' ? (
                  <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100 overflow-hidden">
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
                                <div className="flex items-center gap-2">
                                  <span className="font-bold">{client.name}</span>
                                  {client.member_status === 'Trial' && (
                                    <span className="bg-[#E6FF2B] text-[#0B4550] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Trial</span>
                                  )}
                                  {client.member_status === 'Follow Up' && (
                                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Follow Up</span>
                                  )}
                                </div>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {sortedAndFilteredClients.map(client => (
                      <div key={client.id} onClick={() => setSelectedClient(client)} className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all group relative">
                        <div className="flex flex-col md:flex-row md:justify-between items-start gap-4 md:gap-0 mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-[#F9F7F2] text-[#0B4550] flex items-center justify-center text-xl font-medium group-hover:bg-[#E6FF2B] transition-colors">
                              {getInitials(client.name)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-2xl font-medium text-[#0B4550]">{client.name}</h3>
                                {client.member_status === 'Trial' && (
                                  <span className="bg-[#E6FF2B] text-[#0B4550] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Trial</span>
                                )}
                                {client.member_status === 'Follow Up' && (
                                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Follow Up</span>
                                )}
                              </div>
                              <p className="text-[#898A8D] font-medium text-sm">{client.package || 'No package'}</p>
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

                        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 md:gap-0 pt-4 border-t border-gray-100">
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
              </div>
            </>
          )}
        </>
      )}

            {selectedClient && (
              <div className="animate-in slide-in-from-right-8 duration-300">
                <button onClick={() => setSelectedClient(null)} className="flex items-center gap-2 text-[#898A8D] font-medium text-lg mb-8 hover:text-[#0B4550] transition-colors">
                  <ArrowLeft size={24} /> Back to Roster
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-gray-100 text-center">
                      <div className="w-24 h-24 rounded-full bg-[#F9F7F2] text-[#0B4550] flex items-center justify-center text-2xl md:text-3xl font-medium mx-auto mb-4 border-4 border-white shadow-sm">
                        {getInitials(selectedClient.name)}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-medium text-[#0B4550] mb-2">{selectedClient.name}</h2>
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
                        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 md:gap-0 mb-2">
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
                            
                            <div><label className="text-xs font-bold text-[#898A8D] uppercase">Billing Address</label><input type="text" value={editClientForm.address || ''} onChange={e => setEditClientForm({...editClientForm, address: e.target.value})} className="w-full bg-[#F9F7F2] rounded-lg p-2 text-[#0B4550] font-medium outline-none focus:border focus:border-[#E6FF2B]" placeholder="e.g. 123 Main St, Kuala Lumpur" /></div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div>
                                <label className="text-xs font-bold text-[#898A8D] uppercase">Phone</label>
                                <input type="text" value={editClientForm.phone || ''} onChange={e => setEditClientForm({...editClientForm, phone: e.target.value})} className="w-full bg-[#F9F7F2] rounded-lg p-2 text-[#0B4550] font-medium outline-none focus:border focus:border-[#E6FF2B]" />
                              </div>
                              <div>
                                <label className="text-xs font-bold text-[#898A8D] uppercase">Date of Birth</label>
                                <input type="date" value={editClientForm.dob || ''} onChange={e => setEditClientForm({...editClientForm, dob: e.target.value})} className="w-full bg-[#F9F7F2] rounded-lg p-2 text-[#0B4550] font-medium outline-none focus:border focus:border-[#E6FF2B]" />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div>
                                <label className="text-xs font-bold text-[#898A8D] uppercase">Type</label>
                                <select value={editClientForm.client_type} onChange={e => setEditClientForm({...editClientForm, client_type: e.target.value})} className="w-full bg-[#F9F7F2] rounded-lg p-2 text-[#0B4550] font-medium outline-none">
                                  <option value="Group">Group</option><option value="PT">PT</option><option value="Group & PT">Group & PT</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-xs font-bold text-[#898A8D] uppercase">Status</label>
                                <select value={editClientForm.member_status} onChange={e => setEditClientForm({...editClientForm, member_status: e.target.value})} className="w-full bg-[#F9F7F2] rounded-lg p-2 text-[#0B4550] font-medium outline-none">
                                  <option value="Member">Member</option><option value="Non-Member">Non-Member</option><option value="Trial">Trial</option><option value="Follow Up">Follow Up</option>
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
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div>
                                <label className="text-xs font-bold text-[#898A8D] uppercase">Expiry Date</label>
                                <input type="date" value={editClientForm.expiry || ''} onChange={e => setEditClientForm({...editClientForm, expiry: e.target.value})} className="w-full bg-[#F9F7F2] rounded-lg p-2 text-[#0B4550] font-medium outline-none focus:border focus:border-[#E6FF2B]" />
                              </div>
                              <div>
                                <label className="text-xs font-bold text-[#898A8D] uppercase">Date Paid</label>
                                <input type="date" value={editClientForm.date_paid || ''} onChange={e => setEditClientForm({...editClientForm, date_paid: e.target.value})} className="w-full bg-[#F9F7F2] rounded-lg p-2 text-[#0B4550] font-medium outline-none focus:border focus:border-[#E6FF2B]" />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
                            <div className="col-span-1 md:col-span-2"><p className="text-sm font-medium text-[#898A8D]">Full Name</p><p className="text-lg font-medium text-[#0B4550]">{selectedClient.name || 'N/A'}</p></div>
                            <div className="col-span-1 md:col-span-2"><p className="text-sm font-medium text-[#898A8D]">Email</p><p className="text-lg font-medium text-[#0B4550]">{selectedClient.email || 'N/A'}</p></div>
                            <div className="col-span-1 md:col-span-2"><p className="text-sm font-medium text-[#898A8D]">Billing Address</p><p className="text-lg font-medium text-[#0B4550]">{selectedClient.address || 'N/A'}</p></div>
                            <div><p className="text-sm font-medium text-[#898A8D]">Phone</p><p className="text-lg font-medium text-[#0B4550]">{selectedClient.phone || 'N/A'}</p></div>
                            <div><p className="text-sm font-medium text-[#898A8D]">Date of Birth</p><p className="text-lg font-medium text-[#0B4550]">{selectedClient.dob || 'N/A'}</p></div>
                            <div><p className="text-sm font-medium text-[#898A8D]">Client Type</p><p className="text-lg font-medium text-[#0B4550]">{selectedClient.client_type || 'N/A'}</p></div>
                            <div><p className="text-sm font-medium text-[#898A8D]">Member Status</p><p className="text-lg font-medium text-[#0B4550]">{selectedClient.member_status || 'N/A'}</p></div>
                            
                            <div className="col-span-1 md:col-span-2 border-t border-gray-100 pt-4 mt-2">
                              <p className="font-bold text-[#0B4550] mb-2">Package Details</p>
                            </div>
                            <div className="col-span-1 md:col-span-2"><p className="text-sm font-medium text-[#898A8D]">Package Type</p><p className="text-lg font-medium text-[#0B4550]">{selectedClient.package || (selectedClient.unlimited ? 'Unlimited' : 'None')}</p></div>
                            <div><p className="text-sm font-medium text-[#898A8D]">Sessions (Used/Total)</p><p className="text-lg font-medium text-[#0B4550]">{(selectedClient.initial_package || 0) - (selectedClient.remaining_package || 0)} / {selectedClient.initial_package || 0}</p></div>
                            <div><p className="text-sm font-medium text-[#898A8D]">Date Paid</p><p className="text-lg font-medium text-[#0B4550]">{selectedClient.date_paid || 'N/A'}</p></div>
                            <div><p className="text-sm font-medium text-[#898A8D]">Expiry Date</p><p className="text-lg font-medium text-[#0B4550]">{selectedClient.expiry || 'No date set'}</p></div>

                             <div className="col-span-1 md:col-span-2 mt-2">
                              <button 
                                onClick={handleRenewPackage}
                                className="w-full bg-[#0B4550] text-[#E6FF2B] py-4 rounded-2xl font-extrabold text-lg hover:scale-[1.02] transition-all shadow-lg flex items-center justify-center gap-3 group"
                              >
                                <RotateCw size={22} className="group-hover:rotate-180 transition-transform duration-500" />
                                Renew Package
                              </button>
                            </div>

                            <div className="col-span-1 md:col-span-2 mt-1">
                              {selectedClient.member_status === 'Follow Up' ? (
                                <button 
                                  onClick={() => handleToggleFollowUp(selectedClient)}
                                  className="w-full bg-[#E6FF2B] text-[#0B4550] py-4 rounded-2xl font-extrabold text-lg hover:scale-[1.02] transition-all shadow-md flex items-center justify-center gap-3 group"
                                >
                                  <Check size={22} />
                                  Mark Follow Up as Done
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleToggleFollowUp(selectedClient)}
                                  className="w-full bg-[#F9F7F2] border-2 border-[#0B4550] text-[#0B4550] py-4 rounded-2xl font-extrabold text-lg hover:bg-[#0B4550]/5 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group"
                                >
                                  <Clock size={22} />
                                  Move to Follow Up
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-[#0B4550] rounded-3xl p-4 md:p-6 shadow-md">
                      <h3 className="text-white font-medium text-xl mb-2">Personal Portal</h3>
                      <p className="text-white/70 text-sm font-medium mb-4">Share this link for {selectedClient.name} to view their progress.</p>
                      <div className="flex bg-white/10 rounded-xl p-2 border border-white/20">
                        <input type="text" readOnly value={`${window.location.origin}/client/${selectedClient.id}`} className="bg-transparent text-white w-full px-2 outline-none font-medium text-sm" />
                        <button onClick={handleCopyLink} className="bg-[#E6FF2B] text-[#0B4550] p-2 rounded-lg hover:brightness-95 transition-all flex items-center justify-center shrink-0 w-10 h-10">
                          {copiedLink ? <Check size={20} /> : <Copy size={20} />}
                        </button>
                      </div>
                    </div>

                    {selectedClient.member_status === 'Trial' && (
                      <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-gray-100 flex flex-col gap-4 md:gap-6 animate-in fade-in duration-300">
                        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 md:gap-0 pb-4 border-b border-gray-100">
                          <h3 className="font-medium text-2xl text-[#0B4550] flex items-center gap-2">
                            <Sparkles size={22} className="text-[#0B4550]" /> Trial Conversion Hub
                          </h3>
                          <span className="bg-[#E6FF2B] text-[#0B4550] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Prospect</span>
                        </div>
                        
                        {/* Pipeline Checklist */}
                        <div className="flex flex-col gap-4">
                          <p className="text-xs font-bold text-[#898A8D] uppercase tracking-wider">Trial Progression Pipeline</p>
                          <div className="flex flex-col gap-3.5">
                            {[
                              "Scheduled Trial Session",
                              "Attended Trial Session",
                              "Sent Follow-up message",
                              "Final Decision Made"
                            ].map((step, idx) => {
                              const isChecked = trialMeta.checklist[idx];
                              return (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    const nextChecklist = [...trialMeta.checklist];
                                    nextChecklist[idx] = !isChecked;
                                    handleSaveTrialMeta({ ...trialMeta, checklist: nextChecklist });
                                  }}
                                  className="flex items-center gap-3 text-left group hover:bg-[#F9F7F2] p-2 rounded-xl transition-all"
                                >
                                  {isChecked ? (
                                    <CheckSquare size={22} className="text-[#0B4550] shrink-0" />
                                  ) : (
                                    <Square size={22} className="text-[#898A8D] group-hover:text-[#0B4550] shrink-0" />
                                  )}
                                  <span className={`text-base font-medium ${isChecked ? 'line-through text-[#898A8D]' : 'text-[#0B4550]'}`}>
                                    {step}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Roster Status Pills */}
                        <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                          <p className="text-xs font-bold text-[#898A8D] uppercase tracking-wider mb-2">Follow-up Pipeline Status</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-4 gap-2">
                            {['Pending', 'Contacted', 'Completed', 'Lost'].map((st) => {
                              const isActive = trialMeta.status === st;
                              const colors = 
                                st === 'Pending' ? (isActive ? 'bg-[#898A8D] text-white' : 'bg-gray-100 text-[#898A8D]') :
                                st === 'Contacted' ? (isActive ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600') :
                                st === 'Completed' ? (isActive ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600') :
                                (isActive ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-600');
                              return (
                                <button
                                  key={st}
                                  onClick={() => handleSaveTrialMeta({ ...trialMeta, status: st })}
                                  className={`py-2 px-1 rounded-xl text-xs font-bold text-center transition-all hover:scale-[1.03] ${colors}`}
                                >
                                  {st}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Convert Call to Action */}
                        <button
                          onClick={() => handleConvertToMember(selectedClient)}
                          className="w-full mt-2 bg-[#0B4550] text-[#E6FF2B] py-4 rounded-2xl font-extrabold text-lg hover:scale-[1.02] transition-all shadow-lg flex items-center justify-center gap-3 group relative overflow-hidden"
                        >
                          <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <Sparkles size={20} className="animate-pulse" />
                          Convert to Full Member
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-3 flex flex-col gap-4 md:gap-6">
                    <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-gray-100 flex flex-col relative h-[440px] shrink-0 overflow-hidden">
                      {/* Tabs Header */}
                      <div className="flex border-b border-gray-100 mb-6 gap-6 shrink-0">
                        <button 
                          onClick={() => setClientDetailTab('notes')}
                          className={`pb-3 text-xl font-bold transition-all relative ${clientDetailTab === 'notes' ? 'text-[#0B4550]' : 'text-[#898A8D]'}`}
                        >
                          Trainer Notes
                          {clientDetailTab === 'notes' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B4550] rounded-full"></span>}
                        </button>
                        <button 
                          onClick={() => setClientDetailTab('workouts')}
                          className={`pb-3 text-xl font-bold transition-all relative ${clientDetailTab === 'workouts' ? 'text-[#0B4550]' : 'text-[#898A8D]'}`}
                        >
                          Workout Logs
                          {clientDetailTab === 'workouts' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B4550] rounded-full"></span>}
                        </button>
                      </div>

                      {clientDetailTab === 'notes' ? (
                        <div className="flex flex-col flex-1 overflow-hidden">
                          <textarea 
                            value={clientNotes}
                            onChange={(e) => setClientNotes(e.target.value)}
                            className="w-full flex-1 bg-[#F9F7F2] border-2 border-gray-100 rounded-2xl p-4 md:p-6 text-lg font-medium text-[#0B4550] focus:outline-none focus:border-[#E6FF2B] transition-colors resize-none" 
                            placeholder="Add workout notes, injury updates, or goals here..."
                          ></textarea>
                          <div className="flex justify-end items-center gap-4 mt-4 shrink-0">
                            {notesSavedMsg && <span className="text-emerald-500 font-medium flex items-center gap-1"><Check size={18}/> Saved!</span>}
                            <button 
                              onClick={handleSaveNotes}
                              disabled={isSavingNotes}
                              className="bg-[#0B4550] text-white px-5 md:px-8 py-2 rounded-xl font-medium text-base hover:bg-[#0B4550]/90 transition-all shadow-sm flex items-center gap-2"
                            >
                              {isSavingNotes ? <RotateCw className="animate-spin" size={18}/> : <Save size={18}/>}
                              Save Notes
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden">
                          {/* Left Pane: Workouts List */}
                          <div className="col-span-1 border-r border-gray-100 flex flex-col pr-4 overflow-hidden h-full">
                            <button 
                              onClick={handleCreateWorkoutLog}
                              className="w-full bg-[#0B4550] text-[#E6FF2B] py-2 px-3 rounded-xl font-bold text-sm hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5 shadow-sm shrink-0"
                            >
                              <Plus size={16} /> New Workout
                            </button>
                            
                            <div className="flex-1 overflow-y-auto space-y-1.5 mt-3 pr-1 no-scrollbar">
                              {workoutLogs.map((log) => {
                                const isSelected = activeWorkoutLogId === log.id;
                                return (
                                  <div 
                                    key={log.id} 
                                    onClick={() => setActiveWorkoutLogId(log.id)}
                                    className={`p-3 rounded-xl cursor-pointer transition-all flex flex-col text-left group border ${isSelected ? 'bg-[#F9F7F2] border-gray-200 shadow-xs' : 'border-transparent hover:bg-gray-50'}`}
                                  >
                                    <div className="flex justify-between items-center gap-1">
                                      <span className="text-[10px] text-[#898A8D] font-bold">{log.date || 'No Date'}</span>
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); handleDeleteWorkoutLog(log.id); }}
                                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-0.5 rounded transition-opacity"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                    <span className="text-sm font-bold text-[#0B4550] mt-1 truncate">{log.title || 'Untitled Workout'}</span>
                                    <span className="text-xs text-[#898A8D] truncate mt-0.5 font-medium">{log.content || 'No details...'}</span>
                                  </div>
                                );
                              })}
                              {workoutLogs.length === 0 && (
                                <div className="text-center py-12 text-xs text-gray-400 font-semibold">No workouts logged yet.</div>
                              )}
                            </div>
                          </div>

                          {/* Right Pane: Workout Log Editor */}
                          <div className="col-span-2 flex flex-col overflow-hidden h-full">
                            {(() => {
                              const activeLog = workoutLogs.find(l => l.id === activeWorkoutLogId);
                              if (!activeLog) {
                                return (
                                  <div className="flex flex-col items-center justify-center flex-1 text-center text-gray-400 gap-2">
                                    <FileText size={36} className="stroke-1" />
                                    <p className="text-xs font-semibold">Select or create a workout to view/edit details.</p>
                                  </div>
                                );
                              }
                              return (
                                <div className="flex flex-col flex-1 overflow-hidden h-full">
                                  <div className="flex gap-2 items-center mb-3 shrink-0">
                                    <input 
                                      type="text" 
                                      value={activeLog.title}
                                      onChange={(e) => handleUpdateActiveWorkoutLog('title', e.target.value)}
                                      className="text-lg font-black text-[#0B4550] bg-transparent border-none outline-none flex-1 placeholder-gray-300"
                                      placeholder="Workout Title..."
                                    />
                                    <input 
                                      type="text"
                                      value={activeLog.date}
                                      onChange={(e) => handleUpdateActiveWorkoutLog('date', e.target.value)}
                                      className="text-xs font-bold text-[#898A8D] bg-transparent border-none outline-none w-28 text-right placeholder-gray-300"
                                      placeholder="Date (e.g. 15/6/2026)"
                                    />
                                  </div>
                                  <textarea 
                                    value={activeLog.content}
                                    onChange={(e) => handleUpdateActiveWorkoutLog('content', e.target.value)}
                                    className="w-full flex-1 bg-[#F9F7F2]/50 border border-gray-100 rounded-2xl p-4 text-sm font-semibold text-[#0B4550] focus:outline-none focus:border-[#E6FF2B] transition-colors resize-none overflow-y-auto"
                                    placeholder="Start writing workout details (e.g., sets, reps, notes)..."
                                  />
                                  <div className="flex justify-end gap-3 items-center shrink-0 border-t border-gray-50 pt-3 mt-3">
                                    {workoutLogsSavedMsg && <span className="text-emerald-500 text-xs font-bold flex items-center gap-1"><Check size={14}/> Saved!</span>}
                                    <button 
                                      onClick={handleSaveWorkoutLogs}
                                      disabled={isSavingWorkoutLogs}
                                      className="bg-[#0B4550] text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-[#0B4550]/90 transition-all flex items-center gap-1.5"
                                    >
                                      {isSavingWorkoutLogs ? <RotateCw className="animate-spin" size={14}/> : <Save size={14}/>}
                                      Save Logs
                                    </button>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
                      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 md:gap-0 mb-6">
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
                          <div className="text-center py-6 md:py-10">
                            <p className="text-sm font-medium text-[#898A8D]">No activity recorded yet.</p>
                          </div>
                        ) : (
                          Object.values(groupedHistory)
                            .sort((a, b) => b.year - a.year)
                            .map((yearData) => (
                              <div key={yearData.year} className="space-y-6">
                                {/* YEAR HEADER */}
                                <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 md:gap-0 border-b border-gray-100 pb-3 mt-4">
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
                                            className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 md:gap-0 bg-[#F9F7F2] p-4 rounded-2xl border border-gray-100 shadow-sm sticky top-0 z-10 cursor-pointer hover:bg-gray-100 transition-colors group/header"
                                          >
                                            <div className="flex items-center gap-3">
                                              <ChevronRight size={18} className={`text-[#0B4550] transition-transform duration-300 ${isMonthExpanded(monthYearKey) ? 'rotate-90' : ''}`} />
                                              <h4 className="font-bold text-[#0B4550] text-sm uppercase tracking-wider">{monthData.monthName}</h4>
                                            </div>
                                            <div className="flex gap-4 md:gap-6">
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
                                                    <div className="flex flex-col md:flex-row md:justify-between items-start gap-4 md:gap-0 mb-1">
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
                                                        {item.dbTable === 'bookings' && (
                                                          <button 
                                                            onClick={(e) => { 
                                                              e.stopPropagation(); 
                                                              const parsed = parseNotesAndMetadata(selectedClient?.notes);
                                                              const currentNote = parsed.sessionNotes[item.id] || '';
                                                              handleOpenSessionNote(item.id, item.title, currentNote); 
                                                            }}
                                                            className="text-gray-300 hover:text-[#0B4550] opacity-0 group-hover:opacity-100 transition-opacity"
                                                            title="Add/Edit session workout note"
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
                                                    
                                                    {/* DISPLAY WORKOUT NOTE IF PRESENT */}
                                                    {(() => {
                                                      if (item.dbTable === 'bookings') {
                                                        const parsed = parseNotesAndMetadata(selectedClient?.notes);
                                                        const sessionNote = parsed.sessionNotes[item.id];
                                                        if (sessionNote) {
                                                          return (
                                                            <div className="mt-2 mb-2 bg-[#F9F7F2] border border-gray-100 rounded-2xl p-4 text-[#0B4550] relative">
                                                              <span className="text-[#898A8D] font-extrabold block text-xs uppercase tracking-wider mb-1.5">Workout Note:</span>
                                                              <p className="text-xs font-semibold text-[#0B4550] leading-relaxed whitespace-pre-wrap">{sessionNote}</p>
                                                            </div>
                                                          );
                                                        }
                                                      }
                                                      return null;
                                                    })()}
                                                    
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
        )
      )}

{/* VIEW: FULL CALENDAR */}
{activePage === 'Calendar' && (() => {
  const getDaysOfWeek = (date) => {
    const current = new Date(date);
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(current.setDate(diff));
    const days = [];
    for (let i = 0; i < 7; i++) {
      const next = new Date(monday);
      next.setDate(monday.getDate() + i);
      days.push(next);
    }
    return days;
  };

  const weekDays = getDaysOfWeek(currentCalendarDate);
  const startMonth = weekDays[0].toLocaleDateString('en-US', { month: 'long' });
  const endMonth = weekDays[6].toLocaleDateString('en-US', { month: 'long' });
  const startYear = weekDays[0].getFullYear();
  
  const monthYearLabel = startMonth === endMonth 
    ? `${startMonth} ${startYear}` 
    : `${weekDays[0].toLocaleDateString('en-US', { month: 'short' })} – ${weekDays[6].toLocaleDateString('en-US', { month: 'short' })} ${startYear}`;

  const hours = Array.from({ length: 18 }, (_, i) => i + 6); // 6 AM to 11 PM

  const getSessionsForDay = (dateObj) => {
    return sessions.filter(s => {
      if (!s.date) return false;
      const [yr, mo, dy] = s.date.split('-').map(num => parseInt(num, 10));
      const sDate = new Date(yr, mo - 1, dy);
      return sDate.getDate() === dateObj.getDate() && 
             sDate.getMonth() === dateObj.getMonth() && 
             sDate.getFullYear() === dateObj.getFullYear();
    });
  };

  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 540; // 9:00 AM fallback
    const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    let hours = 9;
    let minutes = 0;
    if (match) {
      hours = parseInt(match[1], 10);
      minutes = parseInt(match[2], 10);
      const ampm = match[3].toUpperCase();
      if (ampm === 'PM' && hours < 12) {
        hours += 12;
      } else if (ampm === 'AM' && hours === 12) {
        hours = 0;
      }
    } else {
      const parts = timeStr.split(':');
      if (parts.length >= 2) {
        hours = parseInt(parts[0], 10) || 9;
        minutes = parseInt(parts[1].replace(/\D/g, ''), 10) || 0;
        if (timeStr.toLowerCase().includes('pm') && hours < 12) {
          hours += 12;
        } else if (timeStr.toLowerCase().includes('am') && hours === 12) {
          hours = 0;
        }
      }
    }
    return hours * 60 + minutes;
  };



  const getSessionTheme = (s) => {
    const title = (s.title || '').toLowerCase();
    const type = (s.type || '').toLowerCase();
    const isPast = isSessionPast(s);
    
    let colorClass = "bg-cyan-50 border-cyan-500 text-cyan-800 hover:bg-cyan-100/80";
    if (title.includes('muay') || title.includes('thai') || title.includes('mtr') || type.includes('muay')) {
      colorClass = "bg-rose-50 border-rose-500 text-rose-800 hover:bg-rose-100/80";
    } else if (title.includes('group') || type.includes('group') || title.includes('class')) {
      colorClass = "bg-teal-50 border-teal-500 text-teal-800 hover:bg-teal-100/80";
    } else if (title.includes('pt') || title.includes('personal') || title.includes('coach') || type.includes('personal')) {
      colorClass = "bg-indigo-50 border-indigo-500 text-indigo-800 hover:bg-indigo-100/80";
    } else if (title.includes('open') || title.includes('gym') || title.includes('trial')) {
      colorClass = "bg-amber-50 border-amber-500 text-amber-800 hover:bg-amber-100/80";
    }
    
    return {
      classes: `absolute left-1.5 right-1.5 rounded-xl border-l-4 p-2 shadow-sm transition-all overflow-hidden flex flex-col group cursor-pointer ${colorClass} ${isPast ? 'opacity-65' : ''}`,
      isPast
    };
  };

  return (
    <div className="animate-in fade-in duration-500 flex flex-col h-full">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 md:gap-0 mb-4">
        <div className="flex items-center gap-4 flex-wrap">
          <h3 className="text-2xl font-extrabold text-[#0B4550] tracking-tight">
            {monthYearLabel}
          </h3>
          <button 
            onClick={() => setCurrentCalendarDate(new Date())}
            className="px-4 py-2 bg-[#F9F7F2] text-[#0B4550] hover:bg-gray-200 rounded-xl font-bold text-sm transition-all shadow-sm"
          >
            Today
          </button>
          <div className="flex gap-1.5">
            <button 
              onClick={() => {
                const prev = new Date(currentCalendarDate);
                prev.setDate(prev.getDate() - 7);
                setCurrentCalendarDate(prev);
              }} 
              className="w-8 h-8 bg-[#F9F7F2] rounded-full flex items-center justify-center text-[#0B4550] hover:bg-gray-200 transition-all"
            >
              <ChevronLeft size={18}/>
            </button>
            <button 
              onClick={() => {
                const next = new Date(currentCalendarDate);
                next.setDate(next.getDate() + 7);
                setCurrentCalendarDate(next);
              }} 
              className="w-8 h-8 bg-[#F9F7F2] rounded-full flex items-center justify-center text-[#0B4550] hover:bg-gray-200 transition-all"
            >
              <ChevronRight size={18}/>
            </button>
          </div>
        </div>
        <button 
          onClick={() => setShowGoogleSyncModal(true)} 
          className={`border-2 px-4 md:px-6 py-3 rounded-2xl font-bold flex items-center gap-3 transition-all ${
            isGcalConnected 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm' 
              : isGcalExpired
              ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-sm'
              : 'bg-white border-gray-100 text-[#0B4550] hover:border-[#0B4550] hover:shadow-md'
          }`}
        >
          {isGcalConnected ? (
            <>
              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] font-black tracking-tighter">✓</div>
              Google Calendar Connected
            </>
          ) : isGcalExpired ? (
            <>
              <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-[10px] font-black tracking-tighter">⚠️</div>
              Calendar Link Expired
            </>
          ) : (
            <>
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] font-black tracking-tighter">G</div>
              Connect Google Calendar
            </>
          )}
        </button>
      </div>

      {/* Main Weekly hour view card container */}
      <div className="bg-white rounded-[2.5rem] p-4 md:p-6 shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
        
        {/* Mobile Horizontal Day Selector (Single Day Mode selector) */}
        <div className="flex md:hidden justify-between items-center bg-[#F9F7F2] rounded-2xl p-2 mb-4 border border-gray-100">
          {weekDays.map((dateObj, i) => {
            const isTodayObj = new Date().toDateString() === dateObj.toDateString();
            const isSelectedObj = currentCalendarDate.toDateString() === dateObj.toDateString();
            const dayInitial = ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i];
            return (
              <button
                key={`mobile-day-${i}`}
                onClick={() => setCurrentCalendarDate(dateObj)}
                className={`flex-1 flex flex-col items-center py-2 rounded-xl transition-all ${
                  isSelectedObj 
                    ? 'bg-[#0B4550] text-[#E6FF2B] scale-105 shadow-md' 
                    : isTodayObj 
                    ? 'text-[#0B4550] border border-[#0B4550]/20' 
                    : 'text-[#898A8D]'
                }`}
              >
                <span className="text-[10px] font-black tracking-widest mb-1 opacity-80">{dayInitial}</span>
                <span className="text-base font-extrabold">{dateObj.getDate()}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic hour grid scroll container */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative max-h-[calc(100vh-270px)] border border-gray-50 rounded-[2rem]">
          
          {/* Header Row (Mon-Sun on desktop, single day on mobile) */}
          <div className="sticky top-0 z-30 bg-white border-b border-gray-100 flex shadow-sm">
            {/* Hour column spacing placeholder */}
            <div className="w-16 shrink-0 border-r border-gray-100 bg-gray-50/50"></div>
            
            {/* Desktop 7 Column Day headers */}
            <div className="hidden md:flex flex-1">
              {weekDays.map((dateObj, i) => {
                const isTodayObj = new Date().toDateString() === dateObj.toDateString();
                const isSelectedObj = currentCalendarDate.toDateString() === dateObj.toDateString();
                const dayLabel = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][i];
                return (
                  <div 
                    key={`header-day-${i}`} 
                    onClick={() => setCurrentCalendarDate(dateObj)}
                    className={`flex-1 text-center py-4 border-r border-gray-100 last:border-r-0 cursor-pointer hover:bg-gray-50/50 transition-colors flex flex-col items-center justify-center ${
                      isSelectedObj ? 'bg-[#0B4550]/5' : ''
                    }`}
                  >
                    <span className="text-xs font-black tracking-widest text-[#898A8D] mb-1">{dayLabel}</span>
                    <span className={`text-base font-black w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isTodayObj 
                        ? 'bg-[#0B4550] text-[#E6FF2B]' 
                        : isSelectedObj 
                        ? 'bg-gray-200 text-[#0B4550]' 
                        : 'text-[#0B4550]'
                    }`}>
                      {dateObj.getDate()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mobile Column Day Header */}
            <div className="flex md:hidden flex-1 text-left py-4 px-4 bg-gray-50/50 justify-between items-center">
              <span className="text-base font-black text-[#0B4550]">
                {currentCalendarDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                Selected Day View
              </span>
            </div>
          </div>

          {/* Core scrollable weekly grid body */}
          <div className="relative flex min-h-[1020px]">
            
            {/* Time Labels Column */}
            <div className="w-16 shrink-0 border-r border-gray-100 bg-gray-50/20 flex flex-col justify-between py-1.5 relative select-none">
              {hours.map(h => {
                const displayHour = h === 12 ? '12 PM' : h > 12 ? `${h - 12} PM` : `${h} AM`;
                return (
                  <div 
                    key={`hour-label-${h}`} 
                    className="h-[60px] text-[10px] font-black text-[#898A8D] pr-3 text-right flex items-start justify-end"
                    style={{ transform: 'translateY(-6px)' }}
                  >
                    {displayHour}
                  </div>
                );
              })}
            </div>

            {/* Day columns layers (where hourly rows + absolute sessions sit) */}
            <div className="flex-1 flex relative">
              
              {/* background horizontal hour row lines (drawn once, overlaying the background) */}
              <div className="absolute inset-0 pointer-events-none flex flex-col z-0">
                {hours.map(h => (
                  <div key={`grid-row-${h}`} className="h-[60px] border-b border-gray-100/80 last:border-b-0 w-full"></div>
                ))}
              </div>

              {/* Desktop view: 7 separate columns overlay */}
              <div className="hidden md:flex flex-1 relative z-10">
                {weekDays.map((dateObj, colIdx) => {
                  const daySessions = getSessionsForDay(dateObj);
                  return (
                    <div 
                      key={`col-day-${colIdx}`} 
                      className="flex-1 border-r border-gray-100 last:border-r-0 relative h-[1020px] hover:bg-gray-50/20 transition-colors"
                    >
                      {(() => {
                        const isToday = currentTime.toDateString() === dateObj.toDateString();
                        const currentMins = currentTime.getHours() * 60 + currentTime.getMinutes();
                        const lineTop = currentMins - (6 * 60); // minutes from 6 AM
                        const isLineVisible = lineTop >= 0 && lineTop <= 1020;
                        
                        if (isToday && isLineVisible) {
                          return (
                            <div 
                              className="absolute left-0 right-0 flex items-center z-20 pointer-events-none"
                              style={{ top: `${lineTop}px` }}
                            >
                              <div className="w-2.5 h-2.5 rounded-full bg-[#EA4335] -ml-[5px] shrink-0 shadow-sm z-30"></div>
                              <div className="flex-1 h-0.5 bg-[#EA4335] shadow-[0_1px_2px_rgba(0,0,0,0.15)] z-20"></div>
                            </div>
                          );
                        }
                        return null;
                      })()}
                      {daySessions.map(s => {
                        const startMins = parseTimeToMinutes(s.time);
                        const top = startMins - (6 * 60); // minutes from 6 AM
                        const duration = parseInt(s.duration, 10) || 60;
                        const theme = getSessionTheme(s);
                        
                        return (
                          <div
                            key={s.id}
                            style={{ 
                              top: `${top}px`, 
                              height: `${duration}px`,
                              minHeight: '38px' 
                            }}
                            className={theme.classes}
                            onClick={() => {
                              const [yr, mo, dy] = s.date.split('-').map(num => parseInt(num, 10));
                              const sessionDate = new Date(yr, mo - 1, dy);
                              setSelectedScheduleDate(sessionDate);
                              setSelectedSession(s);
                              setActivePage('Schedule');
                            }}
                          >
                            <span className={`text-[12px] font-black tracking-tight leading-none mb-1 truncate ${theme.isPast ? 'line-through opacity-70' : ''}`}>
                              {getSessionDisplayTitle(s)}
                            </span>
                            <span className="text-[9px] font-bold tracking-tight opacity-75 truncate">
                              {s.time} ({s.duration || '60m'})
                            </span>
                            {duration > 45 && s.location && (
                              <span className="text-[9px] font-bold opacity-60 truncate mt-0.5">
                                📍 {s.location.split(' | Coach: ')[0]}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* Mobile view: exactly 1 day column container overlay */}
              <div className="flex md:hidden flex-1 relative z-10">
                {(() => {
                  const daySessions = getSessionsForDay(currentCalendarDate);
                  return (
                    <div className="flex-1 relative h-[1020px]">
                      {(() => {
                        const isToday = currentTime.toDateString() === currentCalendarDate.toDateString();
                        const currentMins = currentTime.getHours() * 60 + currentTime.getMinutes();
                        const lineTop = currentMins - (6 * 60); // minutes from 6 AM
                        const isLineVisible = lineTop >= 0 && lineTop <= 1020;
                        
                        if (isToday && isLineVisible) {
                          return (
                            <div 
                              className="absolute left-0 right-0 flex items-center z-20 pointer-events-none"
                              style={{ top: `${lineTop}px` }}
                            >
                              <div className="w-2.5 h-2.5 rounded-full bg-[#EA4335] -ml-[5px] shrink-0 shadow-sm z-30"></div>
                              <div className="flex-1 h-0.5 bg-[#EA4335] shadow-[0_1px_2px_rgba(0,0,0,0.15)] z-20"></div>
                            </div>
                          );
                        }
                        return null;
                      })()}
                      {daySessions.map(s => {
                        const startMins = parseTimeToMinutes(s.time);
                        const top = startMins - (6 * 60); // minutes from 6 AM
                        const duration = parseInt(s.duration, 10) || 60;
                        const theme = getSessionTheme(s);
                        
                        return (
                          <div
                            key={s.id}
                            style={{ 
                              top: `${top}px`, 
                              height: `${duration}px`,
                              minHeight: '38px' 
                            }}
                            className={theme.classes}
                            onClick={() => {
                              const [yr, mo, dy] = s.date.split('-').map(num => parseInt(num, 10));
                              const sessionDate = new Date(yr, mo - 1, dy);
                              setSelectedScheduleDate(sessionDate);
                              setSelectedSession(s);
                              setActivePage('Schedule');
                            }}
                          >
                            <span className={`text-[12px] font-black tracking-tight leading-none mb-1 truncate ${theme.isPast ? 'line-through opacity-70' : ''}`}>
                              {getSessionDisplayTitle(s)}
                            </span>
                            <span className="text-[10px] font-bold tracking-tight opacity-75 truncate">
                              {s.time} ({s.duration || '60m'})
                            </span>
                            {duration > 45 && s.location && (
                              <span className="text-[9px] font-bold opacity-60 truncate mt-0.5">
                                📍 {s.location.split(' | Coach: ')[0]}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
})()}

        {/* VIEW: SCHEDULE (NOW LIVE!) */}
        {activePage === 'Schedule' && (
           <div className="animate-in fade-in duration-500 flex flex-col h-full">
            {/* MOBILE SCHEDULE CONTROLS */}
            <div className="md:hidden flex flex-col gap-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-white">
                    {selectedScheduleDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </h2>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedScheduleDate(new Date())}
                    className="px-3 py-1.5 bg-[#141414] text-[#E6FF2B] border border-[#222] rounded-xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                  >
                    Today
                  </button>
                  <button onClick={() => setShowEventModal(true)} className="bg-[#E6FF2B] text-[#0A0A0A] w-9 h-9 rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-all">
                    <Plus size={18} strokeWidth={3} />
                  </button>
                </div>
              </div>

              {/* Horizontal Date Scroller */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                {getWeekDays(selectedScheduleDate).map((dayObj) => {
                  const isDayActive = selectedScheduleDate.toDateString() === dayObj.toDateString();
                  const dayNum = dayObj.getDate();
                  const dayName = dayObj.toLocaleDateString('en-US', { weekday: 'short' });
                  
                  return (
                    <button 
                      key={dayObj.toISOString()} 
                      onClick={() => setSelectedScheduleDate(dayObj)}
                      className={`flex-shrink-0 flex flex-col items-center justify-center w-14 h-16 rounded-[1.25rem] transition-all border ${
                        isDayActive 
                          ? 'bg-[#E6FF2B] border-[#E6FF2B] text-[#0A0A0A] shadow-lg scale-105' 
                          : 'bg-[#141414] border-[#222] text-gray-500 hover:text-white'
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest mb-0.5">{dayName}</span>
                      <span className="text-lg font-black leading-none">{dayNum}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DESKTOP SCHEDULE CONTROLS */}
            <div className="hidden md:flex flex-row justify-between items-center mb-8 bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 md:gap-6 px-4">
                <ChevronLeft 
                  size={28} 
                  className="text-[#898A8D] cursor-pointer hover:text-[#0B4550] transition-colors" 
                  onClick={() => {
                    const newDate = new Date(selectedScheduleDate);
                    newDate.setDate(newDate.getDate() - 7);
                    setSelectedScheduleDate(newDate);
                  }}
                />
                <h2 className="text-2xl font-medium text-[#0B4550] w-56 text-center">
                  {selectedScheduleDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <ChevronRight 
                  size={28} 
                  className="text-[#898A8D] cursor-pointer hover:text-[#0B4550] transition-colors" 
                  onClick={() => {
                    const newDate = new Date(selectedScheduleDate);
                    newDate.setDate(newDate.getDate() + 7);
                    setSelectedScheduleDate(newDate);
                  }}
                />
                <button 
                  onClick={() => setSelectedScheduleDate(new Date())}
                  className="px-4 py-2 bg-[#F9F7F2] text-[#0B4550] hover:bg-gray-200 rounded-xl font-bold text-sm transition-all shadow-sm"
                >
                  Today
                </button>
              </div>
              <div className="flex gap-2 flex-1 justify-center border-l border-r border-gray-100 px-4 md:px-6">
                {getWeekDays(selectedScheduleDate).map((dayObj) => {
                  const isDayActive = selectedScheduleDate.toDateString() === dayObj.toDateString();
                  const dayNum = dayObj.getDate();
                  const dayName = dayObj.toLocaleDateString('en-US', { weekday: 'short' });
                  
                  return (
                    <button 
                      key={dayObj.toISOString()} 
                      onClick={() => setSelectedScheduleDate(dayObj)}
                      className="outline-none"
                    >
                      <Day date={dayNum} day={dayName} active={isDayActive} />
                    </button>
                  );
                })}
              </div>
              <div className="px-4">
                <button onClick={() => setShowEventModal(true)} className="bg-[#E6FF2B] text-[#0B4550] px-4 md:px-6 py-3 rounded-xl font-medium text-lg flex items-center gap-2 hover:brightness-95 transition-all shadow-sm">
                  <Plus size={24} /> New Event
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 flex-1 pb-10">
              <div className="lg:col-span-2 space-y-6">
                <h3 className="font-medium text-2xl text-[#0B4550] mb-4">
                  Sessions on {selectedScheduleDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </h3>
                <div className="space-y-4">
                  {(() => {
                    const daySessions = sessions.filter(session => {
                      if (!session.date) return false;
                      const [yr, mo, dy] = session.date.split('-').map(num => parseInt(num, 10));
                      const sDate = new Date(yr, mo - 1, dy);
                      return sDate.getDate() === selectedScheduleDate.getDate() &&
                             sDate.getMonth() === selectedScheduleDate.getMonth() &&
                             sDate.getFullYear() === selectedScheduleDate.getFullYear();
                    }).sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));

                    if (daySessions.length === 0) {
                      return (
                        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                          <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
                          <h2 className="text-2xl font-medium text-[#0B4550] mb-2">No sessions scheduled for this day</h2>
                          <p className="text-[#898A8D]">Click "New Event" to schedule a class on this day.</p>
                        </div>
                      );
                    }

                    return daySessions.map((session) => {
                      const isSelected = selectedSession?.id === session.id;
                      const is1on1 = session.type === '1-on-1';
                      const isBlocked = session.type === 'Blocked';
                      const isPast = isSessionPast(session);

                      const locationParts = session.location ? session.location.split(' | Coach: ') : [];
                      const displayLocation = locationParts[0] || 'Main Floor';
                      const displayCoach = locationParts[1] || '';

                      return (
                        <div key={session.id} onClick={() => { setSelectedSession(session); if (isMobile) setShowMobileRosterDrawer(true); }}>
                          
                          {/* MOBILE SESSION CARD */}
                          <div className={`md:hidden flex gap-4 items-center group transition-all ${isBlocked ? 'opacity-50' : ''} ${isPast ? 'opacity-60' : ''}`}>
                            <div className="w-16 text-right shrink-0">
                              <p className={`text-lg font-black ${isSelected ? 'text-[#E6FF2B]' : 'text-white'} ${isPast ? 'line-through opacity-50' : ''}`}>{session.time}</p>
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{session.duration}</p>
                            </div>
                            <div className={`flex-1 rounded-[1.5rem] p-4 shadow-xl border transition-all relative overflow-hidden ${isSelected ? 'scale-[1.02] bg-[#1A1A1A] border-[#E6FF2B]/50 shadow-[0_0_15px_rgba(230,255,43,0.1)]' : is1on1 ? 'bg-[#0A0A0A] border-[#E6FF2B]/20' : isBlocked ? 'bg-transparent border-dashed border-[#333]' : 'bg-[#141414] border-[#222]'}`}>
                              <div className="flex flex-col gap-2 relative z-10">
                                <div className="flex justify-between items-start">
                                  <span className={`inline-block px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${is1on1 ? 'bg-[#E6FF2B] text-[#0A0A0A]' : 'bg-[#222] text-white'}`}>
                                    {session.type}
                                  </span>
                                  {!isBlocked && (
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${is1on1 ? 'text-[#E6FF2B]' : 'text-gray-500'}`}>{session.attendees ? session.attendees.length : 0} / {session.capacity}</span>
                                  )}
                                </div>
                                <h3 className={`text-lg font-black leading-tight ${is1on1 ? 'text-white' : 'text-gray-200'} ${isPast ? 'line-through opacity-60' : ''}`}>{getSessionDisplayTitle(session)}</h3>
                                <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${is1on1 ? 'text-gray-400' : 'text-gray-600'}`}>
                                  <MapPin size={12} className="shrink-0" /> 
                                  <span className="truncate">{displayLocation} {displayCoach && `• ${displayCoach}`}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* DESKTOP SESSION CARD */}
                          <div className={`hidden md:flex gap-6 items-center cursor-pointer group transition-all ${isBlocked ? 'opacity-50' : ''} ${isPast ? 'opacity-70 hover:opacity-100' : ''}`}>
                            <div className="w-24 text-right shrink-0">
                              <p className={`text-xl font-medium ${isSelected ? 'text-[#0B4550]' : 'text-[#898A8D]'} ${isPast ? 'line-through opacity-60' : ''}`}>{session.time}</p>
                              <p className="text-sm font-medium text-[#898A8D]">{session.duration}</p>
                            </div>
                            <div className={`flex-1 rounded-3xl p-6 shadow-sm border transition-all ${isSelected ? 'scale-[1.02] shadow-md' : ''} ${is1on1 ? 'bg-[#0B4550] border-[#0B4550] text-white' : isBlocked ? 'bg-transparent border-dashed border-2 border-gray-300' : 'bg-white border-gray-100 hover:border-[#E6FF2B]'}`}>
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium mb-2 ${is1on1 ? 'bg-[#E6FF2B] text-[#0B4550]' : 'bg-gray-100 text-[#898A8D]'}`}>
                                    {session.type}
                                  </span>
                                  <h3 className={`text-2xl font-medium mb-1 ${is1on1 ? 'text-white' : 'text-[#0B4550]'} ${isPast ? 'line-through opacity-60' : ''}`}>{getSessionDisplayTitle(session)}</h3>
                                  <div className={`flex items-center gap-2 text-lg font-medium ${is1on1 ? 'text-white/70' : 'text-[#898A8D]'}`}>
                                    <MapPin size={18} className="shrink-0" /> 
                                    <span className="break-words">{displayLocation} {displayCoach && `• Coach: ${displayCoach}`} • {formatDbDate(session.date)}</span>
                                  </div>
                                </div>
                                {!isBlocked && (
                                  <div className="flex flex-col items-end justify-between">
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

                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {!isMobile && (
                selectedSession && (
                  <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-gray-100 sticky top-4">
                    <span className="inline-block px-4 py-1.5 rounded-xl bg-gray-100 text-[#898A8D] font-medium text-sm mb-4">{selectedSession.type}</span>
                    <h2 className="text-3xl md:text-4xl font-medium text-[#0B4550] mb-6 leading-tight">{getSessionDisplayTitle(selectedSession)}</h2>
                    <div className="space-y-5 border-b border-gray-100 pb-8 mb-8">
                      <div className="flex items-center gap-4 text-xl font-medium text-[#0B4550]"><Clock className="text-[#898A8D]" size={28} /> {formatDbDate(selectedSession.date)} - {selectedSession.time}</div>
                      <div className="flex items-center gap-4 text-xl font-medium text-[#0B4550]"><MapPin className="text-[#898A8D]" size={28} /> {selectedSession.location ? selectedSession.location.split(' | Coach: ')[0] : 'Main Floor'}</div>
                      {selectedSession.location && selectedSession.location.includes(' | Coach: ') && (
                        <div className="flex items-center gap-4 text-xl font-medium text-[#0B4550]">
                          <Users className="text-[#898A8D]" size={28} />
                          <span>Coach: <span className="font-extrabold text-[#0B4550]">{selectedSession.location.split(' | Coach: ')[1]}</span></span>
                        </div>
                      )}
                    </div>

                    {selectedSession.type !== 'Blocked' ? (
                      <>
                        {/* Tabs Header */}
                        <div className="flex border-b border-gray-100 mb-6 gap-6">
                          <button 
                            type="button"
                            onClick={() => setSessionDetailTab('roster')}
                            className={`pb-3 text-lg font-bold transition-all relative ${sessionDetailTab === 'roster' ? 'text-[#0B4550]' : 'text-[#898A8D]'}`}
                          >
                            Roster
                            {sessionDetailTab === 'roster' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B4550] rounded-full"></span>}
                          </button>
                          <button 
                            type="button"
                            onClick={() => setSessionDetailTab('workout')}
                            className={`pb-3 text-lg font-bold transition-all relative ${sessionDetailTab === 'workout' ? 'text-[#0B4550]' : 'text-[#898A8D]'}`}
                          >
                            Workout Log
                            {sessionDetailTab === 'workout' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B4550] rounded-full"></span>}
                          </button>
                        </div>

                        {sessionDetailTab === 'roster' ? (
                          <>
                            <div className="flex justify-between items-end mb-6">
                              <h3 className="text-2xl font-medium text-[#0B4550]">Roster</h3>
                              <span className="text-[#898A8D] font-medium text-lg">Capacity: {selectedSession.capacity}</span>
                            </div>

                            {/* ASSIGN STUDENT DROPDOWN */}
                            <div className="mb-6 p-4 bg-[#F9F7F2] rounded-2xl border border-gray-100 relative">
                              <p className="text-xs font-bold text-[#898A8D] uppercase tracking-wider mb-2">Book / Assign Students</p>
                              <div className="relative">
                                <button 
                                  type="button"
                                  onClick={() => {
                                    setShowStudentDropdown(!showStudentDropdown);
                                    setSearchStudentQuery('');
                                  }}
                                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0B4550] font-bold flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 md:gap-0 outline-none focus:border-[#0B4550] shadow-sm hover:bg-gray-50 transition-colors"
                                >
                                  <span>
                                    {selectedStudentIds.length === 0 
                                      ? 'Select students to book...' 
                                      : `${selectedStudentIds.length} student(s) selected`}
                                  </span>
                                  <ChevronDown size={18} className={`transition-transform duration-200 ${showStudentDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {showStudentDropdown && (
                                  <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-150 rounded-2xl shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-200 max-h-80 flex flex-col">
                                    {/* SEARCH BAR */}
                                    <div className="relative mb-3 shrink-0">
                                      <input 
                                        type="text" 
                                        placeholder="Search clients..." 
                                        value={searchStudentQuery}
                                        onChange={(e) => setSearchStudentQuery(e.target.value)}
                                        className="w-full bg-[#F9F7F2] border border-gray-100 rounded-xl py-2.5 pl-9 pr-4 text-sm font-semibold text-[#0B4550] outline-none focus:border-[#0B4550]"
                                      />
                                      <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                                    </div>

                                    {/* CLIENTS CHECKBOX LIST */}
                                    <div className="overflow-y-auto flex-1 space-y-1.5 pr-1">
                                      {(() => {
                                        const filtered = clients
                                          .filter(c => c.status !== 'Archived' && (c.name || '').toLowerCase().includes(searchStudentQuery.toLowerCase()))
                                          .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

                                        if (filtered.length === 0) {
                                          return <p className="text-sm text-gray-400 text-center py-4">No clients found.</p>;
                                        }

                                        return filtered.map(c => {
                                          const isSelected = selectedStudentIds.includes(c.id);
                                          const isAlreadyRostered = selectedSession.attendees?.some(a => a.client_id === c.id);

                                          return (
                                            <label 
                                              key={c.id} 
                                              className={`flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer ${isAlreadyRostered ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:bg-[#F9F7F2]'}`}
                                            >
                                              <input 
                                                type="checkbox"
                                                disabled={isAlreadyRostered}
                                                checked={isAlreadyRostered || isSelected}
                                                onChange={() => {
                                                  if (isAlreadyRostered) return;
                                                  setSelectedStudentIds(prev => 
                                                    prev.includes(c.id) ? prev.filter(id => id !== c.id) : [...prev, c.id]
                                                  );
                                                }}
                                                className="w-5 h-5 text-[#0B4550] border-gray-200 rounded focus:ring-[#0B4550] cursor-pointer"
                                              />
                                              <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-[#0B4550] truncate">{c.name}</p>
                                                <p className="text-[11px] text-[#898A8D] font-medium">
                                                  {c.unlimited 
                                                    ? `Unlimited - Exp: ${formatExpiryDate(c.expiry)}` 
                                                    : `${c.remaining_package || 0} sessions left`}
                                                </p>
                                              </div>
                                              {isAlreadyRostered && (
                                                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Booked</span>
                                              )}
                                            </label>
                                          );
                                        });
                                      })()}
                                    </div>

                                    {/* SUBMIT BATCH BUTTON */}
                                    <div className="border-t border-gray-100 pt-3 mt-3 flex gap-2 shrink-0">
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          setSelectedStudentIds([]);
                                          setShowStudentDropdown(false);
                                        }}
                                        className="flex-1 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                                      >
                                        Cancel
                                      </button>
                                      <button 
                                        type="button"
                                        disabled={selectedStudentIds.length === 0}
                                        onClick={handleAssignMultipleClients}
                                        className="flex-[2] py-2 rounded-xl text-xs font-extrabold text-[#E6FF2B] bg-[#0B4550] hover:bg-[#0B4550]/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        Assign Selected ({selectedStudentIds.length})
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {selectedSession.attendees.length === 0 ? (
                              <div className="text-center py-6 md:py-10 bg-[#F9F7F2] rounded-2xl border border-gray-100">
                                 <p className="text-lg font-medium text-[#898A8D]">No bookings yet.</p>
                              </div>
                            ) : (
                              <>
                                <div className="space-y-3 mb-4">
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
                                      <button onClick={() => toggleAttendance(attendee.booking_id, attendee.status)} className={`p-3 rounded-xl transition-colors ${attendee.status === 'Attended' ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-gray-300 hover:text-emerald-500 shadow-sm border border-gray-200'}`} title="Toggle Attendance">
                                        <CheckSquare size={24} />
                                      </button>
                                      {/* MOVE CLIENT */}
                                      <button 
                                        onClick={() => {
                                          setMovingAttendee(attendee);
                                          setMoveTargetDate(selectedSession.date);
                                          setMoveTargetSessionId('');
                                          setShowMoveModal(true);
                                        }} 
                                        className="p-3 rounded-xl bg-white text-gray-300 hover:text-blue-500 hover:bg-blue-50 hover:border-blue-200 transition-colors shadow-sm border border-gray-200" 
                                        title="Move / Reschedule client"
                                      >
                                        <ArrowRight size={24} />
                                      </button>
                                      {/* REMOVE FROM ROSTER */}
                                      <button onClick={() => handleRemoveStudent(attendee.booking_id, attendee.client_id)} className="p-3 rounded-xl bg-white text-gray-300 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm border border-gray-200" title="Remove from roster">
                                        <Trash2 size={24} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                                <button 
                                  onClick={handleOpenAttendanceSummaryModal} 
                                  className="w-full py-4 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white font-extrabold transition-all flex items-center justify-center gap-2 shadow-md mb-6 hover:shadow-lg active:scale-95 duration-200"
                                  title="Review and Finalize Attendance and Credits"
                                >
                                  <CheckSquare size={20} /> Review & Confirm Attendance
                                </button>
                              </>
                            )}
                          </>
                        ) : (
                          <div className="flex flex-col gap-4">
                            <h3 className="text-2xl font-medium text-[#0B4550]">Workout Log</h3>
                            <div className="flex flex-col gap-4 bg-[#F9F7F2] p-5 rounded-2xl border border-gray-100">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-[#898A8D] uppercase tracking-wider">Workout Title</label>
                                <input 
                                  type="text" 
                                  value={sessionWorkoutTitle}
                                  onChange={(e) => setSessionWorkoutTitle(e.target.value)}
                                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-[#0B4550] outline-none focus:border-[#0B4550] transition-colors"
                                  placeholder="Workout Title..."
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-[#898A8D] uppercase tracking-wider">Date</label>
                                <input 
                                  type="text" 
                                  value={sessionWorkoutDate}
                                  onChange={(e) => setSessionWorkoutDate(e.target.value)}
                                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-[#0B4550] outline-none focus:border-[#0B4550] transition-colors"
                                  placeholder="Date (e.g. 18/6/2026)"
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-[#898A8D] uppercase tracking-wider">Workout Notes</label>
                                <textarea 
                                  value={sessionWorkoutContent}
                                  onChange={(e) => setSessionWorkoutContent(e.target.value)}
                                  className="w-full h-40 bg-white border border-gray-200 rounded-xl p-4 text-sm font-semibold text-[#0B4550] outline-none focus:border-[#0B4550] transition-colors resize-none"
                                  placeholder="Start typing workouts performed today..."
                                />
                              </div>
                            </div>

                            <div className="flex flex-col gap-2.5 mt-2">
                              {sessionWorkoutSyncMsg && (
                                <span className="text-emerald-500 font-bold text-xs flex items-center gap-1">
                                  <Check size={14}/> {sessionWorkoutSyncMsg}
                                </span>
                              )}
                              <button 
                                onClick={handleSyncSessionWorkout}
                                disabled={isSyncingSessionWorkout}
                                className="w-full bg-[#0B4550] text-[#E6FF2B] py-3.5 rounded-xl font-bold text-sm hover:scale-[1.01] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                              >
                                {isSyncingSessionWorkout ? <RotateCw className="animate-spin" size={16}/> : <Save size={16}/>}
                                Sync with Attended Clients
                              </button>
                              <p className="text-[10px] text-gray-400 font-medium text-center leading-normal">
                                Syncing will write or update this workout log in the "Workout Logs" tab for all clients currently marked as "Attended" in this class.
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-6 md:py-10">
                        <p className="text-xl font-medium text-[#898A8D]">Time block reserved for personal tasks.</p>
                      </div>
                    )}

                    {/* EDIT EVENT */}
                    <button 
                      onClick={handleOpenEditEvent} 
                      className="w-full mt-6 py-3 rounded-2xl bg-[#0B4550] text-[#E6FF2B] font-bold hover:bg-[#0B4550]/90 transition-all flex items-center justify-center gap-2 shadow-sm"
                      title="Edit Event Details"
                    >
                      <Edit3 size={18} /> Edit Event Details
                    </button>

                    {/* CANCEL & DELETE EVENT */}
                    <button 
                      onClick={() => handleDeleteSession(selectedSession.id)} 
                      className="w-full mt-3 py-3 rounded-2xl border border-red-200 text-red-500 font-bold hover:bg-red-50 hover:border-red-500 transition-colors flex items-center justify-center gap-2"
                      title="Cancel & Delete Event"
                    >
                      <Trash2 size={18} /> Cancel & Delete Event
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* VIEW: PACKAGES */}
        {activePage === 'Packages' && (
          <div className="animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 md:gap-0 mb-8">
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

                <button onClick={() => handleOpenPackageModal()} className="bg-[#0B4550] text-[#E6FF2B] px-4 md:px-6 py-3 rounded-xl font-medium text-lg flex items-center gap-2 hover:brightness-95 transition-all shadow-sm">
                  <Plus size={24} /> Create Package
                </button>
              </div>
            </div>

            {packageViewMode === 'list' ? (
              <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100 overflow-hidden">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {sortedPackages.map(pkg => (
                  <div key={pkg.id} className="bg-white rounded-[2rem] p-5 md:p-8 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-[#0B4550] transition-colors flex flex-col">
                    {pkg.type === 'Unlimited' && <div className="absolute top-0 right-0 bg-[#E6FF2B] text-[#0B4550] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl shadow-sm">Unlimited</div>}
                    
                    <h3 className="text-2xl font-extrabold text-[#0B4550] mb-2 pr-10">{pkg.name}</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-sm font-bold text-[#898A8D]">RM</span>
                      <span className="text-3xl md:text-4xl font-black text-[#0B4550]">{pkg.price}</span>
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
          !isRevenueUnlocked ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm animate-in fade-in duration-300 w-full">
              <div className="w-20 h-20 bg-[#F9F7F2] text-[#0B4550] rounded-full flex items-center justify-center mb-6">
                <Lock size={40} />
              </div>
              <h3 className="text-3xl font-black text-[#0B4550] mb-2">Analytics Access Locked</h3>
              <p className="text-[#898A8D] font-medium mb-8 max-w-sm text-base leading-relaxed">Performance analytics and trends require a secure owner verification.</p>
              <button 
                onClick={() => {
                  setPendingPageAction('Analytics');
                  setSecurityPinInput('');
                  setSecurityPinError(false);
                  setShowSecurityPinModal(true);
                }}
                className="bg-[#0B4550] text-[#E6FF2B] font-bold text-lg px-8 py-4 rounded-2xl hover:scale-105 transition-all shadow-md flex items-center gap-2"
              >
                <Unlock size={20} /> Enter Owner PIN
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
            <div className="flex justify-end items-center mb-8">
              <div className="flex bg-white rounded-full p-1.5 shadow-sm border border-gray-100">
                {['1M', '3M', '6M', '1Y', 'All Time'].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 md:px-6 py-2 rounded-full text-lg font-medium transition-all whitespace-nowrap ${activeTab === tab ? 'bg-[#898A8D] text-white' : 'text-[#898A8D] hover:text-[#0B4550]'}`}>{tab}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
               <div className="bg-[#0B4550] rounded-3xl p-4 md:p-6 shadow-md">
                 <h3 className="text-white/80 font-medium text-lg mb-2">Net Revenue Growth</h3>
                 <div className="flex items-end gap-3">
                   <h2 className="text-3xl md:text-5xl font-medium text-white">{analyticsData.revenueGrowthStr}</h2>
                   {analyticsData.revenueGrowthPositive ? (
                     <TrendingUp size={24} className="text-[#E6FF2B] mb-2" />
                   ) : (
                     <TrendingDown size={24} className="text-red-400 mb-2" />
                   )}
                 </div>
               </div>
               <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100">
                 <h3 className="text-[#898A8D] font-medium text-lg mb-2">Client Retention Rate</h3>
                 <h2 className="text-3xl md:text-5xl font-medium text-[#0B4550]">{analyticsData.retentionRate}%</h2>
               </div>
               <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100">
                 <h3 className="text-[#898A8D] font-medium text-lg mb-2">Avg. Session Attendance</h3>
                 <h2 className="text-3xl md:text-5xl font-medium text-[#0B4550]">{analyticsData.attendanceRate}%</h2>
               </div>
            </div>
            
            {/* Revenue Overview Chart inside Analytics */}
            <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-gray-100 mb-8 flex flex-col">
              <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 md:gap-0 mb-6">
                <div>
                  <h3 className="font-medium text-2xl text-[#0B4550]">Revenue Overview</h3>
                  <p className="text-sm text-[#898A8D] mt-1">Monthly breakdown of gross revenue generated</p>
                </div>
              </div>
              
              {/* PREMIUM DYNAMIC BAR CHART */}
              <div className="overflow-x-auto no-scrollbar w-full">
                <div className="relative h-64 min-w-[600px] md:min-w-0 mt-10 group">
                  
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
                            style={{ height: `${Math.max(heightPercentage, 4)}%` }}
                          >
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
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
              <div className="lg:col-span-2 bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row md:justify-between items-start gap-4 md:gap-0 mb-6">
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
              <div className="lg:col-span-1 bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-gray-100 flex flex-col">
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

            {/* Client Revenue Contribution & SVG Pie Chart */}
            <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-gray-100 mt-8 flex flex-col">
              <div>
                <h3 className="font-medium text-2xl text-[#0B4550]">Client Revenue Contribution</h3>
                <p className="text-sm text-[#898A8D] mt-1">Share of total revenue generated per client (sum of positive transactions)</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 items-center">
                {/* Left: SVG Donut Chart */}
                <div className="lg:col-span-1 flex flex-col items-center justify-center p-4">
                  {analyticsData.pieChartData && analyticsData.pieChartData.length > 0 ? (
                    <div className="relative w-52 h-52 flex items-center justify-center">
                      <svg width="100%" height="100%" viewBox="0 0 120 120" className="transform rotate-[-90deg]">
                        {(() => {
                          const radius = 40;
                          const circumference = 2 * Math.PI * radius; // ~251.327
                          let cumulativeOffset = 0;
                          return analyticsData.pieChartData.map((slice, idx) => {
                            const percentage = parseFloat(slice.percentage) || 0;
                            const strokeLength = (percentage / 100) * circumference;
                            const strokeOffset = cumulativeOffset;
                            cumulativeOffset += strokeLength;

                            return (
                              <circle
                                key={idx}
                                cx="60"
                                cy="60"
                                r={radius}
                                fill="transparent"
                                stroke={slice.color}
                                strokeWidth="14"
                                strokeDasharray={`${strokeLength} ${circumference}`}
                                strokeDashoffset={-strokeOffset}
                                className="transition-all duration-300 hover:stroke-[16px] cursor-pointer"
                                title={`${slice.name}: ${slice.percentage}%`}
                              />
                            );
                          });
                        })()}
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-[10px] uppercase font-bold text-[#898A8D] tracking-wider">Total Revenue</span>
                        <span className="text-xl font-black text-[#0B4550]">RM {analyticsData.totalPositiveRevenue.toLocaleString()}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-12">No data available</div>
                  )}
                </div>

                {/* Right: Clients contribution breakdown list */}
                <div className="lg:col-span-2 flex flex-col gap-3">
                  <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-2 no-scrollbar">
                    {analyticsData.pieChartData && analyticsData.pieChartData.length > 0 ? (
                      analyticsData.pieChartData.map((slice, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 rounded-2xl bg-gray-50 border border-gray-100">
                          <div className="flex items-center gap-3">
                            <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: slice.color }}></span>
                            <span className="text-base font-semibold text-[#0B4550]">{slice.name}</span>
                          </div>
                          <div className="flex items-center gap-4 text-right">
                            <span className="text-sm font-bold text-[#898A8D]">{slice.percentage}%</span>
                            <span className="text-base font-black text-[#0B4550]">RM {slice.amount.toLocaleString()}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-400 py-8 font-medium">No client transactions found.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}

        {/* VIEW: SETTINGS */}
        {activePage === 'Settings' && (
          <div className="animate-in fade-in duration-500 max-w-4xl space-y-8">
            {settingsMessage && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-5 rounded-2xl text-base font-semibold flex items-center gap-3 shadow-sm">
                <Check size={22} className="stroke-[3px]" /> {settingsMessage}
              </div>
            )}
            
            <form onSubmit={handleSaveSettings} className="space-y-8">
              {/* BRANDING SECTION */}
              <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-gray-100">
                <h3 className="font-bold text-2xl text-[#0B4550] mb-6 pb-3 border-b border-gray-50 flex items-center gap-2">
                  <Award size={24} /> Gym Branding & Identity
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[#898A8D] font-bold text-xs uppercase tracking-widest mb-2 block">Full Name</label>
                      <input type="text" value={settingsForm.full_name} onChange={(e) => setSettingsForm({...settingsForm, full_name: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3.5 px-4 font-semibold text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B]" placeholder="Your Name" />
                    </div>
                    <div>
                      <label className="text-[#898A8D] font-bold text-xs uppercase tracking-widest mb-2 block">Gym / Business Name</label>
                      <input type="text" value={settingsForm.company_name} onChange={(e) => setSettingsForm({...settingsForm, company_name: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3.5 px-4 font-semibold text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B]" placeholder="e.g. Backyard Performance" />
                    </div>
                  </div>
                  
                  {/* LOGO IMAGE FILE UPLOADER */}
                  <div className="flex flex-col justify-center items-center p-4 md:p-6 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    {settingsForm.company_logo ? (
                      <div className="text-center space-y-4">
                        <div className="relative group w-32 h-32 bg-white rounded-2xl shadow-md border border-gray-100 flex items-center justify-center p-3">
                          <img src={settingsForm.company_logo} alt="Custom Logo" className="max-w-full max-h-full object-contain rounded-lg" />
                          <button type="button" onClick={() => setSettingsForm({...settingsForm, company_logo: ''})} className="absolute -top-3 -right-3 w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center shadow-sm transition-all focus:outline-none"><X size={16} /></button>
                        </div>
                        <p className="text-xs font-bold text-[#898A8D]">Gym Logo Active</p>
                      </div>
                    ) : (
                      <label className="cursor-pointer text-center space-y-3 group focus-within:outline-none">
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#898A8D] group-hover:text-[#0B4550] group-hover:scale-105 shadow-sm border border-gray-100 transition-all mx-auto"><Camera size={26} /></div>
                        <div>
                          <p className="text-sm font-bold text-[#0B4550]">Upload Custom Logo</p>
                          <p className="text-xs text-[#898A8D] mt-1">PNG, JPG or SVG (Base64)</p>
                        </div>
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* INVOICE BILL FROM DETAILS */}
              <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-gray-100">
                <h3 className="font-bold text-2xl text-[#0B4550] mb-6 pb-3 border-b border-gray-50 flex items-center gap-2">
                  <FileText size={24} /> Company Billing Details
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="text-[#898A8D] font-bold text-xs uppercase tracking-widest mb-2 block">Gym Billing Email Address</label>
                      <input type="email" value={settingsForm.company_email} onChange={(e) => setSettingsForm({...settingsForm, company_email: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3.5 px-4 font-semibold text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B]" placeholder="billing@yourgym.com" />
                    </div>
                    <div>
                      <label className="text-[#898A8D] font-bold text-xs uppercase tracking-widest mb-2 block">Gym Contact Phone Number</label>
                      <input type="tel" value={settingsForm.company_phone} onChange={(e) => setSettingsForm({...settingsForm, company_phone: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3.5 px-4 font-semibold text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B]" placeholder="014-2279216" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[#898A8D] font-bold text-xs uppercase tracking-widest mb-2 block">Gym Business Physical Address</label>
                    <textarea rows="3" value={settingsForm.company_address} onChange={(e) => setSettingsForm({...settingsForm, company_address: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3.5 px-4 font-semibold text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B] resize-none" placeholder="Room 9, 6-1-1, Jalan Jalil Perkasa 14, Kuala Lumpur 57000" />
                  </div>
                </div>
              </div>

              {/* SCHEDULING OPTIONS & CREDIT RULES */}
              <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-gray-100 space-y-8">
                <h3 className="font-bold text-2xl text-[#0B4550] mb-2 pb-3 border-b border-gray-50 flex items-center gap-2">
                  <Calendar size={24} /> Scheduling & Attendance Rules
                </h3>
                <p className="text-[#898A8D] font-medium text-sm -mt-4 mb-4">
                  Configure active coaches, gym locations, and set custom package credit rates per class type.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Coaches & Locations */}
                  <div className="space-y-6">
                    {/* Coaches CRUD */}
                    <div className="bg-[#F9F7F2]/60 rounded-2xl p-5 border border-gray-100">
                      <h4 className="font-extrabold text-lg text-[#0B4550] mb-4 flex items-center justify-between">
                        <span>Coaches / Trainers</span>
                        <span className="text-xs bg-[#0B4550] text-[#E6FF2B] px-2 py-0.5 rounded-full">{scheduleSettings.coaches.length}</span>
                      </h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {scheduleSettings.coaches.map(coach => (
                          <span key={coach} className="inline-flex items-center gap-1 bg-white text-[#0B4550] font-bold text-xs px-3 py-1.5 rounded-full border border-gray-100 hover:border-red-200 hover:text-red-500 transition-all cursor-pointer group" onClick={() => handleRemoveCoachSetting(coach)}>
                            {coach}
                            <X size={12} className="text-gray-400 group-hover:text-red-500" />
                          </span>
                        ))}
                        {scheduleSettings.coaches.length === 0 && (
                          <span className="text-xs text-[#898A8D] italic font-semibold">No coaches added yet.</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCoachName}
                          onChange={(e) => setNewCoachName(e.target.value)}
                          placeholder="e.g. Keith"
                          className="flex-1 bg-white border border-gray-100 rounded-xl px-3 py-2 text-sm font-semibold text-[#0B4550] outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddCoachSetting}
                          className="bg-[#0B4550] text-[#E6FF2B] px-4 py-2 rounded-xl text-xs font-black hover:scale-[1.03] active:scale-[0.97] transition-all shadow-sm"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Locations CRUD */}
                    <div className="bg-[#F9F7F2]/60 rounded-2xl p-5 border border-gray-100">
                      <h4 className="font-extrabold text-lg text-[#0B4550] mb-4 flex items-center justify-between">
                        <span>Locations / Rooms</span>
                        <span className="text-xs bg-[#0B4550] text-[#E6FF2B] px-2 py-0.5 rounded-full">{scheduleSettings.locations.length}</span>
                      </h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {scheduleSettings.locations.map(loc => (
                          <span key={loc} className="inline-flex items-center gap-1 bg-white text-[#0B4550] font-bold text-xs px-3 py-1.5 rounded-full border border-gray-100 hover:border-red-200 hover:text-red-500 transition-all cursor-pointer group" onClick={() => handleRemoveLocationSetting(loc)}>
                            {loc}
                            <X size={12} className="text-gray-400 group-hover:text-red-500" />
                          </span>
                        ))}
                        {scheduleSettings.locations.length === 0 && (
                          <span className="text-xs text-[#898A8D] italic font-semibold">No locations added yet.</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newLocationName}
                          onChange={(e) => setNewLocationName(e.target.value)}
                          placeholder="e.g. Main Floor"
                          className="flex-1 bg-white border border-gray-100 rounded-xl px-3 py-2 text-sm font-semibold text-[#0B4550] outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddLocationSetting}
                          className="bg-[#0B4550] text-[#E6FF2B] px-4 py-2 rounded-xl text-xs font-black hover:scale-[1.03] active:scale-[0.97] transition-all shadow-sm"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Class rules / credit mappings */}
                  <div className="space-y-6">
                    <div className="bg-[#F9F7F2]/60 rounded-2xl p-5 border border-gray-100 flex flex-col h-full">
                      <h4 className="font-extrabold text-lg text-[#0B4550] mb-4 flex items-center justify-between">
                        <span>Class Credit Rates</span>
                        <span className="text-xs bg-[#0B4550] text-[#E6FF2B] px-2 py-0.5 rounded-full">{scheduleSettings.classes.length} Rules</span>
                      </h4>
                      <div className="space-y-2 mb-4 flex-1 overflow-y-auto max-h-[160px] pr-1 scrollbar-thin">
                        {scheduleSettings.classes.map(cls => (
                          <div key={cls.name} className="bg-white border border-gray-100 p-2 px-3 rounded-xl flex items-center justify-between gap-3 shadow-sm">
                            <span className="font-bold text-sm text-[#0B4550] truncate">{cls.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                                {cls.credits} {cls.credits === 1 ? 'credit' : 'credits'}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveClassSetting(cls.name)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                        {scheduleSettings.classes.length === 0 && (
                          <span className="text-xs text-[#898A8D] italic font-semibold block py-4 text-center">No class rules set yet.</span>
                        )}
                      </div>
                      <div className="space-y-2 border-t border-gray-100 pt-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newClassName}
                            onChange={(e) => setNewClassName(e.target.value)}
                            placeholder="e.g. Muay Thai Class"
                            className="flex-[2] bg-white border border-gray-100 rounded-xl px-3 py-2 text-xs font-semibold text-[#0B4550] outline-none"
                          />
                          <div className="flex-1 flex items-center gap-1 bg-white border border-gray-100 rounded-xl px-2 py-1.5 justify-center">
                            <label className="text-[10px] font-black text-gray-400">CREDITS</label>
                            <input
                              type="number"
                              min="1"
                              value={newClassCredits}
                              onChange={(e) => setNewClassCredits(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-8 text-center text-xs font-black text-[#0B4550] bg-transparent outline-none"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddClassSetting}
                          className="w-full bg-[#0B4550] text-[#E6FF2B] py-2 rounded-xl text-xs font-black hover:scale-[1.01] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-1"
                        >
                          <Plus size={14} /> Add Class Rule
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BANK PAYMENT SETTINGS */}
              <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-gray-100">
                <h3 className="font-bold text-2xl text-[#0B4550] mb-6 pb-3 border-b border-gray-50 flex items-center gap-2">
                  <CreditCard size={24} /> Bank Account & Payment Instructions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  <div>
                    <label className="text-[#898A8D] font-bold text-xs uppercase tracking-widest mb-2 block">Bank Name</label>
                    <input type="text" value={settingsForm.bank_name} onChange={(e) => setSettingsForm({...settingsForm, bank_name: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3.5 px-4 font-semibold text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B]" placeholder="e.g. Maybank" />
                  </div>
                  <div>
                    <label className="text-[#898A8D] font-bold text-xs uppercase tracking-widest mb-2 block">Account Name</label>
                    <input type="text" value={settingsForm.bank_account_name} onChange={(e) => setSettingsForm({...settingsForm, bank_account_name: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3.5 px-4 font-semibold text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B]" placeholder="e.g. Backyard Coaching" />
                  </div>
                  <div>
                    <label className="text-[#898A8D] font-bold text-xs uppercase tracking-widest mb-2 block">Account Number</label>
                    <input type="text" value={settingsForm.bank_account_number} onChange={(e) => setSettingsForm({...settingsForm, bank_account_number: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3.5 px-4 font-semibold text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B]" placeholder="e.g. 564892482390" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" disabled={isSavingSettings} className="bg-[#0B4550] text-[#E6FF2B] px-10 py-5 rounded-2xl font-bold text-xl flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md disabled:opacity-50">
                  {isSavingSettings ? <RotateCw className="animate-spin" size={24} /> : <Save size={24} />} Save Settings
                </button>
              </div>
            </form>
          </div>
        )}

{/* CREATE / EDIT PACKAGE MODAL */}
{isPackageModalOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[150] flex justify-center items-center p-4">
            <div className="bg-white rounded-[2.5rem] p-5 md:p-8 w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200">
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

      {/* FULL-SCREEN PREMIUM INVOICE PRINT MODAL */}
      {isInvoiceModalOpen && selectedInvoiceTransaction && (
        <div className="fixed inset-0 bg-[#0B4550]/40 backdrop-blur-sm z-[200] flex justify-center items-start p-4 md:p-8 overflow-y-auto no-scrollbar print:p-0 print:bg-white print:static">
          <div className="bg-white rounded-[2.5rem] p-5 md:p-8 md:p-12 w-full max-w-4xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 print:shadow-none print:p-0 print:static print:rounded-none">
            
            {/* Action Bar (hidden when printing) */}
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 md:gap-0 mb-8 border-b border-gray-100 pb-6 print:hidden">
              <h3 className="text-2xl font-bold text-[#0B4550]">Invoice Preview</h3>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => window.print()}
                  className="bg-[#0B4550] text-[#E6FF2B] px-4 md:px-6 py-3 rounded-xl font-bold text-base flex items-center gap-2 hover:scale-105 transition-all shadow-md"
                >
                  <Download size={18} /> Print / Save PDF
                </button>
                <button 
                  onClick={() => {
                    setIsInvoiceModalOpen(false);
                    setSelectedInvoiceTransaction(null);
                  }}
                  className="w-12 h-12 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* PRINT-ONLY CSS */}
            <style dangerouslySetInnerHTML={{__html: `
              @media print {
                body * {
                  visibility: hidden;
                }
                #printable-invoice-area, #printable-invoice-area * {
                  visibility: visible;
                }
                #printable-invoice-area {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  margin: 0;
                  padding: 0;
                  background: white !important;
                  color: black !important;
                }
                .print\\:hidden {
                  display: none !important;
                }
              }
            `}} />

            {/* PRINTABLE INVOICE AREA */}
            <div id="printable-invoice-area" className="bg-white text-gray-800 font-sans leading-relaxed">
              
              {/* TOP HEADER */}
              <div className="flex flex-col md:flex-row md:justify-between items-start gap-4 md:gap-0 mb-12">
                <div className="space-y-4">
                  {/* LOGO */}
                  <div className="h-16 flex items-center">
                    <img 
                      src={companyLogo || newLogo} 
                      alt={companyName} 
                      className="max-h-16 w-auto object-contain" 
                    />
                  </div>
                  <div className="text-sm font-semibold text-gray-500">
                    <p className="text-lg font-bold text-[#0B4550]">{companyName}</p>
                    <p className="whitespace-pre-line mt-1">{trainerProfile?.company_address || 'Address not configured'}</p>
                    <p className="mt-1">Phone: {trainerProfile?.company_phone || 'N/A'}</p>
                    <p>Email: {trainerProfile?.company_email || 'N/A'}</p>
                  </div>
                </div>

                <div className="text-right">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B4550] tracking-tight uppercase mb-4">Invoice</h1>
                  <div className="space-y-1 text-sm font-semibold text-gray-600">
                    <p>Invoice No: <span className="text-[#0B4550] font-bold">{selectedInvoiceTransaction.invoiceNumber}</span></p>
                    <p>Date: {new Date(selectedInvoiceTransaction.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                    <p>Payment Term: Due on Receipt</p>
                  </div>
                </div>
              </div>

              {/* CLIENT BILL TO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 border-t border-b border-gray-100 py-5 md:py-8 mb-10">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Bill To</h4>
                  <div className="text-sm font-semibold text-gray-700">
                    <p className="text-base font-extrabold text-[#0B4550]">{clients.find(c => c.id === selectedInvoiceTransaction.client_name)?.name || selectedInvoiceTransaction.client_name}</p>
                    <p className="mt-1 whitespace-pre-line">{clients.find(c => c.id === selectedInvoiceTransaction.client_name)?.address || 'Address not configured'}</p>
                    <p className="mt-1">Email: {clients.find(c => c.id === selectedInvoiceTransaction.client_name)?.email || 'N/A'}</p>
                    <p>Phone: {clients.find(c => c.id === selectedInvoiceTransaction.client_name)?.phone || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex flex-col justify-end items-end text-right">
                  <div className="bg-[#F9F7F2]/50 border border-gray-100 rounded-2xl p-5 w-full max-w-[280px]">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Amount Due</span>
                    <span className="text-2xl md:text-3xl font-black text-[#0B4550]">RM 0.00</span>
                    <span className="text-xs text-gray-500 font-semibold block mt-1">Paid in full via {selectedInvoiceTransaction.payment_method || 'Cash'}</span>
                  </div>
                </div>
              </div>

              {/* DETAILS TABLE */}
              <table className="w-full text-left border-collapse mb-10">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-3 pl-2">Item & Description</th>
                    <th className="py-3 text-right">Qty</th>
                    <th className="py-3 text-right">Unit Price (RM)</th>
                    <th className="py-3 text-right pr-2">Amount (RM)</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-semibold text-gray-700">
                  <tr className="border-b border-gray-100">
                    <td className="py-5 pl-2">
                      <p className="font-extrabold text-base text-[#0B4550]">{selectedInvoiceTransaction.description || 'Package Purchase'}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Physical Training & Coaching Session Pack</p>
                    </td>
                    <td className="py-5 text-right">1</td>
                    <td className="py-5 text-right">{Number(selectedInvoiceTransaction.amount).toFixed(2)}</td>
                    <td className="py-5 text-right pr-2 font-bold text-gray-900">{Number(selectedInvoiceTransaction.amount).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              {/* TOTALS SUMMARY */}
              <div className="flex justify-end mb-12">
                <div className="w-full max-w-sm space-y-3 font-semibold text-gray-600 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>RM {Number(selectedInvoiceTransaction.amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (0%)</span>
                    <span>RM 0.00</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-3 text-base text-[#0B4550] font-extrabold">
                    <span>Total Paid</span>
                    <span>RM {Number(selectedInvoiceTransaction.amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-emerald-600 font-extrabold">
                    <span>Balance Due</span>
                    <span>RM 0.00</span>
                  </div>
                </div>
              </div>

              {/* PAYMENT BANK DETAILS & FOOTER */}
              <div className="border-t border-gray-100 pt-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 text-xs font-semibold text-gray-500">
                <div className="space-y-2">
                  <h5 className="font-bold text-[#0B4550] uppercase tracking-wider text-xs">Payment Information</h5>
                  <p>Thank you for choosing {companyName}. For record purposes, this payment was processed in full.</p>
                  {trainerProfile?.bank_account_number && (
                    <div className="bg-[#F9F7F2]/60 rounded-xl p-3 border border-gray-50 text-gray-600 space-y-0.5">
                      <p className="font-bold text-[#0B4550]">Bank Remittance Instructions:</p>
                      <p>Bank: <span className="font-bold">{trainerProfile.bank_name}</span></p>
                      <p>Account Name: <span className="font-bold">{trainerProfile.bank_account_name}</span></p>
                      <p>Account Number: <span className="font-bold">{trainerProfile.bank_account_number}</span></p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col justify-end md:items-end md:text-right space-y-1">
                  <h5 className="font-bold text-[#0B4550] uppercase tracking-wider text-xs mb-1">Terms & Conditions</h5>
                  <p>All packages are non-refundable and subject to coach policies.</p>
                  <p>System Generated Invoice — No physical signature required.</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

        {/* VIEW: CLASS MODE */}
        {activePage === 'ClassMode' && (
          <div className="absolute inset-0 bg-white z-[60] flex flex-col animate-in fade-in duration-500 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 md:px-8 py-4 md:py-6 border-b border-gray-100 bg-white sticky top-0 z-10 shadow-sm">
              <h1 className="text-2xl md:text-3xl font-black text-[#0B4550]">Class Check-In</h1>
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
            <div className="flex-1 overflow-y-auto p-5 md:p-8 bg-[#F9F7F2]">
              <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
                      // Pre-select first class today if available
                      const todayDate = new Date();
                      const todayClasses = sessions.filter(session => {
                        if (session.type === 'Blocked') return false;
                        const sessDate = new Date(session.start_time);
                        return sessDate.getDate() === todayDate.getDate() &&
                               sessDate.getMonth() === todayDate.getMonth() &&
                               sessDate.getFullYear() === todayDate.getFullYear();
                      });
                      const sortedTodayClasses = [...todayClasses].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
                      setSelectedClassSession(sortedTodayClasses.length > 0 ? sortedTodayClasses[0] : null);
                      setShowCheckInModal(true);
                    }}
                    className="bg-white p-4 md:p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 hover:border-[#0B4550] transition-all flex flex-col items-center gap-3 active:scale-95 group"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#0B4550] text-[#E6FF2B] flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform">
                      {getInitials(client.name)}
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-lg text-[#0B4550] text-center line-clamp-1 leading-tight">{client.name}</span>
                      {client.unlimited ? (
                        <div className="flex flex-col items-center mt-1.5 space-y-0.5">
                          <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider text-[10px]">Unlimited</span>
                          <span className="text-[11px] font-medium text-[#898A8D]">{getExpiryText(client)}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center mt-1.5 space-y-0.5">
                          <span className="text-xs font-extrabold text-[#0B4550]">{client.remaining_package || 0} Sessions Left</span>
                          <span className="text-[11px] font-medium text-[#898A8D]">{getExpiryText(client)}</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Check-in Modal */}
            {showCheckInModal && selectedClassClient && (() => {
              const todayDate = new Date();
              const todayClasses = sessions.filter(session => {
                if (session.type === 'Blocked') return false;
                const sessDate = new Date(session.start_time);
                return sessDate.getDate() === todayDate.getDate() &&
                       sessDate.getMonth() === todayDate.getMonth() &&
                       sessDate.getFullYear() === todayDate.getFullYear();
              });
              const sortedTodayClasses = [...todayClasses].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

              return (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
                  <div className="bg-white rounded-[2rem] p-5 md:p-8 w-full max-w-md shadow-2xl text-center">
                    <div className="w-20 h-20 rounded-full bg-[#0B4550] text-[#E6FF2B] flex items-center justify-center text-2xl md:text-3xl font-bold mx-auto mb-4">
                      {getInitials(selectedClassClient.name)}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-[#0B4550] mb-1">Check In?</h2>
                    <p className="text-xl text-[#898A8D] mb-4 font-medium">{selectedClassClient.name}</p>
                    
                    <div className="bg-[#F9F7F2] rounded-2xl p-3 mb-5 border border-gray-100 flex flex-col items-center gap-1 w-full text-xs">
                      {selectedClassClient.unlimited ? (
                        <>
                          <span className="font-extrabold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-widest text-[10px]">Unlimited Access</span>
                          <span className="font-medium text-[#898A8D]">{getExpiryText(selectedClassClient)}</span>
                        </>
                      ) : (
                        <>
                          <span className="font-black text-[#0B4550] text-sm">{selectedClassClient.remaining_package || 0} Sessions Remaining</span>
                          <span className="font-medium text-[#898A8D]">{getExpiryText(selectedClassClient)}</span>
                        </>
                      )}
                    </div>

                    {/* Class Selection for Today */}
                    <div className="mb-6 text-left">
                      <label className="text-[#898A8D] font-bold text-xs uppercase tracking-widest mb-3 block text-center">
                        Select Today's Class
                      </label>
                      {sortedTodayClasses.length > 0 ? (
                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                          {sortedTodayClasses.map((session) => {
                            const isSelected = selectedClassSession?.id === session.id;
                            const startTimeStr = new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            return (
                              <button
                                key={session.id}
                                type="button"
                                onClick={() => setSelectedClassSession(session)}
                                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all active:scale-[0.99] ${
                                  isSelected
                                    ? 'bg-[#0B4550] border-[#0B4550] text-[#E6FF2B] shadow-md'
                                    : 'bg-[#F9F7F2] border-gray-100 text-[#0B4550] hover:bg-gray-100'
                                }`}
                              >
                                <div className="flex-1 min-w-0 pr-2">
                                  <span className="font-extrabold text-sm block truncate leading-tight">
                                    {session.title}
                                  </span>
                                  <span className={`text-[10px] font-bold block mt-0.5 ${isSelected ? 'text-white/70' : 'text-[#898A8D]'}`}>
                                    {session.coach ? `Coach: ${session.coach}` : 'No Coach'}
                                  </span>
                                </div>
                                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-lg whitespace-nowrap ${isSelected ? 'bg-white/20 text-[#E6FF2B]' : 'bg-white text-[#0B4550] shadow-sm'}`}>
                                  {startTimeStr}
                                </span>
                              </button>
                            );
                          })}
                          
                          {/* Option for General Check-in */}
                          <button
                            type="button"
                            onClick={() => setSelectedClassSession(null)}
                            className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all active:scale-[0.99] ${
                              selectedClassSession === null
                                ? 'bg-[#0B4550] border-[#0B4550] text-[#E6FF2B] shadow-md'
                                : 'bg-[#F9F7F2] border-gray-100 text-[#0B4550] hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <span className="font-extrabold text-sm block leading-tight">
                                General Check-in
                              </span>
                              <span className={`text-[10px] font-bold block mt-0.5 ${selectedClassSession === null ? 'text-white/70' : 'text-[#898A8D]'}`}>
                                Open gym / Facilities access
                              </span>
                            </div>
                          </button>
                        </div>
                      ) : (
                        <div className="bg-[#F9F7F2] p-4 rounded-2xl text-center border border-gray-100">
                          <p className="text-xs font-semibold text-[#898A8D] italic">
                            No classes scheduled for today. General entry check-in will be logged.
                          </p>
                        </div>
                      )}
                    </div>
                    
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
              );
            })()}

            {/* Success Modal */}
            {showSuccessModal && undoTargetClient && (
              <div className="fixed inset-0 bg-[#0B4550] z-[80] flex flex-col items-center justify-center p-5 md:p-8 text-center animate-in zoom-in-95 duration-300">
                <div className="w-32 h-32 bg-[#E6FF2B] rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(230,255,43,0.3)]">
                  <Check size={64} className="text-[#0B4550]" />
                </div>
                
                <h1 className="text-3xl md:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                  Thank you!<br/>Have a great workout session today,<br/>
                  <span className="text-[#E6FF2B]">{undoTargetClient.name}</span>!
                </h1>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 mb-12 max-w-lg w-full border border-white/20 flex flex-col items-center gap-2">
                  {undoTargetClient.unlimited ? (
                    <>
                      <span className="text-sm font-extrabold text-[#E6FF2B] bg-[#E6FF2B]/10 px-4 py-1.5 rounded-full uppercase tracking-widest text-[11px] border border-[#E6FF2B]/20">Unlimited Access</span>
                      <span className="text-lg font-medium text-white/90">{getExpiryText(undoTargetClient)}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl font-black text-white">{undoTargetClient.remaining_package || 0} Sessions Remaining</span>
                      <span className="text-sm font-medium text-white/80">{getExpiryText(undoTargetClient)}</span>
                      {undoTargetClient.initial_package ? (
                        <span className="text-xs opacity-60 text-white mt-1">
                          (Package usage: {(undoTargetClient.initial_package || 0) - (undoTargetClient.remaining_package || 0)}/{undoTargetClient.initial_package || 0} used)
                        </span>
                      ) : null}
                    </>
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

        {/* PIN MODAL FOR EXIT - PREMIUM DIALPAD */}
        {showExitPinModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div 
              className={`bg-white rounded-[2.5rem] p-6 md:p-8 w-full max-w-sm text-center shadow-2xl relative border border-gray-100 flex flex-col items-center transition-all ${
                exitPinError ? 'animate-pin-shake border-2 border-red-500' : ''
              }`}
            >
              {/* Invisible input that captures desktop keyboard entry */}
              <input
                type="password"
                pattern="[0-9]*"
                inputMode="numeric"
                maxLength={4}
                value={pinInput}
                onChange={(e) => handleExitPinChange(e.target.value)}
                className="absolute -top-96 left-0 opacity-0 pointer-events-none"
                autoFocus
              />

              <div className="w-16 h-16 bg-[#F9F7F2] text-[#0B4550] rounded-full flex items-center justify-center mb-4">
                <Lock size={32} />
              </div>
              
              <h3 className="text-2xl font-black text-[#0B4550] mb-2">Exit Class Mode</h3>
              <p className="text-[#898A8D] mb-6 font-medium text-sm">
                Enter Gym Owner PIN to return to Dashboard
              </p>

              {/* Secure Dot indicators */}
              <div className="flex justify-center gap-4 mb-8">
                {[0, 1, 2, 3].map((idx) => {
                  const isFilled = pinInput.length > idx;
                  return (
                    <div 
                      key={idx}
                      className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                        isFilled 
                          ? 'bg-[#0B4550] border-[#0B4550] scale-110 shadow-md' 
                          : 'border-gray-300 bg-transparent'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Interactive Keypad Dial */}
              <div className="grid grid-cols-3 gap-4 max-w-[280px] mx-auto mb-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleExitPinChange(pinInput + num)}
                    className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-[#0B4550] bg-[#F9F7F2] hover:bg-gray-100 active:scale-95 transition-all shadow-sm focus:outline-none"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => setPinInput('')}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-sm font-semibold text-[#898A8D] hover:text-[#0B4550] active:scale-95 transition-all focus:outline-none"
                >
                  Clear
                </button>
                <button
                  onClick={() => handleExitPinChange(pinInput + '0')}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-[#0B4550] bg-[#F9F7F2] hover:bg-gray-100 active:scale-95 transition-all shadow-sm focus:outline-none"
                >
                  0
                </button>
                <button
                  onClick={() => setPinInput(prev => prev.slice(0, -1))}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-[#898A8D] hover:text-[#0B4550] active:scale-95 transition-all focus:outline-none"
                >
                  ⌫
                </button>
              </div>

              <button 
                onClick={() => {
                  setShowExitPinModal(false);
                  setPinInput('');
                  setExitPinError(false);
                }}
                className="w-full py-4 rounded-2xl font-bold text-[#898A8D] bg-[#F9F7F2] hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* REVENUE SECURITY PIN MODAL */}
        {showSecurityPinModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <style>{`
              @keyframes pin-shake {
                0%, 100% { transform: translateX(0); }
                20%, 60% { transform: translateX(-6px); }
                40%, 80% { transform: translateX(6px); }
              }
              .animate-pin-shake {
                animation: pin-shake 0.3s ease-in-out;
              }
            `}</style>
            <div 
              className={`bg-white rounded-[2.5rem] p-6 md:p-8 w-full max-w-sm text-center shadow-2xl relative border border-gray-100 flex flex-col items-center transition-all ${
                securityPinError ? 'animate-pin-shake border-2 border-red-500' : ''
              }`}
            >
              {/* Invisible input that captures desktop keyboard entry */}
              <input
                type="password"
                pattern="[0-9]*"
                inputMode="numeric"
                maxLength={4}
                value={securityPinInput}
                onChange={(e) => handleSecurityPinChange(e.target.value)}
                className="absolute -top-96 left-0 opacity-0 pointer-events-none"
                autoFocus
              />

              <div className="w-16 h-16 bg-[#F9F7F2] text-[#0B4550] rounded-full flex items-center justify-center mb-4">
                <Lock size={32} />
              </div>
              
              <h3 className="text-2xl font-black text-[#0B4550] mb-2">Security Verification</h3>
              <p className="text-[#898A8D] mb-6 font-medium text-sm">
                {pendingPageAction === 'RevealRevenue' 
                  ? 'Enter Owner PIN to reveal dashboard revenue' 
                  : 'Enter Owner PIN to unlock Revenue section'}
              </p>

              {/* Secure Dot indicators */}
              <div className="flex justify-center gap-4 mb-8">
                {[0, 1, 2, 3].map((idx) => {
                  const isFilled = securityPinInput.length > idx;
                  return (
                    <div 
                      key={idx}
                      className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                        isFilled 
                          ? 'bg-[#0B4550] border-[#0B4550] scale-110 shadow-md' 
                          : 'border-gray-300 bg-transparent'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Interactive Keypad Dial */}
              <div className="grid grid-cols-3 gap-4 max-w-[280px] mx-auto mb-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleSecurityPinChange(securityPinInput + num)}
                    className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-[#0B4550] bg-[#F9F7F2] hover:bg-gray-100 active:scale-95 transition-all shadow-sm focus:outline-none"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => setSecurityPinInput('')}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-sm font-semibold text-[#898A8D] hover:text-[#0B4550] active:scale-95 transition-all focus:outline-none"
                >
                  Clear
                </button>
                <button
                  onClick={() => handleSecurityPinChange(securityPinInput + '0')}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-[#0B4550] bg-[#F9F7F2] hover:bg-gray-100 active:scale-95 transition-all shadow-sm focus:outline-none"
                >
                  0
                </button>
                <button
                  onClick={() => setSecurityPinInput(prev => prev.slice(0, -1))}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-[#898A8D] hover:text-[#0B4550] active:scale-95 transition-all focus:outline-none"
                >
                  ⌫
                </button>
              </div>

              <button 
                onClick={() => {
                  setShowSecurityPinModal(false);
                  setSecurityPinInput('');
                  setPendingPageAction(null);
                }}
                className="w-full py-4 rounded-2xl font-bold text-[#898A8D] bg-[#F9F7F2] hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* PIN MODAL FOR UNDO */}
        {showUndoPinModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] p-5 md:p-8 w-full max-w-sm text-center shadow-2xl">
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
                className="w-full text-center text-3xl md:text-4xl tracking-[1rem] font-black py-4 bg-[#F9F7F2] rounded-xl border-none outline-none focus:ring-2 focus:ring-[#0B4550] text-[#0B4550] mb-6"
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
    <div className="bg-white rounded-3xl p-5 md:p-8 w-full max-w-md shadow-2xl">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 md:gap-0 mb-6">
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
        <div className="fixed inset-0 bg-[#0B4550]/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 py-5 md:py-8 overflow-hidden">
          <div className="bg-white rounded-[2.5rem] p-5 md:p-8 md:p-10 w-full max-w-4xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[95vh] overflow-y-auto">
            
            <button onClick={() => setShowAddModal(false)} className="absolute top-8 right-8 text-[#898A8D] hover:text-[#0B4550] transition-colors bg-gray-100 p-2 rounded-full">
              <X size={24} />
            </button>

            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-medium text-[#0B4550] mb-2">New Client</h2>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Full Name</label>
                  <input type="text" required value={newClientData.name} onChange={(e) => setNewClientData({...newClientData, name: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B]" placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Date of Birth</label>
                  <input type="date" value={newClientData.dob} onChange={(e) => setNewClientData({...newClientData, dob: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B]" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Email</label>
                  <input type="email" value={newClientData.email} onChange={(e) => setNewClientData({...newClientData, email: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B]" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Phone</label>
                  <input type="text" value={newClientData.phone} onChange={(e) => setNewClientData({...newClientData, phone: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B]" placeholder="+1 (555) 000-0000" />
                </div>
              </div>
              
              <div>
                <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Billing Address (for Invoices)</label>
                <input type="text" value={newClientData.address} onChange={(e) => setNewClientData({...newClientData, address: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B]" placeholder="e.g. 123 Main St, Apartment 4B, Kuala Lumpur" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 pt-4 border-t border-gray-100">
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
                    <option value="Trial">Trial Prospect</option>
                    <option value="Follow Up">Follow Up Needed</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Package Type</label>
                  <select value={newClientData.package} onChange={(e) => {
                    const selectedName = e.target.value;
                    const pkg = packagesList.find(p => p.name === selectedName);
                    setNewClientData({
                      ...newClientData,
                      package: selectedName,
                      initial_package: pkg ? pkg.session_count : '',
                      remaining_package: pkg ? pkg.session_count : '',
                      unlimited: pkg ? pkg.type === 'Unlimited' : false
                    });
                  }} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B] appearance-none cursor-pointer">
                    <option value="">No Package Selected</option>
                    {packagesList.map(pkg => (
                      <option key={pkg.id} value={pkg.name}>{pkg.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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

      {/* MODAL OVERLAY: MOVE CLIENT */}
      {showMoveModal && movingAttendee && (
        <div className="fixed inset-0 bg-[#0B4550]/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 py-5 md:py-8 overflow-hidden">
          <div className="bg-white rounded-[2.5rem] p-5 md:p-8 md:p-10 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto scrollbar-thin">
            <button 
              onClick={() => {
                setShowMoveModal(false);
                setMovingAttendee(null);
                setMoveTargetSessionId('');
              }} 
              className="absolute top-8 right-8 text-[#898A8D] hover:text-[#0B4550] transition-colors bg-gray-100 p-2 rounded-full"
            >
              <X size={24} />
            </button>

            <h2 className="text-3xl font-medium text-[#0B4550] mb-2">Reschedule Client</h2>
            <p className="text-[#898A8D] font-medium text-base mb-6">
              Move <span className="font-extrabold text-[#0B4550]">{movingAttendee.name}</span> to another class session.
            </p>

            <form onSubmit={handleMoveClientSubmit} className="space-y-6">
              <div>
                <label className="text-[#898A8D] font-medium text-xs uppercase tracking-widest mb-2 block">Select Target Date</label>
                <input 
                  type="date" 
                  required 
                  value={moveTargetDate} 
                  onChange={(e) => {
                    setMoveTargetDate(e.target.value);
                    setMoveTargetSessionId('');
                  }} 
                  className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B]" 
                />
              </div>

              <div>
                <label className="text-[#898A8D] font-medium text-xs uppercase tracking-widest mb-2 block">Select Target Session</label>
                {(() => {
                  const targetSessions = sessions.filter(
                    s => s.date === moveTargetDate && s.type !== 'Blocked' && s.id !== selectedSession.id
                  );

                  if (targetSessions.length === 0) {
                    return (
                      <p className="text-sm text-amber-600 bg-amber-50 rounded-xl p-4 font-semibold">
                        No active sessions scheduled on this day.
                      </p>
                    );
                  }

                  return (
                    <select 
                      required 
                      value={moveTargetSessionId} 
                      onChange={(e) => setMoveTargetSessionId(e.target.value)} 
                      className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3.5 px-5 font-medium text-base text-[#0B4550] outline-none focus:border-[#E6FF2B] appearance-none cursor-pointer"
                    >
                      <option value="">-- Select Target Session --</option>
                      {targetSessions.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.title} ({s.time} - {s.attendees ? s.attendees.length : 0}/{s.capacity} Booked)
                        </option>
                      ))}
                    </select>
                  );
                })()}
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowMoveModal(false);
                    setMovingAttendee(null);
                    setMoveTargetSessionId('');
                  }} 
                  className="flex-1 py-4 rounded-2xl text-base font-bold text-gray-500 hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={!moveTargetSessionId}
                  className="flex-1 bg-[#0B4550] text-[#E6FF2B] py-4 rounded-2xl font-bold text-base hover:bg-[#0B4550]/90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Move
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL OVERLAY: ADD EVENT (NEW!) */}
      {showEventModal && (
        <div className="fixed inset-0 bg-[#0B4550]/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 py-5 md:py-8 overflow-hidden">
          <div className="bg-white rounded-[2.5rem] p-5 md:p-8 md:p-10 w-full max-w-xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto scrollbar-thin">
            <button onClick={() => setShowEventModal(false)} className="absolute top-8 right-8 text-[#898A8D] hover:text-[#0B4550] transition-colors bg-gray-100 p-2 rounded-full">
              <X size={24} />
            </button>

            <h2 className="text-3xl md:text-4xl font-medium text-[#0B4550] mb-2">New Event</h2>
            <p className="text-[#898A8D] font-medium text-lg mb-8">Schedule a class or block time off.</p>
            
            <form onSubmit={handleAddEvent} className="space-y-6">
              
              <div>
                <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Event Title / Class</label>
                {newEventData.type === 'Blocked' ? (
                  <input type="text" required value={newEventData.title} onChange={(e) => setNewEventData({...newEventData, title: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B]" placeholder="e.g. Blocked Time" />
                ) : (
                  <select required value={newEventData.title} onChange={(e) => setNewEventData({...newEventData, title: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B] appearance-none cursor-pointer">
                    <option value="">-- Select Class Offered --</option>
                    {scheduleSettings.classes.map(cls => (
                      <option key={cls.name} value={cls.name}>{cls.name} ({cls.credits} {cls.credits === 1 ? 'credit' : 'credits'})</option>
                    ))}
                  </select>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Date</label>
                  <input type="date" required value={newEventData.date} onChange={(e) => setNewEventData({...newEventData, date: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B]" />
                </div>
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Start Time</label>
                  <div className="flex gap-2">
                    <select 
                      value={parseTimeToParts(newEventData.time || '09:00 AM').hour} 
                      onChange={(e) => handleNewEventTimeChange('hour', e.target.value)}
                      className="w-1/3 bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-2 font-bold text-lg text-[#0B4550] outline-none text-center cursor-pointer focus:border-[#E6FF2B]"
                    >
                      {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                    <select 
                      value={parseTimeToParts(newEventData.time || '09:00 AM').minute} 
                      onChange={(e) => handleNewEventTimeChange('minute', e.target.value)}
                      className="w-1/3 bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-2 font-bold text-lg text-[#0B4550] outline-none text-center cursor-pointer focus:border-[#E6FF2B]"
                    >
                      {Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0')).map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <select 
                      value={parseTimeToParts(newEventData.time || '09:00 AM').ampm} 
                      onChange={(e) => handleNewEventTimeChange('ampm', e.target.value)}
                      className="w-1/3 bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-2 font-bold text-lg text-[#0B4550] outline-none text-center cursor-pointer focus:border-[#E6FF2B]"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Duration</label>
                  <select required value={newEventData.duration} onChange={(e) => setNewEventData({...newEventData, duration: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B] appearance-none cursor-pointer">
                    <option value="30 min">30 min</option>
                    <option value="45 min">45 min</option>
                    <option value="60 min">60 min</option>
                    <option value="90 min">90 min</option>
                    <option value="120 min">120 min</option>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Location</label>
                  <select value={newEventData.location} onChange={(e) => setNewEventData({...newEventData, location: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B] appearance-none cursor-pointer">
                    <option value="">-- Select Location --</option>
                    {scheduleSettings.locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Assign Coach</label>
                  <select value={newEventData.coach} onChange={(e) => setNewEventData({...newEventData, coach: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B] appearance-none cursor-pointer">
                    <option value="">-- Select Coach --</option>
                    {scheduleSettings.coaches.map(co => (
                      <option key={co} value={co}>{co}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Max Capacity</label>
                  <input type="number" min="1" disabled={newEventData.type === '1-on-1' || newEventData.type === 'Blocked'} value={newEventData.type === '1-on-1' ? 1 : newEventData.capacity} onChange={(e) => setNewEventData({...newEventData, capacity: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B] disabled:opacity-50" />
                </div>
              </div>

              {/* RECURRENCE RULES (NEW!) */}
              {(() => {
                const getCustomScheduledCount = () => {
                  if (!newEventData.date) return 1;
                  const baseDate = new Date(newEventData.date);
                  const selectedDays = newEventData.recurrenceDays || [];
                  if (selectedDays.length === 0) return 1;

                  const weeksCount = parseInt(newEventData.recurrenceCount) || 1;
                  const safeWeeks = Math.min(6, Math.max(1, weeksCount));
                  
                  let count = 1; // Base class
                  let currentDate = new Date(baseDate);
                  const totalDaysToScan = safeWeeks * 7;
                  
                  for (let i = 1; i <= totalDaysToScan; i++) {
                    currentDate.setDate(currentDate.getDate() + 1);
                    if (selectedDays.includes(currentDate.getDay())) {
                      count++;
                    }
                  }
                  return count;
                };

                return (
                  <div className="space-y-4 bg-[#0B4550]/5 p-5 rounded-3xl border border-[#0B4550]/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Repeat Event</label>
                        <select 
                          value={newEventData.recurrence || 'none'} 
                          onChange={(e) => setNewEventData({...newEventData, recurrence: e.target.value})} 
                          className="w-full bg-white border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B] appearance-none cursor-pointer"
                        >
                          <option value="none">One-time Event</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="weekdays">Every Weekday (Mon-Fri)</option>
                          <option value="custom">Custom Days (Weekly)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">
                          {newEventData.recurrence === 'none' ? 'No Repeats' : newEventData.recurrence === 'custom' ? 'Number of Weeks' : 'Number of Repeats'}
                        </label>
                        <input 
                          type="number" 
                          min="1" 
                          max={newEventData.recurrence === 'custom' ? 6 : 20}
                          disabled={newEventData.recurrence === 'none'}
                          value={newEventData.recurrence === 'none' ? '' : newEventData.recurrenceCount} 
                          onChange={(e) => setNewEventData({...newEventData, recurrenceCount: e.target.value})} 
                          className="w-full bg-white border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B] disabled:opacity-50"
                          placeholder={newEventData.recurrence === 'custom' ? "e.g. 4 weeks" : "e.g. 4 repeats"}
                        />
                        {newEventData.recurrence && newEventData.recurrence !== 'none' && (
                          <span className="text-xs font-semibold text-[#898A8D] mt-1 block">
                            Total scheduled: {newEventData.recurrence === 'custom' ? getCustomScheduledCount() : (1 + (parseInt(newEventData.recurrenceCount) || 0))} classes
                          </span>
                        )}
                      </div>
                    </div>

                    {/* CUSTOM DAYS SELECTOR (NEW!) */}
                    {newEventData.recurrence === 'custom' && (
                      <div className="pt-2 border-t border-[#0B4550]/10 animate-in fade-in slide-in-from-top-3 duration-200">
                        <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Select Weekly Days</label>
                        <div className="grid grid-cols-7 gap-1.5 mt-2">
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label, index) => {
                            const isSelected = (newEventData.recurrenceDays || []).includes(index);
                            return (
                              <button
                                type="button"
                                key={index}
                                onClick={() => {
                                  const days = newEventData.recurrenceDays ? [...newEventData.recurrenceDays] : [];
                                  if (days.includes(index)) {
                                    setNewEventData({...newEventData, recurrenceDays: days.filter(d => d !== index)});
                                  } else {
                                    setNewEventData({...newEventData, recurrenceDays: [...days, index]});
                                  }
                                }}
                                className={`py-2 rounded-xl font-bold text-xs transition-all border text-center ${isSelected ? 'bg-[#0B4550] text-[#E6FF2B] border-[#0B4550] shadow-sm' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {newEventData.type !== 'Blocked' && (
                <div className="relative">
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">
                    Assign Clients to Class
                  </label>
                  <button 
                    type="button"
                    onClick={() => {
                      setShowEventClientsDropdown(!showEventClientsDropdown);
                      setSearchEventClientsQuery('');
                    }}
                    className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl px-5 py-3 text-lg text-[#0B4550] font-medium flex justify-between items-center outline-none focus:border-[#E6FF2B] cursor-pointer"
                  >
                    <span className="truncate">
                      {eventAssignedClients.length === 0 
                        ? 'Select clients to book...' 
                        : `${eventAssignedClients.length} client(s) selected`}
                    </span>
                    <ChevronDown size={18} className={`transition-transform duration-200 ${showEventClientsDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showEventClientsDropdown && (
                    <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-150 rounded-2xl shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-200 max-h-80 flex flex-col">
                      {/* SEARCH BAR */}
                      <div className="relative mb-3 shrink-0">
                        <input 
                          type="text" 
                          placeholder="Search clients..." 
                          value={searchEventClientsQuery}
                          onChange={(e) => setSearchEventClientsQuery(e.target.value)}
                          className="w-full bg-[#F9F7F2] border border-gray-100 rounded-xl py-2.5 pl-9 pr-4 text-sm font-semibold text-[#0B4550] outline-none focus:border-[#0B4550]"
                        />
                        <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                      </div>

                      {/* CLIENTS CHECKBOX LIST */}
                      <div className="overflow-y-auto flex-1 space-y-1.5 pr-1">
                        {(() => {
                          const filtered = clients
                            .filter(c => c.status !== 'Archived' && (c.name || '').toLowerCase().includes(searchEventClientsQuery.toLowerCase()))
                            .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

                          if (filtered.length === 0) {
                            return <p className="text-sm text-gray-400 text-center py-4">No clients found.</p>;
                          }

                          return filtered.map(c => {
                            const isSelected = eventAssignedClients.includes(c.id);

                            return (
                              <label 
                                key={c.id} 
                                className="flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer hover:bg-[#F9F7F2]"
                              >
                                <input 
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {
                                    setEventAssignedClients(prev => 
                                      prev.includes(c.id) ? prev.filter(id => id !== c.id) : [...prev, c.id]
                                    );
                                  }}
                                  className="w-5 h-5 text-[#0B4550] border-gray-200 rounded focus:ring-[#0B4550] cursor-pointer"
                                />
                                <div className="flex flex-col text-left">
                                  <span className="font-bold text-[#0B4550] text-sm">{c.name}</span>
                                  <span className="text-[11px] text-[#898A8D] font-medium">
                                    {c.package || 'No package'} • {c.unlimited ? 'Unlimited' : `${c.remaining_package || 0} left`}
                                  </span>
                                </div>
                              </label>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button type="submit" disabled={isAddingEvent} className="w-full bg-[#0B4550] text-[#E6FF2B] py-4 rounded-2xl font-medium text-xl hover:bg-[#0B4550]/90 transition-all shadow-md mt-4 flex justify-center">
                {isAddingEvent ? <RotateCw className="animate-spin" size={28} /> : 'Save to Schedule'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL OVERLAY: EDIT EVENT */}
      {showEditEventModal && (
        <div className="fixed inset-0 bg-[#0B4550]/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 py-5 md:py-8 overflow-hidden">
          <div className="bg-white rounded-[2.5rem] p-5 md:p-8 md:p-10 w-full max-w-xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setShowEditEventModal(false)} className="absolute top-8 right-8 text-[#898A8D] hover:text-[#0B4550] transition-colors bg-gray-100 p-2 rounded-full">
              <X size={24} />
            </button>

            <h2 className="text-3xl md:text-4xl font-medium text-[#0B4550] mb-2">Edit Event</h2>
            <p className="text-[#898A8D] font-medium text-lg mb-8">Update class details or time blocks.</p>
            
            <form onSubmit={handleUpdateEvent} className="space-y-6">
              
              <div>
                <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Event Title / Class</label>
                {editEventData.type === 'Blocked' ? (
                  <input type="text" required value={editEventData.title} onChange={(e) => setEditEventData({...editEventData, title: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B]" placeholder="e.g. Blocked Time" />
                ) : (
                  <select required value={editEventData.title} onChange={(e) => setEditEventData({...editEventData, title: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B] appearance-none cursor-pointer">
                    <option value="">-- Select Class Offered --</option>
                    {scheduleSettings.classes.map(cls => (
                      <option key={cls.name} value={cls.name}>{cls.name} ({cls.credits} {cls.credits === 1 ? 'credit' : 'credits'})</option>
                    ))}
                  </select>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Date</label>
                  <input type="date" required value={editEventData.date} onChange={(e) => setEditEventData({...editEventData, date: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B]" />
                </div>
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Start Time</label>
                  <div className="flex gap-2">
                    <select 
                      value={parseTimeToParts(editEventData.time || '09:00 AM').hour} 
                      onChange={(e) => handleEditEventTimeChange('hour', e.target.value)}
                      className="w-1/3 bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-2 font-bold text-lg text-[#0B4550] outline-none text-center cursor-pointer focus:border-[#E6FF2B]"
                    >
                      {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                    <select 
                      value={parseTimeToParts(editEventData.time || '09:00 AM').minute} 
                      onChange={(e) => handleEditEventTimeChange('minute', e.target.value)}
                      className="w-1/3 bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-2 font-bold text-lg text-[#0B4550] outline-none text-center cursor-pointer focus:border-[#E6FF2B]"
                    >
                      {Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0')).map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <select 
                      value={parseTimeToParts(editEventData.time || '09:00 AM').ampm} 
                      onChange={(e) => handleEditEventTimeChange('ampm', e.target.value)}
                      className="w-1/3 bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-2 font-bold text-lg text-[#0B4550] outline-none text-center cursor-pointer focus:border-[#E6FF2B]"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Duration</label>
                  <select required value={editEventData.duration} onChange={(e) => setEditEventData({...editEventData, duration: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B] appearance-none cursor-pointer">
                    <option value="30 min">30 min</option>
                    <option value="45 min">45 min</option>
                    <option value="60 min">60 min</option>
                    <option value="90 min">90 min</option>
                    <option value="120 min">120 min</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Type</label>
                  <select required value={editEventData.type} onChange={(e) => setEditEventData({...editEventData, type: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B] appearance-none cursor-pointer">
                    <option value="Group Class">Group Class</option>
                    <option value="1-on-1">1-on-1 Session</option>
                    <option value="Blocked">Blocked / Busy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Location</label>
                  <select value={editEventData.location} onChange={(e) => setEditEventData({...editEventData, location: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B] appearance-none cursor-pointer">
                    <option value="">-- Select Location --</option>
                    {scheduleSettings.locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Assign Coach</label>
                  <select value={editEventData.coach} onChange={(e) => setEditEventData({...editEventData, coach: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B] appearance-none cursor-pointer">
                    <option value="">-- Select Coach --</option>
                    {scheduleSettings.coaches.map(co => (
                      <option key={co} value={co}>{co}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Max Capacity</label>
                  <input type="number" min="1" disabled={editEventData.type === '1-on-1' || editEventData.type === 'Blocked'} value={editEventData.type === '1-on-1' ? 1 : editEventData.capacity} onChange={(e) => setEditEventData({...editEventData, capacity: e.target.value})} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-3 px-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#E6FF2B] disabled:opacity-50" />
                </div>
              </div>

              <button type="submit" disabled={isEditingEvent} className="w-full bg-[#0B4550] text-[#E6FF2B] py-4 rounded-2xl font-medium text-xl hover:bg-[#0B4550]/90 transition-all shadow-md mt-4 flex justify-center">
                {isEditingEvent ? <RotateCw className="animate-spin" size={28} /> : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL OVERLAY: ATTENDANCE SUMMARY & AMENDMENT */}
      {showAttendanceSummaryModal && (
        <div className="fixed inset-0 bg-[#0B4550]/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 py-5 md:py-8 overflow-hidden">
          <div className="bg-white rounded-[2.5rem] p-5 md:p-8 w-full max-w-4xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <button 
              onClick={() => setShowAttendanceSummaryModal(false)} 
              className="absolute top-6 right-6 text-[#898A8D] hover:text-[#0B4550] transition-colors bg-gray-100 p-2 rounded-full"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2 inline-block">
                Attendance Confirmation
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-[#0B4550]">
                {selectedSession?.title}
              </h2>
              <p className="text-[#898A8D] font-medium text-sm mt-1">
                Review attendance status, packages, and adjust remaining session credits/expiries before final confirmation.
              </p>
            </div>

            {/* Attendance Roster Table */}
            <div className="flex-1 overflow-y-auto mb-6 pr-2 scrollbar-thin">
              <div className="hidden md:grid grid-cols-12 gap-4 pb-3 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-[#898A8D]">
                <div className="col-span-4">Client / Package</div>
                <div className="col-span-3 text-center">Attendance Status</div>
                <div className="col-span-3 text-center">Remaining Credits</div>
                <div className="col-span-2 text-center">Package Expiry</div>
              </div>

              <div className="space-y-4 mt-4">
                {attendanceSummaryList.map((item, idx) => {
                  const updateItemField = (field, val) => {
                    setAttendanceSummaryList(prev => prev.map((s, i) => i === idx ? { ...s, [field]: val } : s));
                  };

                  const adjustCredits = (amount) => {
                    if (item.unlimited) return;
                    updateItemField('remaining_package', Math.max(0, item.remaining_package + amount));
                  };

                  return (
                    <div key={item.booking_id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 bg-[#F9F7F2]/60 rounded-2xl border border-gray-100 hover:border-[#0B4550]/30 transition-all">
                      {/* Client Info */}
                      <div className="col-span-1 md:col-span-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0B4550] text-[#E6FF2B] flex items-center justify-center text-sm font-bold shadow-sm">
                          {getInitials(item.name)}
                        </div>
                        <div>
                          <span className="font-bold text-lg text-[#0B4550] block">{item.name}</span>
                          <span className="text-xs font-medium text-[#898A8D]">{item.package}</span>
                        </div>
                      </div>

                      {/* Attendance Status Toggle */}
                      <div className="col-span-1 md:col-span-3 flex justify-center">
                        <div className="bg-white p-1 rounded-xl border border-gray-100 flex shadow-sm w-full max-w-[200px]">
                          <button
                            type="button"
                            onClick={() => {
                              updateItemField('status', 'Booked');
                              // Automatically refund credit cost if toggled to Booked
                              if (!item.unlimited) {
                                const cost = getClassCreditCost(selectedSession.title);
                                const originalClient = clients.find(c => c.id === item.client_id);
                                if (originalClient) {
                                  updateItemField('remaining_package', originalClient.remaining_package);
                                }
                              }
                            }}
                            className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all ${item.status === 'Booked' ? 'bg-[#0B4550] text-[#E6FF2B]' : 'text-[#898A8D] hover:text-[#0B4550]'}`}
                          >
                            Booked
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              updateItemField('status', 'Attended');
                              // Automatically deduct credit cost if toggled to Attended
                              if (!item.unlimited) {
                                const cost = getClassCreditCost(selectedSession.title);
                                const originalClient = clients.find(c => c.id === item.client_id);
                                if (originalClient) {
                                  updateItemField('remaining_package', Math.max(0, originalClient.remaining_package - cost));
                                }
                              }
                            }}
                            className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all ${item.status === 'Attended' ? 'bg-[#10B981] text-white shadow-sm' : 'text-[#898A8D] hover:text-[#10B981]'}`}
                          >
                            Attended
                          </button>
                        </div>
                      </div>

                      {/* Remaining Credits Counter */}
                      <div className="col-span-1 md:col-span-3 flex items-center justify-center gap-2">
                        {item.unlimited ? (
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                            Unlimited
                          </span>
                        ) : (
                          <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
                            <button
                              type="button"
                              onClick={() => adjustCredits(-1)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-[#0B4550] transition-colors cursor-pointer"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={item.remaining_package}
                              onChange={(e) => updateItemField('remaining_package', Math.max(0, parseInt(e.target.value) || 0))}
                              className="w-12 text-center font-black text-[#0B4550] outline-none text-lg bg-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => adjustCredits(1)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-[#0B4550] transition-colors cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Expiry Date Adjustment */}
                      <div className="col-span-1 md:col-span-2 flex justify-center">
                        <input
                          type="date"
                          value={item.expiry ? item.expiry.split('T')[0] : ''}
                          onChange={(e) => updateItemField('expiry', e.target.value)}
                          className="bg-white border border-gray-100 text-[#0B4550] px-3 py-2 rounded-xl text-xs font-bold outline-none shadow-sm cursor-pointer w-full text-center"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-4 border-t border-gray-100 pt-6">
              <button
                type="button"
                onClick={() => setShowAttendanceSummaryModal(false)}
                className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl transition-all text-lg shadow-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSavingAttendanceSummary}
                onClick={handleSaveAttendanceSummary}
                className="flex-[2] py-4 bg-[#10B981] hover:bg-[#059669] text-white font-black rounded-2xl transition-all text-lg shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSavingAttendanceSummary ? (
                  <RotateCw className="animate-spin" size={24} />
                ) : (
                  <>
                    <CheckSquare size={24} /> Confirm & Deduct Credits
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL OVERLAY: GOOGLE CALENDAR SYNC */}
      {showGoogleSyncModal && (
        <div className="fixed inset-0 bg-[#0B4550]/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 py-5 md:py-8 overflow-hidden">
          <div className="bg-white rounded-[2.5rem] p-5 md:p-8 md:p-10 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowGoogleSyncModal(false)} 
              className="absolute top-8 right-8 text-[#898A8D] hover:text-[#0B4550] transition-colors bg-gray-100 p-2 rounded-full"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-xl font-black">G</div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#0B4550]">Calendar Sync</h2>
                <p className="text-[#898A8D] font-medium text-sm">Keep your schedule in sync across all devices.</p>
              </div>
            </div>

            <div className="space-y-6 mt-8">
              {/* Option A: Direct Sync */}
              <div className="bg-[#F9F7F2] rounded-3xl p-4 md:p-6 border border-gray-100">
                <div className="flex flex-col md:flex-row md:justify-between items-start gap-4 md:gap-0 mb-2">
                  <h3 className="text-lg font-bold text-[#0B4550]">Option A: Direct Google Sync</h3>
                  {isGcalConnected && (
                    <span className="px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 rounded-full animate-pulse">
                      ● Live Sync Active
                    </span>
                  )}
                  {isGcalExpired && (
                    <span className="px-2.5 py-0.5 text-[10px] font-bold text-amber-700 bg-amber-100 rounded-full">
                      ⚠️ Link Expired
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#898A8D] mb-4">Authorize TrackPoint to push and synchronize your schedule events directly into your Google Calendar instantly.</p>
                
                {isGcalExpired && (
                  <div className="mb-4 bg-amber-50 border border-amber-100 rounded-xl p-3 text-[11px] text-amber-800 leading-relaxed font-medium">
                    <strong>⚠️ Connection Expired:</strong> Your secure browser session token has expired. Click the button below to instantly re-authenticate and restore live syncing!
                  </div>
                )}

                <button
                  onClick={handleLinkGoogleCalendar}
                  disabled={isLinkingGoogle}
                  className={`w-full py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                    isGcalConnected 
                      ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100/50' 
                      : isGcalExpired
                      ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-md animate-bounce'
                      : 'bg-[#0B4550] text-white hover:bg-opacity-90'
                  }`}
                >
                  {isLinkingGoogle ? (
                    <>
                      <RotateCw size={18} className="animate-spin" /> Requesting Consent...
                    </>
                  ) : isGcalConnected ? (
                    <>
                      Disconnect Google Calendar
                    </>
                  ) : isGcalExpired ? (
                    <>
                      Reconnect Google Calendar
                    </>
                  ) : (
                    <>
                      Link Google Calendar Account
                    </>
                  )}
                </button>
              </div>

              {/* Option B: iCal Live Feed */}
              <div className="bg-[#F9F7F2] rounded-3xl p-4 md:p-6 border border-gray-100">
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
                  <div className="mt-2 pt-2 border-t border-gray-100 text-amber-700 bg-amber-50/50 p-2.5 rounded-lg text-[10px] leading-relaxed">
                    <span className="font-bold">⚡ PRO-TIP (Force Sync):</span> Google Calendar caches feed links for up to 24 hours. If your calendar updates slowly, append <code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-200">&amp;v=2</code> (or increase to <code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-200">&amp;v=3</code> etc.) to the end of the URL to force Google Calendar to sync instantly!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RENEW PACKAGE (ADVANCED) */}
      {showRenewModal && (
        <div className="fixed inset-0 bg-[#0B4550]/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] p-5 md:p-8 md:p-10 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 my-auto">
            <button onClick={() => setShowRenewModal(false)} className="absolute top-8 right-8 text-[#898A8D] hover:text-[#0B4550] bg-gray-100 p-2 rounded-full transition-colors">
              <X size={24} />
            </button>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0B4550] mb-2">Renew Package</h2>
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
          <div className="bg-white rounded-[2.5rem] p-5 md:p-8 md:p-10 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 my-auto">
            <button onClick={() => { setShowLedgerModal(false); setEditingLedgerItem(null); setIsBulkMode(false); }} className="absolute top-8 right-8 text-[#898A8D] hover:text-[#0B4550] bg-gray-100 p-2 rounded-full transition-colors">
              <X size={24} />
            </button>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0B4550] mb-2">{isBulkMode ? 'Bulk History Entry' : (editingLedgerItem ? 'Edit Ledger Entry' : 'New Ledger Entry')}</h2>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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

      {/* MODAL: EDIT WORKOUT SESSION NOTE */}
      {showSessionNoteModal && (
        <div className="fixed inset-0 bg-[#0B4550]/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] p-5 md:p-8 md:p-10 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 my-auto">
            <button 
              onClick={() => { setShowSessionNoteModal(false); setEditingSessionNoteBookingId(null); }} 
              className="absolute top-8 right-8 text-[#898A8D] hover:text-[#0B4550] bg-gray-100 p-2 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0B4550] mb-2">Session Workout Note</h2>
            <p className="text-[#898A8D] font-medium mb-6">Add or edit workout notes, client feedback, or progress records for:</p>
            <div className="bg-[#F9F7F2] border border-gray-100 rounded-2xl p-4 mb-6">
              <span className="text-[#898A8D] font-extrabold block text-xs uppercase tracking-wider mb-1">Class / Session:</span>
              <span className="font-bold text-sm text-[#0B4550]">{editingSessionNoteTitle}</span>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-[#898A8D] font-bold text-xs uppercase tracking-widest mb-2 block">Workout Note Details</label>
                <textarea 
                  value={sessionNoteText} 
                  onChange={(e) => setSessionNoteText(e.target.value)}
                  className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl p-5 font-medium text-sm text-[#0B4550] outline-none focus:border-[#0B4550] focus:bg-white transition-all h-36 resize-none"
                  placeholder="e.g. Completed all sets. Lower back was tight today, focused on lighter technique. Energetic and highly motivated!"
                />
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => { setShowSessionNoteModal(false); setEditingSessionNoteBookingId(null); }}
                  className="flex-1 bg-gray-100 text-[#0B4550] py-4 rounded-2xl font-bold text-base hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveSessionNote}
                  disabled={isSavingSessionNote}
                  className="flex-1 bg-[#0B4550] text-[#E6FF2B] py-4 rounded-2xl font-bold text-base hover:scale-[1.01] transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {isSavingSessionNote ? <RotateCw className="animate-spin" size={18}/> : <Save size={18}/>}
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- AI COPILOT FLOATING BUTTON --- */}
      <button 
        onClick={() => setShowAICopilot(true)}
        className="fixed bottom-36 md:bottom-8 right-8 w-16 h-16 bg-[#0B4550] text-[#E6FF2B] rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-40 group border-4 border-white"
      >
        <Sparkles size={28} className="group-hover:rotate-12 transition-transform" />
      </button>

      {/* --- AI COPILOT DRAWER --- */}
      
      {/* --- MORE FEATURES BOTTOM MENU SHEET --- */}
      {showMoreMenu && (
        <div className="fixed inset-0 bg-[#0B4550]/40 backdrop-blur-sm z-[100] flex items-end justify-center lg:hidden" onClick={() => setShowMoreMenu(false)}>
          <div className="bg-white rounded-t-[2.5rem] w-full p-8 shadow-2xl relative animate-in slide-in-from-bottom duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6"></div>
            <h3 className="font-bold text-xl text-[#0B4550] mb-6 px-2">More Features</h3>
            
            <div className="grid grid-cols-3 gap-6">
              <button 
                onClick={() => { setActivePage('Calendar'); setShowMoreMenu(false); }}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${activePage === 'Calendar' ? 'bg-[#F9F7F2] text-[#0B4550] font-bold' : 'text-[#898A8D] hover:bg-gray-50'}`}
              >
                <CalendarSearch size={28} />
                <span className="text-xs font-semibold">Calendar</span>
              </button>
              
              <button 
                onClick={() => { handleNavigateToPage('Analytics'); setShowMoreMenu(false); }}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${activePage === 'Analytics' ? 'bg-[#F9F7F2] text-[#0B4550] font-bold' : 'text-[#898A8D] hover:bg-gray-50'}`}
              >
                <BarChart2 size={28} />
                <span className="text-xs font-semibold">Analytics</span>
              </button>

              <button 
                onClick={() => { setActivePage('Packages'); setShowMoreMenu(false); }}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${activePage === 'Packages' ? 'bg-[#F9F7F2] text-[#0B4550] font-bold' : 'text-[#898A8D] hover:bg-gray-50'}`}
              >
                <Package size={28} />
                <span className="text-xs font-semibold">Packages</span>
              </button>

              <button 
                onClick={() => { setActivePage('ClassMode'); setShowMoreMenu(false); }}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${activePage === 'ClassMode' ? 'bg-[#F9F7F2] text-[#0B4550] font-bold' : 'text-[#898A8D] hover:bg-gray-50'}`}
              >
                <Monitor size={28} />
                <span className="text-xs font-semibold">Class Mode</span>
              </button>

              <button 
                onClick={() => { handleNavigateToPage('Attendance'); setShowMoreMenu(false); }}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${activePage === 'Attendance' ? 'bg-[#F9F7F2] text-[#0B4550] font-bold' : 'text-[#898A8D] hover:bg-gray-50'}`}
              >
                <CheckSquare size={28} />
                <span className="text-xs font-semibold">Attendance</span>
              </button>

              <button 
                onClick={() => { setActivePage('Settings'); setShowMoreMenu(false); }}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${activePage === 'Settings' ? 'bg-[#F9F7F2] text-[#0B4550] font-bold' : 'text-[#898A8D] hover:bg-gray-50'}`}
              >
                <Settings size={28} />
                <span className="text-xs font-semibold">Settings</span>
              </button>
            </div>

            <button 
              onClick={() => setShowMoreMenu(false)}
              className="w-full bg-[#0B4550] text-[#E6FF2B] py-4 rounded-2xl font-bold text-base hover:scale-[1.01] transition-all shadow-lg mt-8"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showAICopilot && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-[#0B4550]/20 backdrop-blur-sm" onClick={() => setShowAICopilot(false)}></div>
          <div className="w-full max-w-md bg-white h-full shadow-2xl relative flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 md:gap-0 bg-[#0B4550] text-white">
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

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 no-scrollbar">
              {aiChatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl font-medium text-sm shadow-sm whitespace-pre-wrap ${
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

            <div className="p-4 md:p-6 border-t border-gray-100 bg-[#F9F7F2]">
              {/* Suggestion Chips */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-1">
                {[
                  { label: '💵 Revenue Summary', prompt: 'Show me my revenue summary' },
                  { label: '⚠️ Low Sessions', prompt: 'Which clients have low remaining sessions?' },
                  { label: '👥 Client Roster', prompt: 'Summarize my client roster stats' },
                  { label: '💡 Growth Advice', prompt: 'Give me growth insights for my business' }
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(chip.prompt)}
                    className="bg-white hover:bg-[#0B4550] text-[#0B4550] hover:text-white border border-gray-100 font-bold text-xs px-3 py-2 rounded-xl transition-all whitespace-nowrap shadow-xs active:scale-95 shrink-0"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

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
      {showMobileRosterDrawer && renderMobileRosterDrawer()}
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
      className={`bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-[150px] ${onClick ? 'cursor-pointer hover:shadow-md hover:border-[#E6FF2B] transition-all group' : ''}`}
    >
      <h3 className="text-[#898A8D] font-medium text-lg">{title}</h3>
      <div>
        <h2 className="text-2xl md:text-3xl sm:text-5xl lg:text-6xl font-medium text-[#0B4550] mb-1">{value}</h2>
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
      <span className={`text-2xl md:text-3xl font-medium ${active ? 'text-white' : 'text-[#0B4550]'}`}>{date}</span>
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