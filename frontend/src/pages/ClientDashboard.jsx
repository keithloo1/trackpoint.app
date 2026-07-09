import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import {
  Home, Activity, Calendar, Layout, Settings, Search, Plus,
  Target, Flame, ChevronDown, X, Clock, MapPin, Scale, Users,
  Zap, Trophy, ChevronLeft, ChevronRight, Package, CheckCircle2, RefreshCw,
  Trash2, Dumbbell, PlayCircle, Timer, CalendarPlus, CalendarCheck,
  CreditCard, ShieldCheck, TrendingUp, Award, User, Bell, FileText, Camera, Loader2, Printer
} from 'lucide-react';
import newLogo from '../assets/logo.svg';

// --- MOCK CONSTANTS ---
const EXERCISE_DB = {
  "Chest": { "Bodyweight": ["Push-ups", "Wide Push-ups", "Diamond Push-ups"], "Dumbbell": ["Dumbbell Bench Press", "Flat Dumbbell Flyes"], "Barbell": ["Barbell Bench Press", "Incline Barbell Press"] },
  "Back": { "Bodyweight": ["Superman Holds", "Inverted Rows"], "Dumbbell": ["Single Arm Dumbbell Row", "Renegade Rows"], "Barbell": ["Barbell Bent-Over Row", "Pendlay Row"], "Pull-up bar": ["Pull-ups", "Chin-ups"] },
  "Shoulders": { "Bodyweight": ["Pike Push-ups", "Wall Walks"], "Dumbbell": ["Dumbbell Overhead Press", "Dumbbell Lateral Raises"], "Barbell": ["Overhead Press (OHP)", "Push Press"] },
  "Arms": { "Bodyweight": ["Tricep Dips", "Diamond Push-ups"], "Dumbbell": ["Dumbbell Bicep Curls", "Hammer Curls"], "Barbell": ["Barbell Bicep Curls", "EZ Bar Curls"] },
  "Legs": { "Bodyweight": ["Air Squats", "Walking Lunges", "Jump Squats"], "Dumbbell": ["Dumbbell Goblet Squats", "Dumbbell Lunges"], "Barbell": ["Barbell Back Squat", "Barbell RDLs"] },
  "Core": { "Bodyweight": ["Plank", "Bicycle Crunches", "Leg Raises"], "Dumbbell": ["Dumbbell Russian Twists", "Weighted Crunches"], "Barbell": ["Barbell Rollouts"] }
};

const EQUIPMENT_OPTIONS = ["Bodyweight", "Dumbbell", "Barbell", "Kettlebell", "Band", "Plate", "Pull-up bar", "Bench"];
const MUSCLE_OPTIONS = ["Chest", "Back", "Shoulders", "Arms", "Legs", "Core"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const EQUIPMENT_IMAGES = {
  "Bodyweight": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&auto=format&fit=crop&q=80",
  "Dumbbell": "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=400&auto=format&fit=crop&q=80",
  "Barbell": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80",
  "Kettlebell": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&auto=format&fit=crop&q=80",
  "Band": "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&auto=format&fit=crop&q=80",
  "Plate": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&auto=format&fit=crop&q=80",
  "Pull-up bar": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&auto=format&fit=crop&q=80",
  "Bench": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&auto=format&fit=crop&q=80"
};


const STORE_PACKAGES = [
  { id: 1, name: "Starter", sessions: 5, price: 400, popular: false },
  { id: 2, name: "Committed", sessions: 10, price: 750, popular: true },
  { id: 3, name: "Pro", sessions: 20, price: 1400, popular: false }
];

const PAST_INVOICES = [
  { id: "INV-2049", date: "Apr 01, 2026", item: "Starter Package", amount: "RM 400" }
];

// --- HELPER FUNCTIONS ---
const formatTime = (totalSeconds) => {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};
const parseLocalDate = (dateStr) => {
  if (!dateStr) return null;
  if (dateStr.includes('T')) return new Date(dateStr);
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  }
  return new Date(dateStr);
};

const formatDbDate = (dateStr) => {
  const date = parseLocalDate(dateStr);
  if (!date) return '';
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const calculateRemainingDays = (expiryDateStr) => {
  if (!expiryDateStr) return null;
  const expiry = parseLocalDate(expiryDateStr);
  if (!expiry) return null;
  const today = new Date();
  expiry.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getInitials = (name) => {
  if (!name) return 'C';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

const getDailyQuote = () => {
  const quotes = [
    "“The only bad workout is the one that didn't happen.”",
    "“It never gets easier, you just get stronger.”",
    "“What seems impossible today will one day become your warm-up.”",
    "“Don't stop when you're tired. Stop when you're done.”",
    "“Strength does not come from physical capacity. It comes from an indomitable will.”",
    "“Sore today, strong tomorrow.”",
    "“Your body can stand almost anything. It’s your mind that you have to convince.”"
  ];
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = new Date() - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return quotes[dayOfYear % quotes.length];
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const downloadICS = (date, month, timeStr) => {
  const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:TrackPoint Session\nDTSTART:2026${(month + 1).toString().padStart(2, '0')}${date.toString().padStart(2, '0')}T090000Z\nDTEND:2026${(month + 1).toString().padStart(2, '0')}${date.toString().padStart(2, '0')}T100000Z\nEND:VEVENT\nEND:VCALENDAR`;
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'trackpoint-session.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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

const NavIcon = ({ icon, isActive, onClick }) => (
  <div onClick={onClick} className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all relative z-50 ${isActive ? 'bg-[#0B4550] text-[#E6FF2B] shadow-md' : 'text-[#898A8D] hover:bg-gray-50'}`}>{icon}</div>
);

const LegendItem = ({ color, label, value }) => (
  <div className="flex items-center gap-4"><div className={`w-10 h-4 rounded-full ${color}`}></div><span className="text-[#898A8D] font-medium text-lg w-56">{label}</span><span className="text-[#0B4550] font-medium text-2xl">{value}</span></div>
);

const ActivityItem = ({ name, action, time, icon }) => (
  <div className="flex items-center justify-between p-4 bg-[#F9F7F2] rounded-2xl border border-transparent hover:border-[#E6FF2B] transition-all"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-xl">{icon}</div><div><p className="text-lg font-medium text-[#0B4550]"><span className="text-[#898A8D]">{name}</span> {action}</p><p className="text-sm font-medium text-[#898A8D]">{time}</p></div></div></div>
);

function StepIndicator({ num, label, active, current }) {
  return (
    <div className="flex flex-col items-center gap-2 relative">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-medium text-xl transition-all ${active ? 'bg-[#0B4550] text-[#E6FF2B]' : 'bg-[#F9F7F2] text-[#898A8D] border-2 border-gray-200'} ${current ? 'ring-4 ring-[#0B4550]/20' : ''}`}>
        {active && !current ? <CheckCircle2 size={24} /> : num}
      </div>
      <span className={`font-medium text-sm absolute -bottom-6 whitespace-nowrap ${current ? 'text-[#0B4550]' : 'text-[#898A8D]'}`}>{label}</span>
    </div>
  );
}

const Toggle = ({ active, onClick }) => (
  <div onClick={onClick} className={`w-12 h-6 rounded-full cursor-pointer flex items-center p-1 transition-colors ${active ? 'bg-[#0B4550]' : 'bg-gray-200'}`}>
    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${active ? 'translate-x-6' : 'translate-x-0'}`} />
  </div>
);

function WeightLineChart({ data, startWeight }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (data && data.length > 0) setActiveIndex(data.length - 1);
  }, [data]);

  if (!data || data.length === 0) return null;

  const chartData = [...data].reverse();
  const activeData = chartData[activeIndex] || chartData[chartData.length - 1];

  const weights = chartData.map(d => d.weight);
  const max = Math.max(...weights) + 2;
  const min = Math.min(...weights) - 2;
  const range = max - min || 1;

  const getX = (index) => (index / (chartData.length - 1 || 1)) * 100;
  const getY = (val) => 100 - ((val - min) / range) * 100;
  const points = chartData.map((d, i) => [getX(i), getY(d.weight)]);

  let pathD = `M ${points[0][0]},${points[0][1]} `;
  for (let i = 0; i < points.length - 1; i++) {
    const xc = (points[i][0] + points[i + 1][0]) / 2;
    pathD += `C ${xc},${points[i][1]} ${xc},${points[i + 1][1]} ${points[i + 1][0]},${points[i + 1][1]} `;
  }
  const areaD = `${pathD} L 100,105 L 0,105 Z`;
  const totalLost = startWeight - activeData.weight;

  return (
    <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-gray-100 flex-1 flex flex-col relative w-full h-full group">
      <div className="mb-8 relative z-20 pointer-events-none">
        <p className="text-[#898A8D] font-medium text-sm mb-1">Your weight</p>
        <div className="flex items-baseline gap-2">
          <h2 className="text-6xl md:text-8xl font-medium text-[#0B4550] tracking-tighter transition-all duration-300">{activeData.weight}</h2>
          <span className="text-2xl md:text-4xl font-medium text-[#0B4550]">kg</span>
        </div>
        {totalLost !== 0 && (
          <p className={`font-medium text-2xl mt-2 transition-all duration-300 ${totalLost > 0 ? 'text-[#10B981]' : 'text-red-500'}`}>
            {totalLost > 0 ? '↓' : '↑'} {Math.abs(totalLost).toFixed(1)} kg <span className="text-[#898A8D] text-base font-medium ml-1">vs start</span>
          </p>
        )}
      </div>

      <div className="flex-1 w-full relative mt-auto min-h-[250px] flex pl-10 pb-8">
        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[#898A8D] font-medium text-[10px] pb-1 z-10 w-8 text-right pr-2">
          <span>{max.toFixed(0)}</span>
          <span>{((max + min) / 2).toFixed(0)}</span>
          <span>{min.toFixed(0)}</span>
        </div>

        <div className="absolute left-10 right-0 top-2 bottom-9 flex flex-col justify-between pointer-events-none z-0">
          <div className="w-full border-b border-gray-100/80"></div>
          <div className="w-full border-b border-gray-100/80"></div>
          <div className="w-full border-b border-gray-100/80"></div>
        </div>

        <div className="absolute left-10 right-0 bottom-0 flex justify-between text-[#898A8D] font-medium text-[10px] pt-3 z-10 border-t border-gray-100">
          <span>{chartData[0]?.date}</span>
          {chartData.length > 2 && <span>{chartData[Math.floor(chartData.length / 2)]?.date}</span>}
          <span>{chartData[chartData.length - 1]?.date}</span>
        </div>

        <div className="flex-1 relative w-full h-full z-10">
          <div className="absolute top-0 bottom-0 flex flex-col items-center pointer-events-none z-10 transition-all duration-200 ease-out" style={{ left: `${getX(activeIndex)}%`, transform: 'translateX(-50%)' }}>
            <div className="bg-white text-[#0B4550] text-xs font-medium px-3 py-1.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)] whitespace-nowrap mb-2 border border-gray-50 transition-all">{activeData.date}</div>
            <div className="w-[2px] flex-1 bg-[#0B4550]/10"></div>
            <div className="absolute w-6 h-6 rounded-full bg-[#10B981]/20 flex items-center justify-center transition-all duration-200" style={{ top: `${getY(activeData.weight)}%`, transform: 'translateY(-50%)' }}>
              <div className="w-2.5 h-2.5 bg-white border-[3px] border-[#10B981] rounded-full shadow-sm"></div>
            </div>
          </div>
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible absolute inset-0 pointer-events-none" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d={areaD} fill="url(#gradientFill)" className="transition-all duration-300" />
            <path d={pathD} fill="none" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-sm transition-all duration-300" />
          </svg>
          <div className="absolute inset-0 flex z-20">
            {chartData.map((d, i) => (
              <div key={i} className="flex-1 h-full cursor-pointer hover:bg-[#F9F7F2]/10 transition-colors" onMouseEnter={() => setActiveIndex(i)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClientDashboard() {
  const { clientId } = useParams();
  const isMobile = useIsMobile();

  const dailyQuote = getDailyQuote(); // <--- PASTE IT RIGHT HERE!

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [trainerLogo, setTrainerLogo] = useState('');
  const [trainerCompanyName, setTrainerCompanyName] = useState('TrackPoint');

  const [activeNav, setActiveNav] = useState('Home');
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [packagesList, setPackagesList] = useState([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activityHistory, setActivityHistory] = useState([]);

  const [topUpStep, setTopUpStep] = useState('select');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingStep, setBookingStep] = useState('select');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());

  // LIVE BOOKING STATES
  const [liveSessions, setLiveSessions] = useState([]);
  const [selectedLiveSession, setSelectedLiveSession] = useState(null);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [viewClassDetails, setViewClassDetails] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const [settingsTab, setSettingsTab] = useState('profile');
  const [alerts, setAlerts] = useState({ workouts: true, messages: true, billing: false });
  const [tempProfileName, setTempProfileName] = useState('');
  const [tempProfileEmail, setTempProfileEmail] = useState('');
  const [tempProfilePhone, setTempProfilePhone] = useState('');

  const [step, setStep] = useState(1);
  const [selectedEquip, setSelectedEquip] = useState(["Bodyweight"]);
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [workoutGoal, setWorkoutGoal] = useState('Hypertrophy');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedWorkout, setGeneratedWorkout] = useState(null);
  const [workoutDuration, setWorkoutDuration] = useState(45);
  const [workoutStyle, setWorkoutStyle] = useState('Standard');
  const [injuries, setInjuries] = useState([]);
  const [excludeExercises, setExcludeExercises] = useState('');
  const [includeWarmup, setIncludeWarmup] = useState(false);
  const [includeCooldown, setIncludeCooldown] = useState(false);
  const [bodyView, setBodyView] = useState('front');

  const [workoutTime, setWorkoutTime] = useState(0);
  const [restTime, setRestTime] = useState(0);

  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const localDateTime = now.toISOString().slice(0, 16);
  const [tempWeight, setTempWeight] = useState(68);
  const [tempGoal, setTempGoal] = useState(62);
  const [tempDate, setTempDate] = useState(localDateTime);
  const [tempFeeling, setTempFeeling] = useState('🙂');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(clientId);
        let clientQuery = supabase.from('clients').select('*');
        if (isUuid) {
          clientQuery = clientQuery.eq('id', clientId);
        } else {
          const cleanName = decodeURIComponent(clientId).replace(/[-_]/g, ' ').trim();
          clientQuery = clientQuery.ilike('name', cleanName);
        }
        const { data: realClient, error: clientErr } = await clientQuery.maybeSingle();
        if (clientErr || !realClient) {
          throw new Error("Client not found or invalid link.");
        }

        const ACTUAL_CLIENT_ID = realClient.id;
        const TRAINER_ID = realClient.trainer_id;

        const { data: profile } = await supabase.from('profiles').select('*').eq('id', TRAINER_ID).maybeSingle();
        const { data: metrics } = await supabase.from('client_metrics').select('*').eq('client_id', ACTUAL_CLIENT_ID).maybeSingle();
        const { data: weights } = await supabase.from('weight_logs').select('*').eq('client_id', ACTUAL_CLIENT_ID).order('created_at', { ascending: false });
        const { data: workoutsData } = await supabase.from('workouts').select('*').eq('client_id', ACTUAL_CLIENT_ID);

        // FETCH TRANSACTIONS (The Ledger)
        const { data: transData } = await supabase.from('transactions')
          .select('*')
          .or(`client_name.eq."${ACTUAL_CLIENT_ID}",client_name.eq."${realClient.name}"`)
          .order('created_at', { ascending: false });

        // FETCH LIVE SESSIONS FOR THIS TRAINER
        const { data: sessionsData } = await supabase.from('sessions').select('*').eq('trainer_id', TRAINER_ID).neq('type', 'Blocked').order('date', { ascending: true }).order('time', { ascending: true });
        // FETCH BOOKINGS JOINED WITH CLIENT NAMES
        const { data: bookingsData, error: bookingError } = await supabase.from('bookings').select('*, clients(name)');
        console.log("SUPABASE BOOKING DATA:", bookingsData);
        console.log("SUPABASE ERROR:", bookingError);

        let clientUpcoming = [];

        if (sessionsData && bookingsData) {
          const formattedSessions = sessionsData.map(session => {
            const sessionBookings = bookingsData.filter(b => b.session_id === session.id);
            const isBookedByMe = sessionBookings.some(b => b.client_id === ACTUAL_CLIENT_ID);

            const fullSession = {
              ...session,
              isBookedByMe,
              attendees: sessionBookings.map(b => ({ client_id: b.client_id, name: b.clients?.name || 'Unknown' }))
            };

            // Add to upcoming if booked by this client and in the future (today or later)
            if (isBookedByMe) {
              const sessionDateObj = parseLocalDate(session.date);
              const todayLocal = new Date();
              todayLocal.setHours(0, 0, 0, 0);
              if (sessionDateObj && sessionDateObj >= todayLocal) {
                clientUpcoming.push(fullSession);
              }
            }
            return fullSession;
          });
          setLiveSessions(formattedSessions);
          setUpcomingBookings(clientUpcoming);

          // Calculate sequential invoice numbers chronologically
          const invoiceNumMap = {};
          if (transData) {
            const sortedTrans = [...transData].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            let invoiceCounter = 101;
            sortedTrans.forEach(t => {
              const isPurchase = t.amount > 0 ||
                t.description?.toLowerCase().includes('renewal') ||
                t.description?.toLowerCase().includes('purchase');
              if (isPurchase) {
                invoiceNumMap[t.id] = invoiceCounter++;
              }
            });
          }

          // COMBINE TRANSACTIONS AND BOOKINGS INTO HISTORY LEDGER
          const combined = [];

          // Add Transactions
          if (transData) {
            transData.forEach(t => {
              const isPurchase = t.amount > 0 ||
                t.description?.toLowerCase().includes('renewal') ||
                t.description?.toLowerCase().includes('purchase');
              combined.push({
                id: `trans-${t.id}`,
                date: new Date(t.created_at),
                title: t.description || 'Manual Entry',
                type: isPurchase ? 'purchase' : 'usage',
                amount: t.amount,
                method: t.payment_method || 'Cash',
                isTransaction: true,
                invoiceNumber: invoiceNumMap[t.id] ? `INV-${invoiceNumMap[t.id]}` : null,
                rawTransaction: t
              });
            });
          }

          // Add Bookings (Past ones as Usage)
          if (bookingsData) {
            const myPastBookings = bookingsData.filter(b => b.client_id === ACTUAL_CLIENT_ID && new Date(b.session_date) < new Date());
            myPastBookings.forEach(b => {
              combined.push({
                id: `book-${b.id}`,
                date: new Date(b.session_date),
                title: `Attended Class: ${b.time_slot}`,
                type: 'usage',
                amount: 1,
                isBooking: true
              });
            });
          }

          setActivityHistory(combined.sort((a, b) => b.date - a.date));
        }

        const formattedWeights = weights ? weights.map(w => ({
          date: new Date(w.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          weight: parseFloat(w.weight),
          feeling: w.feeling
        })) : [];

        const latestWeight = formattedWeights.length > 0 ? formattedWeights[0].weight : (parseFloat(metrics?.current_weight) || 68);

        const isUnlimitedPackage = !!realClient.unlimited ||
          (realClient.package && (
            realClient.package.toLowerCase().includes('unlimited') ||
            realClient.package.toLowerCase().includes('membership') ||
            realClient.package.toLowerCase().includes('monthly') ||
            realClient.package.toLowerCase().includes('time-based') ||
            realClient.package.toLowerCase().includes('pass')
          ));

        // Parse Real Personal Records from workouts
        const prMap = {};
        if (workoutsData) {
          workoutsData.forEach(w => {
            const workoutDate = new Date(w.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            let exerciseList = [];
            try {
              exerciseList = typeof w.workout_data === 'string' ? JSON.parse(w.workout_data) : w.workout_data;
            } catch (e) {
              console.error("Error parsing workout_data:", e);
            }

            if (Array.isArray(exerciseList)) {
              exerciseList.forEach(ex => {
                if (ex.name && Array.isArray(ex.sets)) {
                  ex.sets.forEach(set => {
                    const weightVal = parseFloat(set.weight);
                    if (set.completed && !isNaN(weightVal) && weightVal > 0) {
                      const repsVal = parseInt(set.reps || set.targetReps) || 1;
                      const currentMax = prMap[ex.name]?.maxWeight || 0;
                      if (weightVal > currentMax) {
                        prMap[ex.name] = {
                          exercise: ex.name,
                          weight: `${weightVal} kg`,
                          maxWeight: weightVal,
                          reps: repsVal,
                          date: workoutDate
                        };
                      }
                    }
                  });
                }
              });
            }
          });
        }
        const parsedPRs = Object.values(prMap).sort((a, b) => b.maxWeight - a.maxWeight);

        setClientData({
          id: ACTUAL_CLIENT_ID,
          name: realClient.name || 'Client',
          email: realClient.email || '',
          phone: realClient.phone || '',
          unlimited: isUnlimitedPackage,
          trainer_id: realClient.trainer_id,
          trainerName: profile?.full_name || 'Your Coach',
          notes: realClient.notes || '',
          packageName: realClient.package || 'Standard Package',
          expiry: realClient.expiry || realClient.expiry_date || '',
          usedSessions: metrics?.used_sessions || realClient.used_sessions || 0,
          totalSessions: metrics?.total_sessions || realClient.total_sessions || 10,
          remainingSessions: realClient.remaining_package || 0,
          startWeight: parseFloat(metrics?.start_weight) || 80,
          currentWeight: latestWeight,
          goalWeight: parseFloat(metrics?.goal_weight) || 62,
          weightHistory: formattedWeights.length > 0 ? formattedWeights : [{ date: "Today", weight: 68, feeling: '🙂' }],
          prs: parsedPRs
        });

        if (profile) {
          setTrainerLogo(profile.company_logo || '');
          setTrainerCompanyName(profile.company_name || 'TrackPoint');
        }

      } catch (err) {
        console.error("Database connection error:", err.message);
        setError("We couldn't load your portal. Make sure your link is correct!");
      } finally {
        setIsLoading(false);
      }
    };

    if (clientId) fetchDashboardData();
  }, [clientId]);

  useEffect(() => {
    const fetchPackages = async () => {
      const { data } = await supabase.from('packages').select('*').order('price', { ascending: true });
      if (data) setPackagesList(data);
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    let interval;
    if (isTrackerOpen) interval = setInterval(() => setWorkoutTime(t => t + 1), 1000);
    else setWorkoutTime(0);
    return () => clearInterval(interval);
  }, [isTrackerOpen]);

  useEffect(() => {
    let interval;
    if (restTime > 0 && isTrackerOpen) interval = setInterval(() => setRestTime(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [restTime, isTrackerOpen]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full bg-[#F9F7F2] items-center justify-center flex-col">
        <Loader2 size={48} className="text-[#0B4550] animate-spin mb-4" />
        <h2 className="text-2xl font-medium text-[#0B4550]">Loading your portal...</h2>
      </div>
    );
  }

  if (error || !clientData) {
    return (
      <div className="flex h-screen w-full bg-[#F9F7F2] items-center justify-center flex-col text-center p-6">
        <h2 className="text-5xl font-medium text-red-500 mb-4">Oops!</h2>
        <p className="text-xl font-medium text-[#0B4550]">{error}</p>
      </div>
    );
  }

  const remaining = clientData.remaining_package !== undefined ? clientData.remaining_package : (clientData.remainingSessions || 0);
  const hasBookingPrivilege = !!clientData?.unlimited || remaining > 0;
  const remainingSessions = clientData?.unlimited ? 9999 : remaining;
  const weightProgress = Math.max(0, Math.min(100, ((clientData.startWeight - clientData.currentWeight) / (clientData.startWeight - clientData.goalWeight)) * 100));
  const getDaysInMonth = (month, year = 2026) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOffset = (month, year = 2026) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  // Filter live sessions for the specific date selected in the modal
  const filteredSessionsForDate = liveSessions.filter(s => {
    if (s.type === '1-on-1' || s.type === 'Blocked') return false;
    const sessionDate = parseLocalDate(s.date);
    if (!sessionDate) return false;
    return sessionDate.getDate() === selectedDate && sessionDate.getMonth() === currentMonth && sessionDate.getFullYear() === 2026;
  });

  const handleQuickBook = async (session) => {
    if (session.attendees?.length >= session.capacity) return alert("Sorry, this class is full!");
    if (session.isBookedByMe) return alert("You are already booked for this class!");

    // Check if client has package sessions left
    const remaining = clientData.remaining_package !== undefined ? clientData.remaining_package : clientData.remainingSessions;
    if (!clientData?.unlimited && remaining <= 0) {
      setIsTopUpOpen(true);
      return;
    }

    // 1. Save Relational Booking to Database
    const { error } = await supabase.from('bookings').insert([{
      client_id: clientData.id,
      session_id: session.id,
      session_date: session.date,
      time_slot: session.time,
      status: 'Booked'
    }]);

    if (error) {
      alert("Booking failed: " + error.message);
      return;
    }

    // 2. Deduct session IF they are not on an unlimited package
    let newRemaining = remaining;
    if (!clientData.unlimited) {
      newRemaining = remaining - 1;
      const newUsed = clientData.usedSessions + 1;
      await supabase.from('clients').update({ remaining_package: newRemaining, used_sessions: newUsed }).eq('id', clientData.id);
      await supabase.from('client_metrics').update({ used_sessions: newUsed }).eq('client_id', clientData.id);
      setClientData(prev => ({
        ...prev,
        remainingSessions: newRemaining,
        remaining_package: newRemaining,
        usedSessions: newUsed
      }));
    }

    // 3. Instantly update UI arrays so capacity changes
    const updatedSession = {
      ...session,
      isBookedByMe: true,
      attendees: session.attendees ? [...session.attendees, { client_id: clientData.id, name: clientData.name }] : [{ client_id: clientData.id, name: clientData.name }]
    };

    setLiveSessions(prev => prev.map(s => s.id === session.id ? updatedSession : s));
    setUpcomingBookings(prev => {
      const newList = [...prev, updatedSession];
      return newList.sort((a, b) => new Date(a.date) - new Date(b.date));
    });

    alert("🎉 Class booked successfully!");
  };

  const handleQuickCancel = async (session) => {
    // Prevent cancelling past sessions
    const sessionDateObj = parseLocalDate(session.date);
    const todayLocal = new Date();
    todayLocal.setHours(0, 0, 0, 0);
    if (sessionDateObj && sessionDateObj < todayLocal) {
      alert("You cannot cancel past classes.");
      return;
    }

    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      // 1. Remove the booking from Supabase
      const { error } = await supabase
        .from('bookings')
        .delete()
        .match({ client_id: clientData.id, session_id: session.id });

      if (error) throw error;

      // 2. Refund the session if they are NOT on an unlimited package
      const remaining = clientData.remaining_package !== undefined ? clientData.remaining_package : clientData.remainingSessions;
      let newRemaining = remaining;
      if (!clientData.unlimited) {
        newRemaining = remaining + 1;
        const newUsed = Math.max(0, clientData.usedSessions - 1); // Prevent negative numbers

        await supabase.from('clients').update({ remaining_package: newRemaining, used_sessions: newUsed }).eq('id', clientData.id);
        await supabase.from('client_metrics').update({ used_sessions: newUsed }).eq('client_id', clientData.id);

        setClientData(prev => ({
          ...prev,
          remainingSessions: newRemaining,
          remaining_package: newRemaining,
          usedSessions: newUsed
        }));
      }

      // 3. Update UI arrays
      const updatedSession = {
        ...session,
        isBookedByMe: false,
        attendees: session.attendees.filter(a => a.client_id !== clientData.id)
      };

      setLiveSessions(prev => prev.map(s => s.id === session.id ? updatedSession : s));
      setUpcomingBookings(prev => prev.filter(b => b.id !== session.id));

      alert("Booking cancelled successfully.");

    } catch (error) {
      alert("Error cancelling booking: " + error.message);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedLiveSession) return;
    if (selectedLiveSession.attendees?.length >= selectedLiveSession.capacity) return alert("Sorry, this class is full!");
    if (selectedLiveSession.isBookedByMe) return alert("You are already booked for this class!");

    // Only deduct if not unlimited
    if (!clientData?.unlimited && clientData?.remainingSessions <= 0) {
      setIsBookingOpen(false);
      setIsTopUpOpen(true);
      return;
    }

    // 1. Save Relational Booking to Database
    const { error } = await supabase.from('bookings').insert([{
      client_id: clientData.id,
      session_id: selectedLiveSession.id,
      session_date: selectedLiveSession.date,
      time_slot: selectedLiveSession.time,
      status: 'Booked'
    }]);

    if (error) {
      alert("Booking failed: " + error.message);
      return;
    }

    // 2. Deduct session IF they are not on an unlimited package
    if (!clientData.unlimited) {
      const remainingVal = clientData.remaining_package !== undefined ? clientData.remaining_package : clientData.remainingSessions;
      const newRemaining = remainingVal - 1;
      const newUsed = clientData.usedSessions + 1;
      await supabase.from('clients').update({ remaining_package: newRemaining, used_sessions: newUsed }).eq('id', clientData.id);
      await supabase.from('client_metrics').update({ used_sessions: newUsed }).eq('client_id', clientData.id);
      setClientData(prev => ({
        ...prev,
        remainingSessions: newRemaining,
        remaining_package: newRemaining,
        usedSessions: newUsed
      }));
    }

    // 3. Instantly update the UI arrays so capacity changes!
    const updatedSession = {
      ...selectedLiveSession,
      isBookedByMe: true,
      attendees: selectedLiveSession.attendees ? [...selectedLiveSession.attendees, { client_id: clientData.id, name: clientData.name }] : [{ client_id: clientData.id, name: clientData.name }]
    };

    setLiveSessions(prev => prev.map(s => s.id === selectedLiveSession.id ? updatedSession : s));
    setUpcomingBookings(prev => {
      const newList = [...prev, updatedSession];
      return newList.sort((a, b) => new Date(a.date) - new Date(b.date));
    });

    setBookingStep('success');
  };
  const handlePurchasePackage = async (pkg) => {
    const confirmed = window.confirm(`[STRIPE CHECKOUT SIMULATION]\n\nRedirecting to secure payment gateway to purchase:\n${pkg.name} for RM ${pkg.price}\n\nSimulate a successful payment?`);
    if (!confirmed) return;

    try {
      console.log("1. Starting Checkout. Package:", pkg);

      // ✨ THE SHIELD: Strictly require the Client's Trainer ID ✨
      const finalTrainerId = clientData.trainer_id || clientData.trainerId;
      if (!finalTrainerId) {
        throw new Error("SECURITY HALT: No Trainer ID found for this client.");
      }

      // 2. Calculate the Math
      const isUnlimited = pkg.type === 'Unlimited';
      const currentSessions = clientData.remaining_package || clientData.remainingSessions || 0;
      const newRemaining = isUnlimited ? currentSessions : Number(currentSessions) + Number(pkg.session_count);

      const currentExpiry = clientData.expiry ? new Date(clientData.expiry) : new Date();
      const baseDate = currentExpiry > new Date() ? currentExpiry : new Date();
      const newExpiryDate = new Date(baseDate.getTime() + (pkg.validity_days * 24 * 60 * 60 * 1000));
      const formattedExpiry = newExpiryDate.toISOString().split('T')[0];

      // 3. Update Client Database
      console.log("3. Updating Client Database...");
      const { error: clientError } = await supabase.from('clients')
        .update({
          remaining_package: newRemaining,
          unlimited: isUnlimited,
          expiry: formattedExpiry
        })
        .eq('id', clientData.id);

      if (clientError) throw clientError;

      // 4. Log the Receipt
      console.log("4. Logging Receipt to Transactions Table...");
      const { error: transactionError } = await supabase.from('transactions')
        .insert([{
          trainer_id: finalTrainerId,
          client_id: clientData.id,
          client_name: clientData.name,
          description: `Purchased: ${pkg.name}`,
          amount: pkg.price,
          payment_method: 'Credit Card (Simulated)'
        }]);

      if (transactionError) throw transactionError;

      // 5. Instantly Update the UI
      console.log("5. Updating Dashboard UI...");
      setClientData(prev => ({
        ...prev,
        remainingSessions: newRemaining,
        remaining_package: newRemaining,
        unlimited: isUnlimited,
        expiry: formattedExpiry
      }));

      alert(`🎉 Payment Successful! Your account has been updated.\nNew Expiry Date: ${formattedExpiry}`);
      setIsTopUpOpen(false);

    } catch (error) {
      console.error("🚨 CHECKOUT CRASHED:", error);
      alert("Checkout failed: " + error.message);
    }
  };
  const handleCancelBooking = async () => {
    if (!viewClassDetails) return;

    // Optional: Add a quick confirmation popup so they don't click it by accident
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      // 1. Remove the booking from Supabase
      const { error } = await supabase
        .from('bookings')
        .delete()
        .match({ client_id: clientData.id, session_id: viewClassDetails.id });

      if (error) throw error;

      // 2. Refund the session if they are NOT on an unlimited package
      if (!clientData.unlimited) {
        const newRemaining = clientData.remainingSessions + 1;
        const newUsed = Math.max(0, clientData.usedSessions - 1); // Prevent negative numbers

        await supabase.from('clients').update({ remaining_package: newRemaining, used_sessions: newUsed }).eq('id', clientData.id);
        await supabase.from('client_metrics').update({ used_sessions: newUsed }).eq('client_id', clientData.id);

        setClientData(prev => ({ ...prev, remainingSessions: newRemaining, usedSessions: newUsed }));
      }

      // 3. MAGIC FIX: Instantly update the UI arrays to free up the slot
      const updatedSession = {
        ...viewClassDetails,
        isBookedByMe: false,
        attendees: viewClassDetails.attendees.filter(a => a.client_id !== clientData.id)
      };

      setLiveSessions(prev => prev.map(s => s.id === viewClassDetails.id ? updatedSession : s));
      setUpcomingBookings(prev => prev.filter(b => b.id !== viewClassDetails.id));

      // If the booking modal happens to be open in the background, update it too
      if (selectedLiveSession?.id === viewClassDetails.id) {
        setSelectedLiveSession(updatedSession);
      }

      setViewClassDetails(null); // Close the popup

    } catch (error) {
      alert("Error cancelling booking: " + error.message);
    }
  };

  const handlePayment = async () => {
    setTimeout(async () => {
      const newTotal = clientData.totalSessions + selectedPackage.sessions;
      await supabase.from('client_metrics').update({ total_sessions: newTotal }).eq('client_id', clientData.id);
      await supabase.from('invoices').insert([{
        client_id: clientData.id, package_name: selectedPackage.name, sessions_added: selectedPackage.sessions, amount_paid: selectedPackage.price
      }]);
      setClientData(prev => ({ ...prev, totalSessions: newTotal }));
      setTopUpStep('success');
    }, 800);
  };

  const saveWeightProgress = async () => {
    // 1. Insert log with the client-selected past/present date
    const { error: logError } = await supabase.from('weight_logs').insert([{
      client_id: clientData.id,
      weight: tempWeight,
      feeling: tempFeeling,
      created_at: new Date(tempDate).toISOString()
    }]);
    if (logError) return alert("Database Error (Logs): " + logError.message);

    // 2. Update client metrics
    const { error: metricError } = await supabase.from('client_metrics').update({ current_weight: tempWeight, goal_weight: tempGoal }).eq('client_id', clientData.id);
    if (metricError) return alert("Database Error (Metrics): " + metricError.message);

    // 3. Re-fetch all weight logs dynamically to guarantee absolute correctness and perfect sorting
    const { data: updatedWeights } = await supabase.from('weight_logs')
      .select('*')
      .eq('client_id', clientData.id)
      .order('created_at', { ascending: false });

    const formattedWeights = updatedWeights ? updatedWeights.map(w => ({
      date: new Date(w.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: parseFloat(w.weight),
      feeling: w.feeling
    })) : [];

    const latestWeight = formattedWeights.length > 0 ? formattedWeights[0].weight : tempWeight;

    setClientData(prev => ({
      ...prev,
      currentWeight: latestWeight,
      goalWeight: tempGoal,
      weightHistory: formattedWeights
    }));
    setIsWeightModalOpen(false);
  };

  const saveSettings = async () => {
    await supabase.from('profiles').update({ full_name: tempProfileName, email: tempProfileEmail, phone: tempProfilePhone }).eq('id', clientData.id);
    setClientData(prev => ({ ...prev, name: tempProfileName, email: tempProfileEmail, phone: tempProfilePhone }));
    setIsSettingsOpen(false);
  };

  const finishWorkoutSession = async () => {
    await supabase.from('workouts').insert([{ client_id: clientData.id, duration_seconds: workoutTime, workout_data: generatedWorkout }]);

    // Re-fetch workouts to dynamically recalculate and update PRs!
    const { data: workoutsData } = await supabase.from('workouts').select('*').eq('client_id', clientData.id);
    const prMap = {};
    if (workoutsData) {
      workoutsData.forEach(w => {
        const workoutDate = new Date(w.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        let exerciseList = [];
        try {
          exerciseList = typeof w.workout_data === 'string' ? JSON.parse(w.workout_data) : w.workout_data;
        } catch (e) {
          console.error("Error parsing workout_data:", e);
        }

        if (Array.isArray(exerciseList)) {
          exerciseList.forEach(ex => {
            if (ex.name && Array.isArray(ex.sets)) {
              ex.sets.forEach(set => {
                const weightVal = parseFloat(set.weight);
                if (set.completed && !isNaN(weightVal) && weightVal > 0) {
                  const repsVal = parseInt(set.reps || set.targetReps) || 1;
                  const currentMax = prMap[ex.name]?.maxWeight || 0;
                  if (weightVal > currentMax) {
                    prMap[ex.name] = {
                      exercise: ex.name,
                      weight: `${weightVal} kg`,
                      maxWeight: weightVal,
                      reps: repsVal,
                      date: workoutDate
                    };
                  }
                }
              });
            }
          });
        }
      });
    }
    const parsedPRs = Object.values(prMap).sort((a, b) => b.maxWeight - a.maxWeight);

    alert(`Workout Saved! Total time: ${formatTime(workoutTime)}`);
    setClientData(prev => ({ ...prev, prs: parsedPRs }));
    setIsTrackerOpen(false); setGeneratedWorkout(null); setStep(1); setSelectedMuscles([]); setWorkoutTime(0); setRestTime(0);
    setWorkoutDuration(45); setWorkoutStyle('Standard'); setInjuries([]); setExcludeExercises(''); setIncludeWarmup(false); setIncludeCooldown(false); setBodyView('front');
  };

  const closeBookingDrawer = () => { setIsBookingOpen(false); setTimeout(() => { setBookingStep('select'); setSelectedLiveSession(null); }, 300); };
  const openBookingDrawer = (date = null) => { if (date) setSelectedDate(date); setBookingStep('select'); setSelectedLiveSession(null); setIsBookingOpen(true); };
  const openWeightModal = () => { setTempWeight(clientData.currentWeight); setTempGoal(clientData.goalWeight); setTempFeeling('🙂'); setTempDate(localDateTime); setIsWeightModalOpen(true); };
  const openSettingsModal = () => { setTempProfileName(clientData.name); setTempProfileEmail(clientData.email); setTempProfilePhone(clientData.phone); setIsSettingsOpen(true); };

  const toggleSelection = (item, list, setList) => { if (list.includes(item)) setList(list.filter(i => i !== item)); else setList([...list, item]); };
  const generateWorkout = async () => {
    setIsGenerating(true);
    const enrichedPrompt = `
[STRICT PARAMETERS]
Workout Duration: ${workoutDuration} minutes
Style: ${workoutStyle === 'Circuits' ? 'Circuits & Supersets (minimal rest between exercises)' : 'Standard Sets (structured rest)'}
Include Warmup: ${includeWarmup ? 'Yes' : 'No'}
Include Cooldown: ${includeCooldown ? 'Yes' : 'No'}
Joint Care (AVOID putting heavy strain on these areas): ${injuries.length > 0 ? injuries.join(', ') : 'None'}
Exclude these exercises: ${excludeExercises || 'None'}
Client Special Requests: ${customPrompt || 'None'}
    `.trim();

    try {
      // 🤖 Call the AI Brain with customized user selections
      const { data, error } = await supabase.functions.invoke('generate-workout', {
        body: {
          muscles: selectedMuscles,
          equipment: selectedEquip,
          clientName: clientData.name,
          difficulty: difficulty,
          goal: workoutGoal,
          customPrompt: enrichedPrompt
        }
      });

      if (error) throw error;
      setGeneratedWorkout(data.workout);
      setStep(4);
    } catch (err) {
      console.error("AI Generation Failed, using local engine:", err);
      // Robust Fallback: Deeply tailored rule-based generation
      let newWorkout = [];

      // 1. Warm-up
      if (includeWarmup) {
        newWorkout.push({
          muscle: "Warm-up",
          name: "Dynamic Warm-up (Arm Circles, Leg Swings, Cat-Cow)",
          sets: [{ targetReps: "5 Mins", completed: false, weight: '' }],
          restDuration: 0
        });
      }

      let setsCount = 3;
      if (difficulty === 'Beginner') setsCount = 2;
      else if (difficulty === 'Advanced') setsCount = 4;

      let targetRepsStr = "10";
      let baseRest = 60;
      if (workoutGoal === 'Strength') {
        targetRepsStr = "5";
        baseRest = 90;
      } else if (workoutGoal === 'Endurance') {
        targetRepsStr = "15";
        baseRest = 30;
      }
      if (workoutStyle === 'Circuits') {
        baseRest = 15;
      }

      // 2. Adjust target count based on duration
      let targetExerciseCount = 5;
      if (workoutDuration === 30) targetExerciseCount = 3;
      else if (workoutDuration === 60) targetExerciseCount = 7;
      else if (workoutDuration === 90) targetExerciseCount = 10;

      let exercisesPerMuscle = Math.max(1, Math.floor(targetExerciseCount / (selectedMuscles.length || 1)));

      const injuryExclusions = {
        "Lower Back": ["Barbell Bent-Over Row", "Pendlay Row", "Barbell Back Squat"],
        "Knees": ["Jump Squats", "Walking Lunges", "Dumbbell Lunges"],
        "Shoulders": ["Overhead Press (OHP)", "Push Press", "Dumbbell Overhead Press", "Pike Push-ups", "Pull-ups"],
        "Wrists": ["Push-ups", "Wide Push-ups", "Diamond Push-ups", "Plank"]
      };

      let excludedForInjuries = [];
      injuries.forEach(injury => {
        if (injuryExclusions[injury]) {
          excludedForInjuries.push(...injuryExclusions[injury]);
        }
      });
      const manualExcludes = excludeExercises.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);

      selectedMuscles.forEach(muscle => {
        let possibleExercises = [];
        selectedEquip.forEach(eq => { if (EXERCISE_DB[muscle] && EXERCISE_DB[muscle][eq]) possibleExercises.push(...EXERCISE_DB[muscle][eq]); });
        if (possibleExercises.length === 0) possibleExercises.push(...(EXERCISE_DB[muscle]["Bodyweight"] || []));

        // Filter out by joint protections and manual exclusions
        possibleExercises = possibleExercises.filter(ex => {
          const isExcludedByInjury = excludedForInjuries.includes(ex);
          const isExcludedManually = manualExcludes.some(m => ex.toLowerCase().includes(m));
          return !isExcludedByInjury && !isExcludedManually;
        });

        const shuffled = [...new Set(possibleExercises)].sort(() => 0.5 - Math.random()).slice(0, exercisesPerMuscle);
        shuffled.forEach(ex => {
          if (!newWorkout.some(w => w.name === ex)) {
            const sets = [];
            for (let s = 0; s < setsCount; s++) {
              sets.push({ targetReps: targetRepsStr, completed: false, weight: '' });
            }
            newWorkout.push({ muscle, name: ex, sets, restDuration: baseRest });
          }
        });
      });

      // 3. Cool-down
      if (includeCooldown) {
        newWorkout.push({
          muscle: "Cool-down",
          name: "Full-Body Static Stretching (Hamstrings, Chest, Hip Flexors)",
          sets: [{ targetReps: "5 Mins", completed: false, weight: '' }],
          restDuration: 0
        });
      }

      if (newWorkout.length === 0) {
        newWorkout.push({
          muscle: "Core",
          name: "Plank",
          sets: [{ targetReps: "60s", completed: false, weight: '' }],
          restDuration: 30
        });
      }

      setGeneratedWorkout(newWorkout);
      setStep(4);
    } finally {
      setIsGenerating(false);
    }
  };

  const shuffleExercise = (index) => {
    const targetMuscle = generatedWorkout[index].muscle;
    let possible = [];
    selectedEquip.forEach(eq => { if (EXERCISE_DB[targetMuscle] && EXERCISE_DB[targetMuscle][eq]) possible.push(...EXERCISE_DB[targetMuscle][eq]); });
    if (possible.length === 0) possible.push(...(EXERCISE_DB[targetMuscle]["Bodyweight"] || []));

    // Filter out by joint protections and manual exclusions
    const injuryExclusions = {
      "Lower Back": ["Barbell Bent-Over Row", "Pendlay Row", "Barbell Back Squat"],
      "Knees": ["Jump Squats", "Walking Lunges", "Dumbbell Lunges"],
      "Shoulders": ["Overhead Press (OHP)", "Push Press", "Dumbbell Overhead Press", "Pike Push-ups", "Pull-ups"],
      "Wrists": ["Push-ups", "Wide Push-ups", "Diamond Push-ups", "Plank"]
    };
    let excludedForInjuries = [];
    injuries.forEach(injury => {
      if (injuryExclusions[injury]) {
        excludedForInjuries.push(...injuryExclusions[injury]);
      }
    });
    const manualExcludes = excludeExercises.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);

    possible = possible.filter(ex => {
      const isExcludedByInjury = excludedForInjuries.includes(ex);
      const isExcludedManually = manualExcludes.some(m => ex.toLowerCase().includes(m));
      return !isExcludedByInjury && !isExcludedManually;
    });

    const newEx = possible[Math.floor(Math.random() * possible.length)] || "Plank";

    let setsCount = 3;
    if (difficulty === 'Beginner') setsCount = 2;
    else if (difficulty === 'Advanced') setsCount = 4;

    let targetRepsStr = "10";
    let baseRest = 60;
    if (workoutGoal === 'Strength') {
      targetRepsStr = "5";
      baseRest = 90;
    } else if (workoutGoal === 'Endurance') {
      targetRepsStr = "15";
      baseRest = 30;
    }

    const sets = [];
    for (let s = 0; s < setsCount; s++) {
      sets.push({ targetReps: targetRepsStr, completed: false, weight: '' });
    }

    const updated = [...generatedWorkout];
    updated[index] = {
      muscle: targetMuscle,
      name: newEx,
      sets,
      restDuration: baseRest
    };
    setGeneratedWorkout(updated);
  };

  const removeExercise = (index) => {
    const updated = generatedWorkout.filter((_, i) => i !== index);
    setGeneratedWorkout(updated);
  };
  const toggleSetComplete = (exIndex, setIndex) => {
    const updated = [...generatedWorkout];
    updated[exIndex].sets[setIndex].completed = !updated[exIndex].sets[setIndex].completed;
    setGeneratedWorkout(updated);

    if (updated[exIndex].sets[setIndex].completed) {
      const restSecs = updated[exIndex].restDuration || 60;
      setRestTime(restSecs);
    } else {
      setRestTime(0);
    }
  };
  const updateSetWeight = (exIndex, setIndex, val) => {
    const updated = [...generatedWorkout];
    updated[exIndex].sets[setIndex].weight = val;
    setGeneratedWorkout(updated);
  };

  return (
    <div className="flex h-screen w-full bg-[#F9F7F2] font-sans text-[#0B4550] overflow-hidden p-3 md:p-4 lg:p-6 gap-4 md:gap-6 relative">

      {/* SIDEBAR - HIDDEN ON MOBILE */}
      <aside className="hidden lg:flex w-[88px] h-full flex-col justify-between shrink-0 relative z-40">
        <div className=" h-24 flex items-center justify-center -sm border border-gray-100">
          <img src={trainerLogo || newLogo} alt={trainerCompanyName} className="h-20 w-auto object-contain max-h-[80px]" onError={(e) => e.target.style.display = 'none'} />
        </div>
        <nav className="bg-white rounded-full py-6 flex flex-col items-center gap-4 shadow-sm border border-gray-100">
          <NavIcon icon={<Home size={24} />} isActive={activeNav === 'Home'} onClick={() => setActiveNav('Home')} />
          <NavIcon icon={<TrendingUp size={24} />} isActive={activeNav === 'Progress'} onClick={() => setActiveNav('Progress')} />
          <NavIcon icon={<FileText size={24} />} isActive={activeNav === 'History'} onClick={() => setActiveNav('History')} />
        </nav>
        <div onClick={openSettingsModal} className="bg-white rounded-full py-4 flex flex-col items-center shadow-sm border border-gray-100 cursor-pointer hover:border-[#0B4550] transition-colors group">
          <div className="w-12 h-12 rounded-full bg-[#0B4550] flex items-center justify-center text-[#E6FF2B] font-medium group-hover:scale-105 transition-transform">
            {clientData.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-150 flex justify-around items-center pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] px-2 z-[50] shadow-sm ${isBuilderOpen || isTrackerOpen ? 'hidden' : ''}`}>
        <button onClick={() => setActiveNav('Home')} className={`flex flex-col items-center gap-1 ${activeNav === 'Home' ? 'text-[#0B4550]' : 'text-[#898A8D]'}`}>
          <Home size={24} />
          <span className="text-[10px] font-bold mt-1">Home</span>
        </button>
        <button onClick={() => setActiveNav('Progress')} className={`flex flex-col items-center gap-1 ${activeNav === 'Progress' ? 'text-[#0B4550]' : 'text-[#898A8D]'}`}>
          <TrendingUp size={24} />
          <span className="text-[10px] font-bold mt-1">Progress</span>
        </button>
        <button onClick={() => setActiveNav('History')} className={`flex flex-col items-center gap-1 ${activeNav === 'History' ? 'text-[#0B4550]' : 'text-[#898A8D]'}`}>
          <FileText size={24} />
          <span className="text-[10px] font-bold mt-1">History</span>
        </button>
        <button onClick={openSettingsModal} className={`flex flex-col items-center gap-1 ${isSettingsOpen ? 'text-[#0B4550]' : 'text-[#898A8D]'}`}>
          <User size={24} />
          <span className="text-[10px] font-bold mt-1">Profile</span>
        </button>
      </div>

      <main className="flex-1 h-full overflow-y-auto flex flex-col relative z-10 pb-36 md:pb-0">

        {/* MOBILE HEADER BAR */}
        <header className="md:hidden flex flex-col gap-4 mb-6 pt-2">
          <div className="flex items-center justify-between bg-white border border-gray-150 rounded-[2rem] p-4 shadow-sm shrink-0">
            <div className="flex items-center gap-3">
              <img src={trainerLogo || newLogo} alt={trainerCompanyName} className="h-10 w-auto object-contain max-h-[40px]" onError={(e) => e.target.style.display = 'none'} />
              <span className="font-black text-sm text-[#0B4550] tracking-widest uppercase">{trainerCompanyName}</span>
            </div>
            <button onClick={openSettingsModal} className="w-10 h-10 rounded-full bg-[#F9F7F2] text-[#0B4550] border border-gray-150 flex items-center justify-center font-bold text-sm shadow-sm active:scale-95 transition-all">
              {getInitials(clientData.name)}
            </button>
          </div>

          <div className="px-2">
            <h1 className="text-3xl font-black text-[#0B4550] mb-1">
              {activeNav === 'Progress' ? 'Your Progress' :
                activeNav === 'History' ? 'Activity Ledger' :
                  `${getGreeting()}, ${clientData.name.split(' ')[0]}!`}
            </h1>
            <p className="text-xs font-bold text-gray-500 italic max-w-[85%] leading-relaxed">
              {activeNav === 'Home' && dailyQuote}
            </p>
          </div>
        </header>

        {/* DESKTOP HEADER */}
        <header className="hidden md:flex justify-between items-center mb-8 px-2">
          <div>
            <h1 className="text-3xl md:text-5xl font-medium text-[#0B4550] mb-2 leading-tight">
              {activeNav === 'Progress' ? 'Your Progress' :
                activeNav === 'History' ? 'Activity Ledger' :
                  `${getGreeting()}, ${clientData.name.split(' ')[0]}!`}
            </h1>
            <p className="text-lg text-[#898A8D] font-medium italic mt-1">{dailyQuote}</p>
          </div>
          <button onClick={() => {
            const hasBookingPrivilege = clientData?.unlimited || (clientData?.remaining_package !== undefined ? clientData.remaining_package > 0 : clientData?.remainingSessions > 0);
            if (hasBookingPrivilege) setIsBookingOpen(true); else setIsTopUpOpen(true);
          }} className="hidden md:block bg-[#0B4550] text-[#E6FF2B] px-6 md:px-8 py-3.5 rounded-full font-medium shadow-md hover:scale-105 transition-all whitespace-nowrap">
            {(clientData?.unlimited || (clientData?.remaining_package !== undefined ? clientData.remaining_package > 0 : clientData?.remainingSessions > 0)) ? "Book Session" : "Top Up to Book"}
          </button>
        </header>

        {activeNav === 'Home' && (
          <>
            {/* DESKTOP HOME VIEW */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 flex-1 pb-4 animate-in fade-in duration-500">
              <div className="md:col-span-12 lg:col-span-7 bg-white rounded-[2.5rem] p-5 sm:p-6 md:p-8 shadow-sm border border-gray-100 relative overflow-hidden flex flex-col h-auto lg:h-[380px] min-h-[340px]">
                <div className="flex justify-between items-start z-10 mb-2">
                  <div>
                    <h3 className="font-bold text-xs text-gray-400 uppercase tracking-widest">Active Package</h3>
                    <h2 className="font-bold text-3xl text-[#0B4550] tracking-tight">{clientData.packageName}</h2>
                  </div>
                  <button onClick={() => setIsTopUpOpen(true)} className="bg-[#F9F7F2] text-[#0B4550] px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#E6FF2B] transition-colors border border-gray-100 shadow-sm flex items-center gap-2 relative z-20"><CreditCard size={16} /> Top Up</button>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#E6FF2B] rounded-full filter blur-3xl opacity-40 z-0 animate-pulse"></div>

                <div className="flex-1 flex flex-col justify-end z-10 pb-2 w-full">
                  {clientData.unlimited ? (
                    /* TIME-BASED / UNLIMITED LAYOUT */
                    <div className="space-y-5 w-full">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold uppercase tracking-wider animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          Unlimited Access Plan
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 bg-[#F9F7F2]/80 backdrop-blur-md rounded-2xl p-5 border border-gray-100">
                        <div>
                          <p className="text-xs font-bold text-[#898A8D] uppercase tracking-widest mb-1">Expiration Date</p>
                          <p className="text-lg font-bold text-[#0B4550]">
                            {clientData.expiry ? formatDbDate(clientData.expiry) : 'No Expiration'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-[#898A8D] uppercase tracking-widest mb-1">Time Remaining</p>
                          <p className="text-lg font-bold text-[#0B4550]">
                            {(() => {
                              const days = calculateRemainingDays(clientData.expiry);
                              if (days === null) return 'Unlimited Days';
                              if (days < 0) return 'Expired';
                              if (days === 0) return 'Expires Today';
                              return `${days} Days Left`;
                            })()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* SESSION-BASED LAYOUT */
                    <div className="space-y-4 w-full">
                      <div className="space-y-3.5">
                        <LegendItem
                          color={(clientData.remaining_package || clientData.remainingSessions || 0) <= 0 ? "bg-red-400" : "bg-[#E6FF2B]"}
                          label="Remaining Sessions"
                          value={clientData.remaining_package !== undefined ? clientData.remaining_package : clientData.remainingSessions}
                        />
                        <LegendItem
                          color="bg-[#0B4550]"
                          label="Completed Sessions"
                          value={clientData.usedSessions || 0}
                        />

                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mt-2 relative">
                          <div
                            className={`h-full transition-all duration-700 ${(clientData.remaining_package || clientData.remainingSessions || 0) <= 0 ? 'bg-red-400' : 'bg-[#0B4550]'}`}
                            style={{ width: `${((clientData.usedSessions || 0) / ((clientData.usedSessions || 0) + (clientData.remaining_package !== undefined ? clientData.remaining_package : clientData.remainingSessions || 1))) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 bg-[#F9F7F2]/80 backdrop-blur-md rounded-2xl p-4 border border-gray-100 mt-2">
                        <div>
                          <p className="text-[10px] font-bold text-[#898A8D] uppercase tracking-widest mb-0.5">Package Expiration</p>
                          <p className="text-sm font-bold text-[#0B4550]">
                            {clientData.expiry ? formatDbDate(clientData.expiry) : 'No Expiration'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-[#898A8D] uppercase tracking-widest mb-0.5">Time Remaining</p>
                          <p className="text-sm font-bold text-[#0B4550]">
                            {(() => {
                              const days = calculateRemainingDays(clientData.expiry);
                              if (days === null) return 'No Time Limit';
                              if (days < 0) return 'Expired';
                              if (days === 0) return 'Expires Today';
                              return `${days} Days Left`;
                            })()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-6 lg:col-span-5 bg-[#0B4550] rounded-[2.5rem] p-5 sm:p-6 md:p-8 shadow-sm text-white flex flex-col h-[380px] overflow-hidden">
                <div className="flex justify-between items-center mb-6 shrink-0">
                  <div>
                    <h3 className="font-medium text-2xl">Available Classes</h3>
                    <p className="text-white/60 text-xs font-medium uppercase tracking-wider mt-0.5">Quick 1-Click Booking</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#E6FF2B]">
                    <Calendar size={20} />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-white/20 hover:scrollbar-thumb-white/40">
                  {(() => {
                    const todayStr = new Date().toISOString().split('T')[0];
                    const futureSessions = liveSessions.filter(s => s.date >= todayStr && s.type !== '1-on-1' && s.type !== 'Blocked');

                    if (futureSessions.length === 0) {
                      return (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-white/50">
                          <Calendar size={32} className="mb-2 opacity-30" />
                          <p className="text-sm font-medium">No classes scheduled yet.</p>
                        </div>
                      );
                    }

                    return futureSessions.map(session => {
                      const isFull = session.attendees?.length >= session.capacity;
                      return (
                        <div key={session.id} className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl p-4 transition-all flex justify-between items-center gap-4 relative group">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#E6FF2B] text-[#0B4550] text-[9px] font-bold uppercase tracking-wider">
                                {formatDbDate(session.date)}
                              </span>
                              <span className="text-[10px] font-bold text-white/80">
                                {session.time}
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-white leading-snug truncate mb-1">
                              {session.title}
                            </h4>
                            <p className="text-xs text-white/70 flex items-center gap-1 font-medium">
                              <User size={12} className="text-[#E6FF2B]" /> {session.coach || session.trainer || 'Coach Keith'}
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">
                              {session.attendees?.length || 0} / {session.capacity} Slots
                            </p>
                            {session.isBookedByMe ? (
                              <div className="flex flex-col items-end gap-1">
                                <span className="text-xs font-bold text-[#E6FF2B] bg-white/20 py-1.5 px-3.5 rounded-xl border border-white/10 flex items-center gap-1">
                                  Booked ✓
                                </span>
                                <button
                                  onClick={() => handleQuickCancel(session)}
                                  className="text-[10px] font-bold text-red-300 hover:text-red-400 hover:underline transition-colors mt-0.5 mr-1 animate-in fade-in"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : isFull ? (
                              <span className="inline-block text-xs font-bold text-white/40 bg-white/5 py-1.5 px-3.5 rounded-xl border border-transparent">
                                Full
                              </span>
                            ) : (
                              <button
                                onClick={() => handleQuickBook(session)}
                                className="bg-[#E6FF2B] hover:bg-white text-[#0B4550] py-2 px-4 rounded-xl text-xs font-bold transition-all shadow-md hover:scale-[1.05]"
                              >
                                Book Spot
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              <div className="md:col-span-6 lg:col-span-5 flex flex-col gap-4 md:gap-6">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex-1 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-2xl text-[#0B4550] mb-1">{generatedWorkout ? "Today's Plan" : "Workout Builder"}</h3>
                    <p className="text-[#898A8D] font-medium text-sm mb-4">{generatedWorkout ? "Ready to crush it?" : "Generate your session"}</p>
                    <div className="flex gap-2">
                      <button onClick={() => { if (generatedWorkout) setIsTrackerOpen(true); else { setStep(1); setIsBuilderOpen(true); } }} className="flex items-center gap-2 text-[#0B4550] font-medium bg-[#E6FF2B] px-5 py-2.5 rounded-full hover:scale-105 transition-all text-sm z-20 relative">{generatedWorkout ? "Start Workout" : "Start Building"} <Plus size={16} /></button>
                      {generatedWorkout && <button onClick={() => { setGeneratedWorkout(null); setStep(1); setIsBuilderOpen(true); }} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-50 hover:text-red-500 text-[#0B4550] transition-all z-20 relative"><RefreshCw size={16} /></button>}
                    </div>
                  </div>
                  <Zap size={40} className={generatedWorkout ? "text-[#E6FF2B]" : "text-[#F9F7F2]"} />
                </div>

                <div className="bg-white rounded-[2.5rem] p-5 sm:p-6 md:p-8 shadow-sm border border-gray-100 flex-1 flex flex-col justify-center relative group cursor-pointer hover:border-[#0B4550] transition-all" onClick={openWeightModal}>
                  <div className="flex justify-between items-end mb-4">
                    <div><h3 className="font-medium text-xl text-[#0B4550]">Weight Tracker</h3><p className="text-[#898A8D] font-medium text-xs uppercase tracking-widest">{weightProgress.toFixed(0)}% to Goal</p></div>
                    <div className="text-right">
                      <span className="font-medium text-3xl text-[#0B4550] block">{clientData.currentWeight} kg</span>
                      {clientData.startWeight > clientData.currentWeight && <span className="text-xs font-medium text-emerald-500">-{(clientData.startWeight - clientData.currentWeight).toFixed(1)} kg so far!</span>}
                    </div>
                  </div>
                  <div className="relative pt-2">
                    <div className="w-full h-3 bg-[#F9F7F2] rounded-full overflow-hidden"><div className="h-full bg-[#0B4550] transition-all duration-1000" style={{ width: `${weightProgress}%` }}></div></div>
                  </div>
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"><div className="bg-[#F9F7F2] p-2 rounded-xl text-[#0B4550]"><Plus size={18} /></div></div>
                </div>
              </div>

              <div className="md:col-span-12 lg:col-span-7 bg-[#0B4550] rounded-[2.5rem] p-5 sm:p-6 md:p-8 shadow-sm border border-[#0B4550] flex flex-col text-white relative overflow-hidden h-auto lg:h-[380px] min-h-[340px]">
                <div className="absolute -right-4 -bottom-4 opacity-10"><Calendar size={160} /></div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-center mb-6 shrink-0">
                    <div>
                      <h3 className="font-bold text-xs uppercase tracking-widest text-white/50 mb-0.5">My Schedule</h3>
                      <h2 className="text-2xl font-medium text-white">Booked Classes</h2>
                    </div>
                    <span className="bg-[#E6FF2B] text-[#0B4550] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                      {upcomingBookings.length} {upcomingBookings.length === 1 ? 'Class' : 'Classes'} Booked
                    </span>
                  </div>

                  {upcomingBookings.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-[#E6FF2B] mb-4">
                        <CalendarCheck size={28} />
                      </div>
                      <h4 className="font-medium text-base text-white mb-1">No Upcoming Bookings</h4>
                      <p className="text-white/60 text-xs max-w-xs leading-relaxed">
                        Use the Available Classes hub or click "Book Session" to secure your spot!
                      </p>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto pr-1 no-scrollbar space-y-3.5 pb-2">
                      {upcomingBookings.map(booking => (
                        <div
                          key={booking.id}
                          className="bg-white/10 border border-white/10 rounded-2xl p-4 flex justify-between items-center hover:bg-white/[0.15] transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#E6FF2B]/10 text-[#E6FF2B] flex items-center justify-center shrink-0">
                              <Dumbbell size={18} />
                            </div>
                            <div>
                              <h4 className="font-medium text-base text-white mb-0.5 leading-tight">{booking.title}</h4>
                              <p className="text-white/60 text-xs flex items-center gap-1.5">
                                <Clock size={12} /> {formatDbDate(booking.date)} at {booking.time}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to cancel your spot in ${booking.title}?`)) {
                                handleQuickCancel(booking);
                              }
                            }}
                            className="px-4 py-2 bg-transparent hover:bg-red-500/20 text-white/80 hover:text-red-300 border border-white/20 hover:border-red-500/30 rounded-full text-xs font-bold transition-all"
                          >
                            Cancel Class
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* MOBILE HOME VIEW */}
            <div className="md:hidden flex flex-col gap-4 flex-1 pb-4 animate-in fade-in duration-500">

              {/* Mobile Remaining Sessions */}
              <div className="bg-white border border-gray-100 rounded-[2rem] p-5 shadow-sm relative overflow-hidden flex flex-col">
                <div className="flex justify-between items-start z-10 mb-2">
                  <div>
                    <h3 className="font-bold text-[10px] text-[#898A8D] uppercase tracking-widest">Active Package</h3>
                    <h2 className="font-black text-2xl text-[#0B4550] tracking-tight">{clientData.packageName}</h2>
                  </div>
                  <button onClick={() => setIsTopUpOpen(true)} className="bg-[#0B4550] text-[#E6FF2B] px-4 py-2 rounded-xl font-black text-[10px] shadow-sm flex items-center gap-1.5 relative z-20 uppercase tracking-widest"><CreditCard size={14} /> Top Up</button>
                </div>

                <div className="flex-1 flex flex-col justify-end z-10 pt-4 w-full">
                  {clientData.unlimited ? (
                    <div className="space-y-4 w-full">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E6FF2B]/10 text-[#0B4550] border border-[#E6FF2B]/20 text-[10px] font-black uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0B4550] animate-pulse"></span>
                        Unlimited Access Plan
                      </span>
                      <div className="grid grid-cols-2 gap-4 bg-[#F9F7F2] rounded-2xl p-4 border border-gray-100">
                        <div>
                          <p className="text-[9px] font-bold text-[#898A8D] uppercase tracking-widest mb-1">Expiration Date</p>
                          <p className="text-sm font-black text-[#0B4550]">{clientData.expiry ? formatDbDate(clientData.expiry) : 'No Expiration'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-bold text-[#898A8D] uppercase tracking-widest mb-1">Time Remaining</p>
                          <p className="text-sm font-black text-[#0B4550]">
                            {(() => {
                              const days = calculateRemainingDays(clientData.expiry);
                              if (days === null) return 'Unlimited Days';
                              if (days < 0) return 'Expired';
                              if (days === 0) return 'Expires Today';
                              return `${days} Days Left`;
                            })()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 w-full">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] font-bold text-[#898A8D] uppercase tracking-widest mb-1">Remaining Sessions</p>
                          <p className="text-3xl font-black text-[#0B4550]">{clientData.remaining_package !== undefined ? clientData.remaining_package : clientData.remainingSessions}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-[#898A8D] uppercase tracking-widest mb-1">Completed</p>
                          <p className="text-xl font-black text-[#0B4550]">{clientData.usedSessions || 0}</p>
                        </div>
                      </div>

                      <div className="w-full h-2 bg-[#F9F7F2] rounded-full overflow-hidden relative">
                        <div
                          className={`h-full transition-all duration-700 ${(clientData.remaining_package || clientData.remainingSessions || 0) <= 0 ? 'bg-red-500' : 'bg-[#0B4550]'}`}
                          style={{ width: `${((clientData.usedSessions || 0) / ((clientData.usedSessions || 0) + (clientData.remaining_package !== undefined ? clientData.remaining_package : clientData.remainingSessions || 1))) * 100}%` }}
                        ></div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 bg-[#F9F7F2] rounded-2xl p-4 border border-gray-100">
                        <div>
                          <p className="text-[9px] font-bold text-[#898A8D] uppercase tracking-widest mb-1">Package Expiration</p>
                          <p className="text-xs font-black text-[#0B4550]">{clientData.expiry ? formatDbDate(clientData.expiry) : 'No Expiration'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-bold text-[#898A8D] uppercase tracking-widest mb-1">Time Remaining</p>
                          <p className="text-xs font-black text-[#0B4550]">
                            {(() => {
                              const days = calculateRemainingDays(clientData.expiry);
                              if (days === null) return 'No Time Limit';
                              if (days < 0) return 'Expired';
                              if (days === 0) return 'Expires Today';
                              return `${days} Days Left`;
                            })()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Weight Tracker */}
              <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 flex flex-col relative" onClick={openWeightModal}>
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h3 className="font-black text-lg text-[#0B4550]">Weight Tracker</h3>
                    <p className="text-[#898A8D] font-bold text-[10px] uppercase tracking-widest">{weightProgress.toFixed(0)}% to Goal</p>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-2xl text-[#0B4550] block">{clientData.currentWeight} kg</span>
                    {clientData.startWeight > clientData.currentWeight && <span className="text-[10px] font-black text-emerald-500">-{(clientData.startWeight - clientData.currentWeight).toFixed(1)} kg so far!</span>}
                  </div>
                </div>
                <div className="relative pt-2">
                  <div className="w-full h-2 bg-[#F9F7F2] rounded-full overflow-hidden"><div className="h-full bg-[#0B4550] transition-all duration-1000" style={{ width: `${weightProgress}%` }}></div></div>
                </div>
              </div>

              {/* Mobile Workout Builder */}
              <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 flex justify-between items-center relative">
                <div>
                  <h3 className="font-black text-lg text-[#0B4550] mb-1">{generatedWorkout ? "Today's Plan" : "Workout Builder"}</h3>
                  <p className="text-[#898A8D] font-bold text-xs mb-3">{generatedWorkout ? "Ready to crush it?" : "Generate your session"}</p>
                  <div className="flex gap-2">
                    <button onClick={() => { if (generatedWorkout) setIsTrackerOpen(true); else { setStep(1); setIsBuilderOpen(true); } }} className="flex items-center gap-2 text-[#E6FF2B] font-black bg-[#0B4550] px-4 py-2.5 rounded-full text-xs shadow-sm z-20 relative">
                      {generatedWorkout ? "Start Workout" : "Start Building"} <Plus size={14} />
                    </button>
                    {generatedWorkout && (
                      <button onClick={() => { setGeneratedWorkout(null); setStep(1); setIsBuilderOpen(true); }} className="w-9 h-9 rounded-xl bg-[#F9F7F2] flex items-center justify-center text-[#0B4550] hover:bg-gray-100 transition-all z-20 relative">
                        <RefreshCw size={14} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#F9F7F2] flex items-center justify-center shrink-0">
                  <Zap size={24} className={generatedWorkout ? "text-[#0B4550]" : "text-[#898A8D]"} />
                </div>
              </div>

              {/* Mobile Available Classes */}
              <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 flex flex-col h-[320px]">
                <div className="flex justify-between items-center mb-4 shrink-0">
                  <div>
                    <h3 className="font-black text-lg text-[#0B4550]">Available Classes</h3>
                    <p className="text-[#898A8D] text-[10px] font-bold uppercase tracking-widest mt-0.5">Quick 1-Click Booking</p>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto pr-1 space-y-3 no-scrollbar">
                  {(() => {
                    const todayStr = new Date().toISOString().split('T')[0];
                    const futureSessions = liveSessions.filter(s => s.date >= todayStr && s.type !== '1-on-1' && s.type !== 'Blocked');

                    if (futureSessions.length === 0) {
                      return (
                        <div className="flex flex-col items-center justify-center py-8 text-center text-[#898A8D]">
                          <Calendar size={24} className="mb-2 opacity-50" />
                          <p className="text-xs font-bold">No classes scheduled yet.</p>
                        </div>
                      );
                    }

                    return futureSessions.map(session => {
                      const isFull = session.attendees?.length >= session.capacity;
                      return (
                        <div key={session.id} className="bg-[#F9F7F2] border border-gray-100 rounded-2xl p-4 flex flex-col gap-3 relative">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="inline-block px-2 py-0.5 rounded text-[#0B4550] bg-[#E6FF2B] text-[9px] font-black uppercase tracking-wider">
                                  {formatDbDate(session.date)}
                                </span>
                                <span className="text-[10px] font-bold text-[#898A8D]">
                                  {session.time}
                                </span>
                              </div>
                              <h4 className="text-sm font-black text-[#0B4550] leading-tight">{session.title}</h4>
                              <p className="text-[10px] text-[#898A8D] flex items-center gap-1 font-bold mt-1">
                                <User size={10} className="text-[#0B4550]" /> {session.coach || session.trainer || 'Coach'}
                              </p>
                            </div>
                            <p className="text-[9px] font-black text-[#898A8D] uppercase tracking-widest">
                              {session.attendees?.length || 0} / {session.capacity} Slots
                            </p>
                          </div>

                          <div className="flex justify-end pt-2 border-t border-gray-100">
                            {session.isBookedByMe ? (
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-[#0B4550] bg-[#E6FF2B] py-1.5 px-3 rounded-lg flex items-center gap-1 uppercase tracking-wider">
                                  Booked ✓
                                </span>
                                <button onClick={() => handleQuickCancel(session)} className="text-[10px] font-black text-red-500 px-2 py-1.5">
                                  Cancel
                                </button>
                              </div>
                            ) : isFull ? (
                              <span className="text-[10px] font-black text-[#898A8D] bg-gray-150 py-1.5 px-3 rounded-lg uppercase tracking-wider">
                                Full
                              </span>
                            ) : (
                              <button
                                onClick={() => handleQuickBook(session)}
                                className="bg-[#0B4550] text-[#E6FF2B] py-2 px-4 rounded-xl text-[10px] font-black w-full"
                              >
                                Book Spot
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Mobile Booked Classes */}
              <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 flex flex-col h-[300px]">
                <div className="flex justify-between items-center mb-4 shrink-0">
                  <div>
                    <h3 className="font-black text-lg text-[#0B4550]">Booked Classes</h3>
                    <p className="text-[#898A8D] text-[10px] font-bold uppercase tracking-widest mt-0.5">My Schedule</p>
                  </div>
                  <span className="bg-[#E6FF2B] text-[#0B4550] text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full">
                    {upcomingBookings.length}
                  </span>
                </div>

                {upcomingBookings.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-[#F9F7F2] flex items-center justify-center text-[#898A8D] mb-3">
                      <CalendarCheck size={20} />
                    </div>
                    <h4 className="font-black text-sm text-[#0B4550] mb-1">No Bookings</h4>
                    <p className="text-[#898A8D] text-[10px] font-bold">Use "Available Classes" to book.</p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto pr-1 no-scrollbar space-y-3">
                    {upcomingBookings.map(booking => (
                      <div key={booking.id} className="bg-[#F9F7F2] border border-gray-100 rounded-2xl p-3.5 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white text-[#0B4550] flex items-center justify-center border border-gray-150">
                            <Calendar size={16} />
                          </div>
                          <div>
                            <h4 className="font-black text-sm text-[#0B4550] mb-0.5 leading-tight">{booking.title}</h4>
                            <p className="text-[#898A8D] text-[10px] font-bold flex items-center gap-1.5">
                              <Clock size={10} /> {formatDbDate(booking.date)} at {booking.time}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to cancel your spot in ${booking.title}?`)) {
                              handleQuickCancel(booking);
                            }
                          }}
                          className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </>
        )}

        {/* --- ACTIVITY LEDGER VIEW --- */}
        {activeNav === 'History' && (
          <>
            {/* DESKTOP HISTORY VIEW */}
            <div className="hidden md:flex flex-1 pb-4 animate-in fade-in duration-500 max-w-4xl mx-auto w-full">
              <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 h-full flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-medium text-[#0B4550]">History & Invoices</h3>
                    <p className="text-[#898A8D] font-medium">All your sessions and purchases in one place.</p>
                  </div>
                  <div className="bg-[#F9F7F2] px-5 py-2 rounded-2xl border border-gray-100 flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                      <span className="text-xs font-bold text-[#0B4550] uppercase">Credit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                      <span className="text-xs font-bold text-[#0B4550] uppercase">Debit</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 no-scrollbar space-y-4">
                  {activityHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4"><Activity size={40} /></div>
                      <p className="text-[#898A8D] font-medium">No activity recorded yet.</p>
                    </div>
                  ) : (
                    activityHistory.map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 md:p-6 bg-[#F9F7F2] rounded-3xl border border-transparent hover:border-[#E6FF2B] transition-all group gap-4 sm:gap-2">
                        <div className="flex items-center gap-4 md:gap-5">
                          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-xl md:text-2xl shadow-sm transition-transform group-hover:scale-110 shrink-0 ${item.type === 'purchase' ? 'bg-emerald-50 text-emerald-500' :
                            item.type === 'usage' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'
                            }`}>
                            {item.type === 'purchase' ? <CreditCard size={20} /> :
                              item.type === 'usage' ? <Zap size={20} /> : <FileText size={20} />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-base md:text-lg font-bold text-[#0B4550] truncate">{item.title}</p>
                            <p className="text-xs md:text-sm font-medium text-[#898A8D] mt-0.5">
                              {item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              {item.method && ` • ${item.method}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-4 text-right w-full sm:w-auto border-t sm:border-t-0 border-gray-100 pt-3.5 sm:pt-0">
                          {item.type === 'purchase' && item.invoiceNumber && (
                            <button
                              onClick={() => {
                                setSelectedInvoice(item);
                                setIsInvoiceOpen(true);
                              }}
                              className="bg-[#0B4550]/10 hover:bg-[#0B4550] text-[#0B4550] hover:text-[#E6FF2B] px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
                            >
                              <FileText size={13} /> PDF Invoice
                            </button>
                          )}
                          <div className="text-right ml-auto">
                            <p className={`text-xl md:text-2xl font-black ${item.type === 'purchase' ? 'text-emerald-500' :
                              item.type === 'usage' ? 'text-rose-500' : 'text-[#0B4550]'
                              }`}>
                              {item.type === 'purchase' ? `RM ${Math.abs(item.amount)}` : `-${Math.abs(item.amount)}`}
                            </p>
                            <p className="text-[10px] font-bold text-[#898A8D] uppercase tracking-widest mt-0.5">
                              {item.type === 'purchase' ? 'Paid' : 'Session'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* MOBILE HISTORY VIEW */}
            <div className="md:hidden flex flex-col gap-4 flex-1 pb-4 animate-in fade-in duration-500 w-full">
              <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 h-full flex flex-col">
                <div className="flex flex-col gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-[#0B4550]">History & Invoices</h3>
                    <p className="text-[#898A8D] font-bold text-xs mt-1">All your sessions and purchases.</p>
                  </div>
                  <div className="bg-[#F9F7F2] px-4 py-3 rounded-xl border border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                      <span className="text-[10px] font-black text-[#898A8D] uppercase tracking-widest">Credit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                      <span className="text-[10px] font-black text-[#898A8D] uppercase tracking-widest">Debit</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
                  {activityHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 bg-[#F9F7F2] rounded-full flex items-center justify-center text-[#898A8D] mb-4"><Activity size={32} /></div>
                      <p className="text-[#898A8D] font-bold text-sm">No activity recorded yet.</p>
                    </div>
                  ) : (
                    activityHistory.map((item) => (
                      <div key={item.id} className="flex flex-col p-4 bg-white rounded-2xl border border-gray-100 gap-3 relative">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${item.type === 'purchase' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                              item.type === 'usage' ? 'bg-red-50 text-red-600 border border-red-100' :
                                'bg-blue-50 text-blue-600 border border-blue-100'
                            }`}>
                            {item.type === 'purchase' ? <CreditCard size={20} /> :
                              item.type === 'usage' ? <Zap size={20} /> : <FileText size={20} />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-black text-[#0B4550] truncate leading-tight mb-0.5">{item.title}</p>
                            <p className="text-[10px] font-bold text-[#898A8D]">
                              {item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              {item.method && ` • ${item.method}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-1">
                          {item.type === 'purchase' && item.invoiceNumber ? (
                            <button
                              onClick={() => {
                                setSelectedInvoice(item);
                                setIsInvoiceOpen(true);
                              }}
                              className="bg-[#F9F7F2] hover:bg-gray-200 text-[#0B4550] border border-gray-150 px-3 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-1.5 uppercase tracking-wider"
                            >
                              <FileText size={12} /> Invoice
                            </button>
                          ) : <div></div>}
                          <div className="text-right">
                            <p className={`text-base font-black ${item.type === 'purchase' ? 'text-emerald-600' :
                                item.type === 'usage' ? 'text-red-500' : 'text-[#0B4550]'
                              }`}>
                              {item.type === 'purchase' ? `RM ${Math.abs(item.amount)}` : `-${Math.abs(item.amount)}`}
                            </p>
                            <p className="text-[9px] font-black text-[#898A8D] uppercase tracking-widest mt-0.5">
                              {item.type === 'purchase' ? 'Paid' : 'Session'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* --- PROGRESS & ANALYTICS VIEW --- */}
        {activeNav === 'Progress' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 flex-1 pb-4 animate-in fade-in duration-500">
            <div className="col-span-12 lg:col-span-8 flex flex-col h-[280px] sm:h-[350px] md:h-[400px] lg:h-full lg:min-h-[400px] bg-white rounded-[2.5rem] p-4 sm:p-6 border border-gray-100 shadow-sm relative overflow-hidden"><WeightLineChart data={clientData.weightHistory} startWeight={clientData.startWeight} /></div>
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                <div className="bg-[#0B4550] rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-6 md:p-8 shadow-sm flex flex-col justify-center items-center text-center relative overflow-hidden group min-h-[120px] sm:min-h-[140px] lg:min-h-0">
                  <div className="absolute -right-8 -top-8 opacity-10 group-hover:scale-110 transition-transform duration-500"><Dumbbell size={120} className="text-white" /></div>
                  <h3 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#E6FF2B] mb-1 relative z-10">12.4<span className="text-xl sm:text-2xl">k</span></h3>
                  <p className="text-white/70 font-semibold text-[9px] sm:text-xs uppercase tracking-widest relative z-10 leading-snug">Total Vol. (kg)</p>
                </div>
                <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center min-h-[120px] sm:min-h-[140px] lg:min-h-0">
                  <h3 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#0B4550] mb-1">42</h3>
                  <p className="text-[#898A8D] font-semibold text-[9px] sm:text-xs uppercase tracking-widest leading-snug">Workouts Done</p>
                </div>
              </div>
              <button onClick={openWeightModal} className="bg-[#E6FF2B] text-[#0B4550] py-4 sm:py-5 rounded-[2rem] sm:rounded-[2.5rem] font-bold text-base sm:text-lg shadow-sm hover:scale-[1.02] transition-all flex items-center justify-center gap-2 border border-yellow-300 active:scale-95"><Plus size={20} /> Log New Weight</button>
            </div>
            <div className="col-span-12 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 mt-2">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3"><div className="w-12 h-12 bg-[#F9F7F2] rounded-2xl flex items-center justify-center text-[#0B4550]"><Award size={24} /></div><h3 className="font-medium text-2xl text-[#0B4550]">Personal Records</h3></div>
                <button className="text-[#898A8D] font-medium hover:text-[#0B4550] text-sm">View All History</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {!clientData.prs || clientData.prs.length === 0 ? (
                  <div className="col-span-1 md:col-span-3 py-12 text-center bg-[#F9F7F2] rounded-[2rem] border border-gray-100 flex flex-col items-center justify-center">
                    <Award size={40} className="text-[#898A8D] mb-3 opacity-60" />
                    <p className="text-[#898A8D] font-medium text-sm">No personal records logged yet.</p>
                    <p className="text-[#898A8D]/70 font-semibold text-[11px] mt-1 max-w-sm">Complete physical training sessions and track completed sets using the active workout tool to establish your records!</p>
                  </div>
                ) : (
                  clientData.prs.map((pr, i) => (
                    <div key={i} className="bg-[#F9F7F2] p-6 rounded-[2rem] border border-gray-100 flex flex-col justify-between hover:border-[#E6FF2B] transition-all cursor-pointer">
                      <div className="mb-6"><p className="text-xs font-medium text-[#898A8D] uppercase tracking-widest mb-1">{pr.date}</p><h4 className="text-xl font-medium text-[#0B4550] leading-tight">{pr.exercise}</h4></div>
                      <div className="flex justify-between items-end"><span className="font-medium text-4xl text-[#0B4550]">{pr.weight}</span><span className="font-medium text-[#0B4550] bg-white px-3 py-1.5 rounded-xl text-xs uppercase tracking-widest shadow-sm border border-gray-100">{pr.reps} Rep Max</span></div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS MODAL */}
        {isSettingsOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[115] transition-opacity" onClick={() => setIsSettingsOpen(false)} />}
        <div className={`fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white z-[120] shadow-2xl transition-transform duration-500 ease-out p-6 sm:p-10 flex flex-col ${isSettingsOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center mb-6 sm:mb-8"><h2 className="text-3xl font-medium text-[#0B4550]">Settings</h2><button onClick={() => setIsSettingsOpen(false)} className="w-10 h-10 rounded-full bg-[#F9F7F2] flex items-center justify-center text-[#0B4550] hover:bg-gray-200 transition-colors"><X size={20} /></button></div>
          <div className="flex gap-2 bg-[#F9F7F2] p-2 rounded-2xl mb-8">
            <button onClick={() => setSettingsTab('profile')} className={`flex-1 py-3 font-medium text-sm rounded-xl transition-all ${settingsTab === 'profile' ? 'bg-white shadow-sm text-[#0B4550]' : 'text-[#898A8D]'}`}>Profile</button>
            <button onClick={() => setSettingsTab('alerts')} className={`flex-1 py-3 font-medium text-sm rounded-xl transition-all ${settingsTab === 'alerts' ? 'bg-white shadow-sm text-[#0B4550]' : 'text-[#898A8D]'}`}>Alerts</button>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
            {settingsTab === 'profile' && (
              <div className="animate-in fade-in">
                <div className="flex flex-col items-center mb-10">
                  <div className="w-28 h-28 bg-[#0B4550] rounded-full flex items-center justify-center text-white text-3xl font-medium mb-4 relative group cursor-pointer shadow-lg">{clientData.name.charAt(0).toUpperCase()}<div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera size={28} className="text-white" /></div></div>
                  <button className="text-sm font-medium text-blue-500 hover:underline">Change Picture</button>
                </div>
                <div className="space-y-5">
                  <div><label className="text-[#898A8D] font-medium text-xs uppercase tracking-widest mb-2 block">Full Name</label><input type="text" value={tempProfileName} onChange={(e) => setTempProfileName(e.target.value)} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-xl p-4 font-medium text-[#0B4550] outline-none focus:border-[#0B4550] transition-colors" /></div>
                  <div><label className="text-[#898A8D] font-medium text-xs uppercase tracking-widest mb-2 block">Email Address</label><input type="email" value={tempProfileEmail} onChange={(e) => setTempProfileEmail(e.target.value)} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-xl p-4 font-medium text-[#0B4550] outline-none focus:border-[#0B4550] transition-colors" /></div>
                  <div><label className="text-[#898A8D] font-medium text-xs uppercase tracking-widest mb-2 block">Phone Number</label><input type="tel" value={tempProfilePhone} onChange={(e) => setTempProfilePhone(e.target.value)} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-xl p-4 font-medium text-[#0B4550] outline-none focus:border-[#0B4550] transition-colors" /></div>
                </div>
              </div>
            )}
            {settingsTab === 'alerts' && (
              <div className="animate-in fade-in space-y-6">
                <div className="flex justify-between items-center p-5 bg-[#F9F7F2] rounded-2xl border border-gray-100"><div><p className="font-medium text-[#0B4550]">Workout Reminders</p><p className="text-xs font-medium text-[#898A8D]">Push notifications 1 hour before session.</p></div><Toggle active={alerts.workouts} onClick={() => setAlerts(prev => ({ ...prev, workouts: !prev.workouts }))} /></div>
                <div className="flex justify-between items-center p-5 bg-[#F9F7F2] rounded-2xl border border-gray-100"><div><p className="font-medium text-[#0B4550]">Trainer Messages</p><p className="text-xs font-medium text-[#898A8D]">Emails and push alerts from Emmanuel.</p></div><Toggle active={alerts.messages} onClick={() => setAlerts(prev => ({ ...prev, messages: !prev.messages }))} /></div>
                <div className="flex justify-between items-center p-5 bg-[#F9F7F2] rounded-2xl border border-gray-100"><div><p className="font-medium text-[#0B4550]">Billing Alerts</p><p className="text-xs font-medium text-[#898A8D]">Notify me when sessions are low.</p></div><Toggle active={alerts.billing} onClick={() => setAlerts(prev => ({ ...prev, billing: !prev.billing }))} /></div>
              </div>
            )}
          </div>
          <button onClick={() => settingsTab === 'profile' ? saveSettings() : setIsSettingsOpen(false)} className="mt-auto w-full py-5 rounded-[2rem] font-medium text-xl bg-[#E6FF2B] text-[#0B4550] shadow-lg transition-all hover:scale-[1.02] shrink-0">{settingsTab === 'profile' ? 'Save Changes' : 'Done'}</button>
        </div>

        {/* WEIGHT MODAL */}
        {isWeightModalOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[115] transition-opacity" onClick={() => setIsWeightModalOpen(false)} />}
        <div className={`fixed top-0 right-0 h-full w-[400px] bg-white z-[120] shadow-2xl transition-transform duration-500 ease-out p-10 flex flex-col ${isWeightModalOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center mb-6"><h2 className="text-3xl font-medium text-[#0B4550]">Log Weight</h2><button onClick={() => setIsWeightModalOpen(false)} className="w-10 h-10 rounded-full bg-[#F9F7F2] flex items-center justify-center text-[#0B4550] hover:bg-gray-200 transition-colors"><X size={20} /></button></div>
          <div className="bg-blue-50 text-blue-600 px-4 py-3 rounded-xl flex items-center justify-center gap-2 font-medium text-sm mb-8 border border-blue-100"><Clock size={16} /> History remains strictly private.</div>
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 pb-10">
            <div><label className="text-[#898A8D] font-medium text-xs uppercase tracking-widest mb-3 block">Date & Time</label><input type="datetime-local" value={tempDate} onChange={(e) => setTempDate(e.target.value)} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl p-4 font-medium text-[#0B4550] outline-none focus:border-[#0B4550] transition-colors" /></div>
            <div className="bg-[#0B4550] p-8 rounded-[2rem] text-center relative overflow-hidden shadow-lg"><Scale size={64} className="mx-auto mb-2 text-white/10 absolute -right-4 -bottom-4 w-40 h-40 pointer-events-none" /><div className="relative z-10"><p className="text-white/60 font-medium text-xs uppercase tracking-widest mb-4">Current Entry</p><div className="flex items-center justify-center gap-4"><button onClick={() => setTempWeight(w => +(w - 0.5).toFixed(1))} className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center font-medium text-3xl text-white hover:bg-white/20 transition-colors">-</button><div className="flex items-baseline gap-1"><input type="number" value={tempWeight} onChange={(e) => setTempWeight(Number(e.target.value))} className="w-24 text-center font-medium text-5xl bg-transparent outline-none text-white p-0" step="0.1" /><span className="text-white/60 font-medium text-xl">kg</span></div><button onClick={() => setTempWeight(w => +(w + 0.5).toFixed(1))} className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center font-medium text-3xl text-white hover:bg-white/20 transition-colors">+</button></div></div></div>
            <div><label className="text-[#898A8D] font-medium text-xs uppercase tracking-widest mb-3 block">How are you feeling?</label><div className="flex justify-between items-center bg-[#F9F7F2] p-2 rounded-2xl border border-gray-100">{['😫', '🥱', '🙂', '💪', '🔥'].map(emoji => (<button key={emoji} onClick={() => setTempFeeling(emoji)} className={`w-14 h-14 rounded-xl text-3xl flex items-center justify-center transition-all ${tempFeeling === emoji ? 'bg-white shadow-sm scale-110' : 'hover:bg-white/50 grayscale opacity-50'}`}>{emoji}</button>))}</div></div>
            <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl"><label className="text-[#898A8D] font-medium text-xs uppercase tracking-widest mb-3 block flex items-center gap-2"><Settings size={14} /> Settings</label><div className="flex justify-between items-center"><span className="text-sm font-medium text-[#0B4550]">Update Goal Weight:</span><div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 w-32"><button onClick={() => setTempGoal(g => +(g - 0.5).toFixed(1))} className="w-8 h-8 flex items-center justify-center text-[#898A8D] hover:bg-gray-100 rounded-md font-medium">-</button><input type="number" value={tempGoal} onChange={(e) => setTempGoal(Number(e.target.value))} className="flex-1 text-center font-medium text-sm outline-none text-[#0B4550]" step="0.1" /><button onClick={() => setTempGoal(g => +(g + 0.5).toFixed(1))} className="w-8 h-8 flex items-center justify-center text-[#898A8D] hover:bg-gray-100 rounded-md font-medium">+</button></div></div></div>
          </div>
          <button onClick={saveWeightProgress} className="mt-auto w-full py-5 rounded-[2rem] font-medium text-xl bg-[#E6FF2B] text-[#0B4550] shadow-lg transition-all hover:scale-[1.02] shrink-0">Log Entry</button>
        </div>

        {/* BOOKING MODAL (NOW LIVE!) */}
        {isBookingOpen && <div className="fixed inset-0 bg-black/40 md:bg-black/20 backdrop-blur-sm z-[115] transition-opacity" onClick={closeBookingDrawer} />}

        {/* DESKTOP BOOKING DRAWER */}
        <div className={`hidden md:flex fixed top-0 right-0 h-full w-[450px] bg-white z-[120] shadow-2xl transition-transform duration-500 ease-out p-10 flex-col ${isBookingOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center mb-10"><h2 className="text-3xl font-medium text-[#0B4550]">Book Session</h2><button onClick={closeBookingDrawer} className="w-10 h-10 rounded-full bg-[#F9F7F2] flex items-center justify-center text-[#0B4550] hover:bg-gray-200 transition-colors"><X size={20} /></button></div>

          {bookingStep === 'select' ? (
            <>
              <div className="bg-[#F9F7F2] p-6 rounded-[2rem] mb-8 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <button onClick={() => setCurrentMonth(prev => Math.max(0, prev - 1))} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#0B4550] shadow-sm hover:scale-105"><ChevronLeft size={16} /></button>
                  <h3 className="font-medium text-[#0B4550] text-xl">{MONTHS[currentMonth]} 2026</h3>
                  <button onClick={() => setCurrentMonth(prev => Math.min(11, prev + 1))} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#0B4550] shadow-sm hover:scale-105"><ChevronRight size={16} /></button>
                </div>
                <div className="grid grid-cols-7 text-center text-[#898A8D] font-medium text-[10px] uppercase tracking-widest mb-3"><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div><div>S</div></div>
                <div className="grid grid-cols-7 gap-y-2 text-center">
                  {[...Array(getFirstDayOffset(currentMonth))].map((_, idx) => (
                    <div key={`offset-${idx}`} className="w-10 h-10" />
                  ))}
                  {[...Array(getDaysInMonth(currentMonth))].map((_, i) => {
                    const d = i + 1;
                    return (
                      <div key={d} onClick={() => { setSelectedDate(d); setSelectedLiveSession(null); }} className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center cursor-pointer font-medium text-sm transition-all ${selectedDate === d ? 'bg-[#0B4550] text-[#E6FF2B] shadow-md scale-110' : 'text-[#0B4550] hover:bg-gray-200'}`}>
                        {d}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="mb-10 flex-1 overflow-y-auto pr-2 no-scrollbar">
                <p className="text-[#898A8D] font-medium text-xs uppercase tracking-widest mb-4">Available Classes on {MONTHS[currentMonth]} {selectedDate}</p>

                {filteredSessionsForDate.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[#898A8D] font-medium">No sessions scheduled.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 text-[#0B4550]">
                    {filteredSessionsForDate.map(s => (
                      <div
                        key={s.id}
                        onClick={() => setSelectedLiveSession(s)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedLiveSession?.id === s.id ? 'bg-[#0B4550] text-white border-[#0B4550] shadow-md' : 'bg-white border-gray-100 hover:border-[#0B4550]'}`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className={`font-medium text-lg leading-tight mb-1 ${selectedLiveSession?.id === s.id ? 'text-white' : 'text-[#0B4550]'}`}>{s.title}</h4>
                            <p className={`text-xs font-medium ${selectedLiveSession?.id === s.id ? 'text-[#E6FF2B]' : 'text-[#898A8D]'}`}>{s.time} • {s.duration}</p>
                          </div>
                          <div className={`text-right ${selectedLiveSession?.id === s.id ? 'text-white/70' : 'text-[#898A8D]'}`}>
                            <p className="text-[10px] font-medium uppercase tracking-widest mb-1">{s.type}</p>
                            <span className={`text-xs font-medium px-2 py-1 rounded-md ${s.attendees?.length >= s.capacity ? 'bg-red-100 text-red-600' : (selectedLiveSession?.id === s.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-[#0B4550]')}`}>
                              {s.attendees?.length || 0} / {s.capacity}
                            </span>
                          </div>
                        </div>

                        {/* ALWAYS SHOW WHO IS ATTENDING */}
                        <div className="pt-3 border-t border-gray-200/20 mt-2">
                          <p className={`text-[10px] font-medium uppercase tracking-widest mb-2 ${selectedLiveSession?.id === s.id ? 'text-[#E6FF2B]' : 'text-[#898A8D]'}`}>Joining Today:</p>
                          <div className="flex flex-wrap gap-2">
                            {s.attendees && s.attendees.length > 0 ? s.attendees.map((a, i) => (
                              <span key={i} className={`text-xs font-medium px-2 py-1 rounded-md ${selectedLiveSession?.id === s.id ? 'bg-white/10 text-white' : 'bg-[#F9F7F2] text-[#0B4550]'}`}>• {a.name.split(' ')[0]}</span>
                            )) : (
                              <span className={`text-xs font-medium ${selectedLiveSession?.id === s.id ? 'text-white/50' : 'text-[#898A8D]'}`}>Be the first to join!</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-auto bg-[#F9F7F2] p-5 rounded-2xl mb-4 flex justify-between items-center border border-gray-100 shrink-0">
                <span className="font-medium text-[#0B4550] text-sm">Package Deduction</span>
                <span className="font-medium text-red-500">{clientData?.unlimited ? '0 (Unlimited)' : '-1 Session'}</span>
              </div>
              <button
                disabled={!selectedLiveSession || selectedLiveSession.isBookedByMe || selectedLiveSession.attendees?.length >= selectedLiveSession.capacity}
                onClick={handleConfirmBooking}
                className="w-full py-5 rounded-[2rem] font-medium text-xl bg-[#E6FF2B] text-[#0B4550] shadow-lg disabled:opacity-50 transition-all hover:scale-[1.02] shrink-0"
              >
                {selectedLiveSession?.isBookedByMe ? 'Already Booked' : selectedLiveSession?.attendees?.length >= selectedLiveSession?.capacity ? 'Class Full' : 'Confirm Booking'}
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 animate-in zoom-in duration-500 text-center">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-sm"><CalendarCheck size={48} /></div>
              <h2 className="text-3xl font-medium text-[#0B4550] mb-2">Session Confirmed!</h2>
              <p className="text-[#898A8D] font-medium mb-8">Your trainer has been notified.</p>

              <div className="bg-[#F9F7F2] w-full p-6 rounded-3xl border border-gray-100 mb-8">
                <p className="text-xs font-medium text-[#898A8D] uppercase tracking-widest mb-1">Date & Time</p>
                <h3 className="text-xl font-medium text-[#0B4550]">{MONTHS[currentMonth]} {selectedDate}, 2026</h3>
                <h3 className="text-xl font-medium text-[#0B4550]">{selectedLiveSession?.time}</h3>
              </div>

              <button onClick={() => downloadICS(selectedDate, currentMonth, selectedLiveSession?.time)} className="w-full bg-[#0B4550] text-[#E6FF2B] py-5 rounded-[2rem] font-medium text-xl shadow-lg flex items-center justify-center gap-3 hover:scale-105 transition-all mb-4">
                <CalendarPlus size={24} /> Add to Calendar
              </button>
              <button onClick={closeBookingDrawer} className="font-medium text-[#898A8D] hover:text-[#0B4550] transition-colors">Close</button>
            </div>
          )}
        </div>

        {/* MOBILE BOOKING DRAWER */}
        <div className={`md:hidden fixed bottom-0 left-0 right-0 z-[120] bg-white border-t border-gray-150 rounded-t-[2.5rem] p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] transition-transform duration-500 ease-out flex flex-col pb-[calc(1.5rem+env(safe-area-inset-bottom))] ${isBookingOpen ? 'translate-y-0' : 'translate-y-full'}`} style={{ maxHeight: '90vh' }}>
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 shrink-0"></div>
          <div className="flex justify-between items-center mb-6 shrink-0">
            <h2 className="text-2xl font-black text-[#0B4550]">Book Session</h2>
            <button onClick={closeBookingDrawer} className="w-8 h-8 rounded-full bg-[#F9F7F2] flex items-center justify-center text-[#898A8D] hover:text-[#0B4550] transition-colors"><X size={16} /></button>
          </div>

          {bookingStep === 'select' ? (
            <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col min-h-0">
              <div className="bg-[#F9F7F2] p-5 rounded-[2rem] border border-gray-100 mb-6 shrink-0">
                <div className="flex justify-between items-center mb-4">
                  <button onClick={() => setCurrentMonth(prev => Math.max(0, prev - 1))} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#0B4550] shadow-sm border border-gray-100"><ChevronLeft size={16} /></button>
                  <h3 className="font-black text-[#0B4550] text-lg">{MONTHS[currentMonth]} 2026</h3>
                  <button onClick={() => setCurrentMonth(prev => Math.min(11, prev + 1))} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#0B4550] shadow-sm border border-gray-100"><ChevronRight size={16} /></button>
                </div>
                <div className="grid grid-cols-7 text-center text-[#898A8D] font-bold text-[10px] uppercase tracking-widest mb-2"><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div><div>S</div></div>
                <div className="grid grid-cols-7 gap-y-2 text-center">
                  {[...Array(getFirstDayOffset(currentMonth))].map((_, idx) => (
                    <div key={`offset-${idx}`} className="w-10 h-10 mx-auto" />
                  ))}
                  {[...Array(getDaysInMonth(currentMonth))].map((_, i) => {
                    const d = i + 1;
                    return (
                      <div key={d} onClick={() => { setSelectedDate(d); setSelectedLiveSession(null); }} className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center cursor-pointer font-black text-xs transition-all ${selectedDate === d ? 'bg-[#0B4550] text-[#E6FF2B] shadow-md scale-110' : 'text-[#0B4550] hover:bg-gray-150'}`}>
                        {d}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 no-scrollbar shrink-0 min-h-[200px]">
                <p className="text-[#898A8D] font-bold text-[10px] uppercase tracking-widest mb-3">Available Classes on {MONTHS[currentMonth]} {selectedDate}</p>

                {filteredSessionsForDate.length === 0 ? (
                  <div className="text-center py-8 bg-[#F9F7F2] rounded-2xl border border-gray-100">
                    <p className="text-[#898A8D] font-bold text-xs">No sessions scheduled.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {filteredSessionsForDate.map(s => (
                      <div
                        key={s.id}
                        onClick={() => setSelectedLiveSession(s)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${selectedLiveSession?.id === s.id ? 'bg-[#F9F7F2] border-[#0B4550]' : 'bg-white border-gray-150'}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className={`font-black text-sm leading-tight mb-1 text-[#0B4550]`}>{s.title}</h4>
                            <p className={`text-[10px] font-bold ${selectedLiveSession?.id === s.id ? 'text-[#0B4550]' : 'text-[#898A8D]'}`}>{s.time} • {s.duration}</p>
                          </div>
                          <div className={`text-right text-[#898A8D]`}>
                            <p className="text-[9px] font-black uppercase tracking-widest mb-1">{s.type}</p>
                            <span className={`text-[10px] font-black px-2 py-1 rounded-md ${s.attendees?.length >= s.capacity ? 'bg-red-50 text-red-500' : (selectedLiveSession?.id === s.id ? 'bg-[#0B4550] text-[#E6FF2B]' : 'bg-[#F9F7F2] text-[#0B4550]')}`}>
                              {s.attendees?.length || 0} / {s.capacity}
                            </span>
                          </div>
                        </div>

                        {/* ALWAYS SHOW WHO IS ATTENDING */}
                        <div className="pt-2 border-t border-gray-100 mt-2">
                          <p className={`text-[9px] font-bold uppercase tracking-widest mb-1 text-[#898A8D]`}>Joining Today:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {s.attendees && s.attendees.length > 0 ? s.attendees.map((a, i) => (
                              <span key={i} className={`text-[10px] font-bold px-2 py-0.5 rounded text-[#0B4550] border border-gray-100 ${selectedLiveSession?.id === s.id ? 'bg-white' : 'bg-[#F9F7F2]'}`}>• {a.name.split(' ')[0]}</span>
                            )) : (
                              <span className={`text-[10px] font-bold text-[#898A8D]`}>Be the first to join!</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 shrink-0">
                <div className="bg-[#F9F7F2] p-4 rounded-xl mb-3 flex justify-between items-center border border-gray-100">
                  <span className="font-bold text-[#898A8D] text-[10px] uppercase tracking-widest">Package Deduction</span>
                  <span className="font-black text-[#0B4550] text-xs">{clientData?.unlimited ? '0 (Unlimited)' : '-1 Session'}</span>
                </div>
                <button
                  disabled={!selectedLiveSession || selectedLiveSession.isBookedByMe || selectedLiveSession.attendees?.length >= selectedLiveSession.capacity}
                  onClick={handleConfirmBooking}
                  className="w-full py-4 rounded-xl font-black text-xs bg-[#0B4550] text-[#E6FF2B] shadow-lg disabled:opacity-50 transition-all uppercase tracking-widest"
                >
                  {selectedLiveSession?.isBookedByMe ? 'Already Booked' : selectedLiveSession?.attendees?.length >= selectedLiveSession?.capacity ? 'Class Full' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 animate-in zoom-in duration-500 text-center py-6">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-5 border border-emerald-200"><CalendarCheck size={36} /></div>
              <h2 className="text-2xl font-black text-[#0B4550] mb-2">Session Confirmed!</h2>
              <p className="text-[#898A8D] font-bold text-xs mb-6">Your trainer has been notified.</p>

              <div className="bg-[#F9F7F2] w-full p-5 rounded-2xl border border-gray-100 mb-6">
                <p className="text-[10px] font-bold text-[#898A8D] uppercase tracking-widest mb-1">Date & Time</p>
                <h3 className="text-base font-black text-[#0B4550]">{MONTHS[currentMonth]} {selectedDate}, 2026</h3>
                <h3 className="text-base font-black text-[#0B4550]">{selectedLiveSession?.time}</h3>
              </div>

              <button onClick={() => downloadICS(selectedDate, currentMonth, selectedLiveSession?.time)} className="w-full bg-[#0B4550] hover:bg-[#0B4550]/90 text-[#E6FF2B] py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all mb-3">
                <CalendarPlus size={16} /> Add to Calendar
              </button>
              <button onClick={closeBookingDrawer} className="font-bold text-[#898A8D] hover:text-[#0B4550] transition-colors text-xs uppercase tracking-widest p-2">Close</button>
            </div>
          )}
        </div>

        {/* TOP UP MODAL */}
        {isTopUpOpen && (
          <>
            {/* DESKTOP MODAL */}
            <div className="hidden md:flex fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] justify-center items-center p-4">
              <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-xl shadow-2xl relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto no-scrollbar">
                <button onClick={() => setIsTopUpOpen(false)} className="absolute top-6 right-6 w-10 h-10 bg-[#F9F7F2] rounded-full flex items-center justify-center text-[#0B4550] hover:bg-gray-200 transition-colors"><X size={20} /></button>

                <div className="text-center mb-8 mt-2">
                  <div className="w-16 h-16 bg-[#0B4550] text-[#E6FF2B] rounded-full flex items-center justify-center mx-auto mb-4 shadow-md"><Package size={32} /></div>
                  <h2 className="text-3xl font-extrabold text-[#0B4550]">Top Up Sessions</h2>
                  <p className="text-[#898A8D] font-bold mt-2">Choose a package to continue booking classes.</p>
                </div>

                <div className="space-y-4">
                  {packagesList.map(pkg => (
                    <div key={pkg.id} className="border-2 border-gray-100 rounded-3xl p-6 flex flex-col justify-between items-center gap-6 hover:border-[#0B4550] transition-colors group bg-white">
                      <div className="flex-1 w-full text-center">
                        <span className="inline-block px-3 py-1 rounded-lg bg-[#F9F7F2] text-[#0B4550] text-[10px] font-extrabold uppercase tracking-widest mb-3">{pkg.type}</span>
                        <h3 className="text-xl font-extrabold text-[#0B4550] mb-1">{pkg.name}</h3>
                        <p className="text-[#898A8D] font-bold text-sm">Valid for {pkg.validity_days} days</p>
                      </div>

                      <div className="text-center w-full">
                        <div className="flex items-baseline justify-center gap-1 mb-3">
                          <span className="text-sm font-bold text-[#898A8D]">RM</span>
                          <span className="text-3xl font-black text-[#0B4550]">{pkg.price}</span>
                        </div>
                        <button
                          onClick={() => handlePurchasePackage(pkg)}
                          className="w-full px-8 py-3 rounded-xl font-extrabold bg-[#0B4550] text-[#E6FF2B] hover:scale-105 transition-transform shadow-md"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* MOBILE MODAL */}
            <div className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex justify-center items-end p-0">
              <div className="bg-white border-t border-gray-150 rounded-t-[2.5rem] p-6 w-full relative animate-in slide-in-from-bottom-10 duration-300 max-h-[85vh] flex flex-col pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 shrink-0"></div>
                <button onClick={() => setIsTopUpOpen(false)} className="absolute top-6 right-6 w-8 h-8 bg-[#F9F7F2] rounded-full flex items-center justify-center text-[#898A8D] hover:text-[#0B4550] transition-colors"><X size={16} /></button>

                <div className="mb-6 mt-2 shrink-0 pr-10">
                  <div className="w-12 h-12 bg-[#0B4550] text-[#E6FF2B] rounded-2xl flex items-center justify-center mb-3 border border-[#0B4550] shadow-md"><Package size={24} /></div>
                  <h2 className="text-2xl font-black text-[#0B4550]">Top Up Sessions</h2>
                  <p className="text-[#898A8D] font-bold text-xs mt-1">Choose a package to continue booking classes.</p>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 min-h-0">
                  {packagesList.map(pkg => (
                    <div key={pkg.id} className="border border-gray-100 rounded-[1.5rem] p-5 flex flex-col gap-4 bg-[#F9F7F2] relative overflow-hidden">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="inline-block px-2 py-1 rounded bg-white text-[#0B4550] text-[9px] font-black uppercase tracking-widest mb-2 border border-gray-100">{pkg.type}</span>
                          <h3 className="text-lg font-black text-[#0B4550] leading-tight">{pkg.name}</h3>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-bold text-[#898A8D] mr-1">RM</span>
                          <span className="text-2xl font-black text-[#0B4550]">{pkg.price}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-1">
                        <p className="text-[#898A8D] font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                          <Clock size={12} /> {pkg.validity_days} days
                        </p>
                        <button
                          onClick={() => handlePurchasePackage(pkg)}
                          className="px-5 py-2 rounded-xl font-black text-[10px] bg-[#0B4550] text-[#E6FF2B] uppercase tracking-widest shadow-md"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* WORKOUT BUILDER MODAL */}
        {isBuilderOpen && (
          <div className="fixed inset-0 bg-[#F9F7F2] z-[100] flex flex-col animate-in zoom-in duration-300">
            <div className="bg-white px-10 py-6 border-b border-gray-100 flex items-center justify-between shadow-sm shrink-0">
              <div className="flex items-center gap-6 md:gap-16 mx-auto w-full max-w-4xl">
                <StepIndicator num={1} label="Equipment" active={step >= 1} current={step === 1} />
                <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-[#0B4550]' : 'bg-gray-100'}`}></div>

                <StepIndicator num={2} label="Muscles" active={step >= 2} current={step === 2} />
                <div className={`flex-1 h-1 rounded-full ${step >= 3 ? 'bg-[#0B4550]' : 'bg-gray-100'}`}></div>

                <StepIndicator num={3} label="Preferences" active={step >= 3} current={step === 3} />
                <div className={`flex-1 h-1 rounded-full ${step >= 4 ? 'bg-[#0B4550]' : 'bg-gray-100'}`}></div>

                <StepIndicator num={4} label="Exercises" active={step === 4} current={step === 4} />
              </div>
              <button onClick={() => { setIsBuilderOpen(false); setStep(1); }} className="absolute right-8 top-8 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#898A8D] hover:bg-red-50 hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 flex justify-center">
              <div className="max-w-4xl w-full">

                {/* STEP 1: SELECT EQUIPMENT */}
                {step === 1 && (
                  <div className="animate-in slide-in-from-right-4">
                    <div className="text-center mb-6 sm:mb-10">
                      <h2 className="text-3xl sm:text-4xl font-medium text-[#0B4550] mb-2">Select Equipment</h2>
                      <p className="text-base sm:text-lg text-[#898A8D] font-medium">What are we working with today?</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {EQUIPMENT_OPTIONS.map(eq => {
                        const isSelected = selectedEquip.includes(eq);
                        return (
                          <div
                            key={eq}
                            onClick={() => toggleSelection(eq, selectedEquip, setSelectedEquip)}
                            className={`group relative bg-white rounded-[1.5rem] overflow-hidden border-4 cursor-pointer transition-all hover:scale-[1.02] flex flex-col h-36 ${isSelected ? 'border-[#0B4550] shadow-md scale-[1.03]' : 'border-transparent shadow-sm'}`}
                          >
                            <img src={EQUIPMENT_IMAGES[eq]} alt={eq} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity ${isSelected ? 'opacity-90' : 'opacity-70 group-hover:opacity-60'}`} />
                            {isSelected && (
                              <div className="absolute top-3 right-3 bg-[#E6FF2B] text-[#0B4550] p-1 rounded-full shadow-md animate-in zoom-in">
                                <CheckCircle2 size={16} className="stroke-[3px]" />
                              </div>
                            )}
                            <div className="absolute bottom-3 left-4 right-4">
                              <span className="font-extrabold text-sm sm:text-base tracking-wide text-white drop-shadow-sm">{eq}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 2: TARGET MUSCLE SELECTION */}
                {step === 2 && (
                  <div className="animate-in slide-in-from-right-4">
                    <div className="text-center mb-6">
                      <h2 className="text-3xl sm:text-4xl font-medium text-[#0B4550] mb-2">Target Muscles</h2>
                      <p className="text-base sm:text-lg text-[#898A8D] font-medium">Select the muscle groups you want to target.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mt-4">
                      {/* Left: SVG Body Map */}
                      <div className="md:col-span-5 flex flex-col justify-center">
                        <div className="flex bg-[#F9F7F2] p-1 rounded-xl border border-gray-200/80 w-fit mx-auto mb-4">
                          <button
                            type="button"
                            onClick={() => setBodyView('front')}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${bodyView === 'front' ? 'bg-[#0B4550] text-[#E6FF2B] shadow-sm' : 'text-[#898A8D]'}`}
                          >
                            Front View
                          </button>
                          <button
                            type="button"
                            onClick={() => setBodyView('back')}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${bodyView === 'back' ? 'bg-[#0B4550] text-[#E6FF2B] shadow-sm' : 'text-[#898A8D]'}`}
                          >
                            Back View
                          </button>
                        </div>

                        {/* 3D Flip Container */}
                        <div className="w-full max-w-[240px] h-[340px] mx-auto relative" style={{ perspective: '1000px' }}>
                          <div className="w-full h-full relative transition-transform duration-700" style={{ transformStyle: 'preserve-3d', transform: bodyView === 'back' ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>

                            {/* Front Side */}
                            <div className="absolute inset-0 w-full h-full bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-center" style={{ backfaceVisibility: 'hidden' }}>
                              <svg viewBox="0 0 200 380" className="w-full h-full max-h-[320px] text-[#0B4550]">
                                <defs>
                                  <linearGradient id="activeMuscleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#FF6B6B" />
                                    <stop offset="100%" stopColor="#FF5252" />
                                  </linearGradient>
                                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                  </filter>
                                </defs>
                                <path d="M 100,20 C 120,20 120,50 100,50 C 80,50 80,20 100,20 Z M 100,50 L 100,60 M 80,60 L 120,60 L 140,90 L 150,150 L 138,150 L 130,105 L 120,160 L 122,250 L 114,350 L 108,350 L 105,250 L 100,200 L 95,250 L 92,350 L 86,350 L 78,250 L 80,160 L 70,105 L 62,150 L 50,150 L 60,90 Z" fill="none" stroke="#E5E7EB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                <ellipse cx="100" cy="35" rx="14" ry="18" className="fill-[#F9F7F2] stroke-gray-300 stroke-[1.5]" />

                                {/* Chest */}
                                <path
                                  d="M 100,70 L 78,73 C 76,90 82,105 100,105 Z"
                                  className="transition-all duration-300 cursor-pointer hover:opacity-85"
                                  style={{
                                    fill: selectedMuscles.includes('Chest') ? 'url(#activeMuscleGrad)' : '#E5E7EB',
                                    stroke: selectedMuscles.includes('Chest') ? '#FF5252' : '#D1D5DB',
                                    strokeWidth: selectedMuscles.includes('Chest') ? '2' : '1',
                                    filter: selectedMuscles.includes('Chest') ? 'url(#glow)' : 'none'
                                  }}
                                  onClick={() => toggleSelection('Chest', selectedMuscles, setSelectedMuscles)}
                                />
                                <path
                                  d="M 100,70 L 122,73 C 124,90 118,105 100,105 Z"
                                  className="transition-all duration-300 cursor-pointer hover:opacity-85"
                                  style={{
                                    fill: selectedMuscles.includes('Chest') ? 'url(#activeMuscleGrad)' : '#E5E7EB',
                                    stroke: selectedMuscles.includes('Chest') ? '#FF5252' : '#D1D5DB',
                                    strokeWidth: selectedMuscles.includes('Chest') ? '2' : '1',
                                    filter: selectedMuscles.includes('Chest') ? 'url(#glow)' : 'none'
                                  }}
                                  onClick={() => toggleSelection('Chest', selectedMuscles, setSelectedMuscles)}
                                />

                                {/* Shoulders */}
                                <path
                                  d="M 78,65 C 67,67 62,80 66,92 C 70,88 74,80 78,74 Z"
                                  className="transition-all duration-300 cursor-pointer hover:opacity-85"
                                  style={{
                                    fill: selectedMuscles.includes('Shoulders') ? 'url(#activeMuscleGrad)' : '#E5E7EB',
                                    stroke: selectedMuscles.includes('Shoulders') ? '#FF5252' : '#D1D5DB',
                                    strokeWidth: selectedMuscles.includes('Shoulders') ? '2' : '1',
                                    filter: selectedMuscles.includes('Shoulders') ? 'url(#glow)' : 'none'
                                  }}
                                  onClick={() => toggleSelection('Shoulders', selectedMuscles, setSelectedMuscles)}
                                />
                                <path
                                  d="M 122,65 C 133,67 138,80 134,92 C 130,88 126,80 122,74 Z"
                                  className="transition-all duration-300 cursor-pointer hover:opacity-85"
                                  style={{
                                    fill: selectedMuscles.includes('Shoulders') ? 'url(#activeMuscleGrad)' : '#E5E7EB',
                                    stroke: selectedMuscles.includes('Shoulders') ? '#FF5252' : '#D1D5DB',
                                    strokeWidth: selectedMuscles.includes('Shoulders') ? '2' : '1',
                                    filter: selectedMuscles.includes('Shoulders') ? 'url(#glow)' : 'none'
                                  }}
                                  onClick={() => toggleSelection('Shoulders', selectedMuscles, setSelectedMuscles)}
                                />

                                {/* Core (Abs) */}
                                <path
                                  d="M 84,107 L 116,107 L 112,160 L 88,160 Z"
                                  className="transition-all duration-300 cursor-pointer hover:opacity-85"
                                  style={{
                                    fill: selectedMuscles.includes('Core') ? 'url(#activeMuscleGrad)' : '#E5E7EB',
                                    stroke: selectedMuscles.includes('Core') ? '#FF5252' : '#D1D5DB',
                                    strokeWidth: selectedMuscles.includes('Core') ? '2' : '1',
                                    filter: selectedMuscles.includes('Core') ? 'url(#glow)' : 'none'
                                  }}
                                  onClick={() => toggleSelection('Core', selectedMuscles, setSelectedMuscles)}
                                />

                                {/* Arms */}
                                <path
                                  d="M 66,92 C 60,105 58,118 64,124 L 72,104 Z"
                                  className="transition-all duration-300 cursor-pointer hover:opacity-85"
                                  style={{
                                    fill: selectedMuscles.includes('Arms') ? 'url(#activeMuscleGrad)' : '#E5E7EB',
                                    stroke: selectedMuscles.includes('Arms') ? '#FF5252' : '#D1D5DB',
                                    strokeWidth: selectedMuscles.includes('Arms') ? '2' : '1',
                                    filter: selectedMuscles.includes('Arms') ? 'url(#glow)' : 'none'
                                  }}
                                  onClick={() => toggleSelection('Arms', selectedMuscles, setSelectedMuscles)}
                                />
                                <path
                                  d="M 64,124 L 54,155 C 57,162 61,162 66,155 L 72,126 Z"
                                  className="transition-all duration-300 cursor-pointer hover:opacity-85"
                                  style={{
                                    fill: selectedMuscles.includes('Arms') ? 'url(#activeMuscleGrad)' : '#E5E7EB',
                                    stroke: selectedMuscles.includes('Arms') ? '#FF5252' : '#D1D5DB',
                                    strokeWidth: selectedMuscles.includes('Arms') ? '2' : '1',
                                    filter: selectedMuscles.includes('Arms') ? 'url(#glow)' : 'none'
                                  }}
                                  onClick={() => toggleSelection('Arms', selectedMuscles, setSelectedMuscles)}
                                />
                                <path
                                  d="M 134,92 C 140,105 142,118 136,124 L 128,104 Z"
                                  className="transition-all duration-300 cursor-pointer hover:opacity-85"
                                  style={{
                                    fill: selectedMuscles.includes('Arms') ? 'url(#activeMuscleGrad)' : '#E5E7EB',
                                    stroke: selectedMuscles.includes('Arms') ? '#FF5252' : '#D1D5DB',
                                    strokeWidth: selectedMuscles.includes('Arms') ? '2' : '1',
                                    filter: selectedMuscles.includes('Arms') ? 'url(#glow)' : 'none'
                                  }}
                                  onClick={() => toggleSelection('Arms', selectedMuscles, setSelectedMuscles)}
                                />
                                <path
                                  d="M 136,124 L 146,155 C 143,162 139,162 134,155 L 128,126 Z"
                                  className="transition-all duration-300 cursor-pointer hover:opacity-85"
                                  style={{
                                    fill: selectedMuscles.includes('Arms') ? 'url(#activeMuscleGrad)' : '#E5E7EB',
                                    stroke: selectedMuscles.includes('Arms') ? '#FF5252' : '#D1D5DB',
                                    strokeWidth: selectedMuscles.includes('Arms') ? '2' : '1',
                                    filter: selectedMuscles.includes('Arms') ? 'url(#glow)' : 'none'
                                  }}
                                  onClick={() => toggleSelection('Arms', selectedMuscles, setSelectedMuscles)}
                                />

                                {/* Legs */}
                                <path
                                  d="M 86,165 C 72,200 78,250 86,255 C 92,255 96,220 98,165 Z"
                                  className="transition-all duration-300 cursor-pointer hover:opacity-85"
                                  style={{
                                    fill: selectedMuscles.includes('Legs') ? 'url(#activeMuscleGrad)' : '#E5E7EB',
                                    stroke: selectedMuscles.includes('Legs') ? '#FF5252' : '#D1D5DB',
                                    strokeWidth: selectedMuscles.includes('Legs') ? '2' : '1',
                                    filter: selectedMuscles.includes('Legs') ? 'url(#glow)' : 'none'
                                  }}
                                  onClick={() => toggleSelection('Legs', selectedMuscles, setSelectedMuscles)}
                                />
                                <path
                                  d="M 86,258 C 76,285 82,335 88,340 C 90,340 92,300 92,258 Z"
                                  className="transition-all duration-300 cursor-pointer hover:opacity-85"
                                  style={{
                                    fill: selectedMuscles.includes('Legs') ? 'url(#activeMuscleGrad)' : '#E5E7EB',
                                    stroke: selectedMuscles.includes('Legs') ? '#FF5252' : '#D1D5DB',
                                    strokeWidth: selectedMuscles.includes('Legs') ? '2' : '1',
                                    filter: selectedMuscles.includes('Legs') ? 'url(#glow)' : 'none'
                                  }}
                                  onClick={() => toggleSelection('Legs', selectedMuscles, setSelectedMuscles)}
                                />
                                <path
                                  d="M 114,165 C 128,200 122,250 114,255 C 108,255 104,220 102,165 Z"
                                  className="transition-all duration-300 cursor-pointer hover:opacity-85"
                                  style={{
                                    fill: selectedMuscles.includes('Legs') ? 'url(#activeMuscleGrad)' : '#E5E7EB',
                                    stroke: selectedMuscles.includes('Legs') ? '#FF5252' : '#D1D5DB',
                                    strokeWidth: selectedMuscles.includes('Legs') ? '2' : '1',
                                    filter: selectedMuscles.includes('Legs') ? 'url(#glow)' : 'none'
                                  }}
                                  onClick={() => toggleSelection('Legs', selectedMuscles, setSelectedMuscles)}
                                />
                                <path
                                  d="M 114,258 C 124,285 118,335 112,340 C 110,340 108,300 108,258 Z"
                                  className="transition-all duration-300 cursor-pointer hover:opacity-85"
                                  style={{
                                    fill: selectedMuscles.includes('Legs') ? 'url(#activeMuscleGrad)' : '#E5E7EB',
                                    stroke: selectedMuscles.includes('Legs') ? '#FF5252' : '#D1D5DB',
                                    strokeWidth: selectedMuscles.includes('Legs') ? '2' : '1',
                                    filter: selectedMuscles.includes('Legs') ? 'url(#glow)' : 'none'
                                  }}
                                  onClick={() => toggleSelection('Legs', selectedMuscles, setSelectedMuscles)}
                                />
                              </svg>
                            </div>

                            {/* Back Side */}
                            <div className="absolute inset-0 w-full h-full bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-center" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                              <svg viewBox="0 0 200 380" className="w-full h-full max-h-[320px] text-[#0B4550]">
                                <defs>
                                  <linearGradient id="activeMuscleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#FF6B6B" />
                                    <stop offset="100%" stopColor="#FF5252" />
                                  </linearGradient>
                                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                  </filter>
                                </defs>
                                <path d="M 100,20 C 120,20 120,50 100,50 C 80,50 80,20 100,20 Z M 100,50 L 100,60 M 80,60 L 120,60 L 140,90 L 150,150 L 138,150 L 130,105 L 120,160 L 122,250 L 114,350 L 108,350 L 105,250 L 100,200 L 95,250 L 92,350 L 86,350 L 78,250 L 80,160 L 70,105 L 62,150 L 50,150 L 60,90 Z" fill="none" stroke="#E5E7EB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                <ellipse cx="100" cy="35" rx="14" ry="18" className="fill-[#F9F7F2] stroke-gray-300 stroke-[1.5]" />

                                {/* Shoulders */}
                                <path
                                  d="M 78,65 C 67,67 62,80 66,92 C 70,88 74,80 78,74 Z"
                                  className="transition-all duration-300 cursor-pointer hover:opacity-85"
                                  style={{
                                    fill: selectedMuscles.includes('Shoulders') ? 'url(#activeMuscleGrad)' : '#E5E7EB',
                                    stroke: selectedMuscles.includes('Shoulders') ? '#FF5252' : '#D1D5DB',
                                    strokeWidth: selectedMuscles.includes('Shoulders') ? '2' : '1',
                                    filter: selectedMuscles.includes('Shoulders') ? 'url(#glow)' : 'none'
                                  }}
                                  onClick={() => toggleSelection('Shoulders', selectedMuscles, setSelectedMuscles)}
                                />
                                <path
                                  d="M 122,65 C 133,67 138,80 134,92 C 130,88 126,80 122,74 Z"
                                  className="transition-all duration-300 cursor-pointer hover:opacity-85"
                                  style={{
                                    fill: selectedMuscles.includes('Shoulders') ? 'url(#activeMuscleGrad)' : '#E5E7EB',
                                    stroke: selectedMuscles.includes('Shoulders') ? '#FF5252' : '#D1D5DB',
                                    strokeWidth: selectedMuscles.includes('Shoulders') ? '2' : '1',
                                    filter: selectedMuscles.includes('Shoulders') ? 'url(#glow)' : 'none'
                                  }}
                                  onClick={() => toggleSelection('Shoulders', selectedMuscles, setSelectedMuscles)}
                                />

                                {/* Back */}
                                <path
                                  d="M 100,58 L 82,70 L 100,85 L 118,70 Z"
                                  className="transition-all duration-300 cursor-pointer hover:opacity-85"
                                  style={{
                                    fill: selectedMuscles.includes('Back') ? 'url(#activeMuscleGrad)' : '#E5E7EB',
                                    stroke: selectedMuscles.includes('Back') ? '#FF5252' : '#D1D5DB',
                                    strokeWidth: selectedMuscles.includes('Back') ? '2' : '1',
                                    filter: selectedMuscles.includes('Back') ? 'url(#glow)' : 'none'
                                  }}
                                  onClick={() => toggleSelection('Back', selectedMuscles, setSelectedMuscles)}
                                />
                                <path
                                  d="M 100,85 L 80,94 C 76,120 84,135 100,135 Z"
                                  className="transition-all duration-300 cursor-pointer hover:opacity-85"
                                  style={{
                                    fill: selectedMuscles.includes('Back') ? 'url(#activeMuscleGrad)' : '#E5E7EB',
                                    stroke: selectedMuscles.includes('Back') ? '#FF5252' : '#D1D5DB',
                                    strokeWidth: selectedMuscles.includes('Back') ? '2' : '1',
                                    filter: selectedMuscles.includes('Back') ? 'url(#glow)' : 'none'
                                  }}
                                  onClick={() => toggleSelection('Back', selectedMuscles, setSelectedMuscles)}
                                />
                                <path
                                  d="M 100,85 L 120,94 C 124,120 116,135 100,135 Z"
                                  className="transition-all duration-300 cursor-pointer hover:opacity-85"
                                  style={{
                                    fill: selectedMuscles.includes('Back') ? 'url(#activeMuscleGrad)' : '#E5E7EB',
                                    stroke: selectedMuscles.includes('Back') ? '#FF5252' : '#D1D5DB',
                                    strokeWidth: selectedMuscles.includes('Back') ? '2' : '1',
                                    filter: selectedMuscles.includes('Back') ? 'url(#glow)' : 'none'
                                  }}
                                  onClick={() => toggleSelection('Back', selectedMuscles, setSelectedMuscles)}
                                />
                                <path
                                  d="M 86,135 L 114,135 L 110,165 L 90,165 Z"
                                  className="transition-all duration-300 cursor-pointer hover:opacity-85"
                                  style={{
                                    fill: selectedMuscles.includes('Back') ? 'url(#activeMuscleGrad)' : '#E5E7EB',
                                    stroke: selectedMuscles.includes('Back') ? '#FF5252' : '#D1D5DB',
                                    strokeWidth: selectedMuscles.includes('Back') ? '2' : '1',
                                    filter: selectedMuscles.includes('Back') ? 'url(#glow)' : 'none'
                                  }}
                                  onClick={() => toggleSelection('Back', selectedMuscles, setSelectedMuscles)}
                                />

                                {/* Arms */}
                                <path
                                  d="M 66,92 C 60,105 58,118 64,124 L 72,104 Z"
                                  className="transition-all duration-300 cursor-pointer hover:opacity-85"
                                  style={{
                                    fill: selectedMuscles.includes('Arms') ? 'url(#activeMuscleGrad)' : '#E5E7EB',
                                    stroke: selectedMuscles.includes('Arms') ? '#FF5252' : '#D1D5DB',
                                    strokeWidth: selectedMuscles.includes('Arms') ? '2' : '1',
                                    filter: selectedMuscles.includes('Arms') ? 'url(#glow)' : 'none'
                                  }}
                                  onClick={() => toggleSelection('Arms', selectedMuscles, setSelectedMuscles)}
                                />
                                <path
                                  d="M 64,124 L 54,155 C 57,162 61,162 66,155 L 72,126 Z"
                                  className="transition-all duration-300 cursor-pointer hover:opacity-85"
                                  style={{
                                    fill: selectedMuscles.includes('Arms') ? 'url(#activeMuscleGrad)' : '#E5E7EB',
                                    stroke: selectedMuscles.includes('Arms') ? '#FF5252' : '#D1D5DB',
                                    strokeWidth: selectedMuscles.includes('Arms') ? '2' : '1',
                                    filter: selectedMuscles.includes('Arms') ? 'url(#glow)' : 'none'
                                  }}
                                  onClick={() => toggleSelection('Arms', selectedMuscles, setSelectedMuscles)}
                                />
                                <path
                                  d="M 134,92 C 140,105 142,118 136,124 L 128,104 Z"
                                  className="transition-all duration-300 cursor-pointer hover:opacity-85"
                                  style={{
                                    fill: selectedMuscles.includes('Arms') ? 'url(#activeMuscleGrad)' : '#E5E7EB',
                                    stroke: selectedMuscles.includes('Arms') ? '#FF5252' : '#D1D5DB',
                                    strokeWidth: selectedMuscles.includes('Arms') ? '2' : '1',
                                    filter: selectedMuscles.includes('Arms') ? 'url(#glow)' : 'none'
                                  }}
                                  onClick={() => toggleSelection('Arms', selectedMuscles, setSelectedMuscles)}
                                />
                                <path
                                  d="M 136,124 L 146,155 C 143,162 139,162 134,155 L 128,126 Z"
                                  className="transition-all duration-300 cursor-pointer hover:opacity-85"
                                  style={{
                                    fill: selectedMuscles.includes('Arms') ? 'url(#activeMuscleGrad)' : '#E5E7EB',
                                    stroke: selectedMuscles.includes('Arms') ? '#FF5252' : '#D1D5DB',
                                    strokeWidth: selectedMuscles.includes('Arms') ? '2' : '1',
                                    filter: selectedMuscles.includes('Arms') ? 'url(#glow)' : 'none'
                                  }}
                                  onClick={() => toggleSelection('Arms', selectedMuscles, setSelectedMuscles)}
                                />

                                {/* Legs */}
                                <path
                                  d="M 88,166 L 112,166 C 120,185 110,205 100,205 C 90,205 80,185 88,166 Z"
                                  className="transition-all duration-300 cursor-pointer hover:opacity-85"
                                  style={{
                                    fill: selectedMuscles.includes('Legs') ? 'url(#activeMuscleGrad)' : '#E5E7EB',
                                    stroke: selectedMuscles.includes('Legs') ? '#FF5252' : '#D1D5DB',
                                    strokeWidth: selectedMuscles.includes('Legs') ? '2' : '1',
                                    filter: selectedMuscles.includes('Legs') ? 'url(#glow)' : 'none'
                                  }}
                                  onClick={() => toggleSelection('Legs', selectedMuscles, setSelectedMuscles)}
                                />
                                <path
                                  d="M 86,206 C 72,225 76,250 86,255 C 92,255 96,230 96,206 Z"
                                  className="transition-all duration-300 cursor-pointer hover:opacity-85"
                                  style={{
                                    fill: selectedMuscles.includes('Legs') ? 'url(#activeMuscleGrad)' : '#E5E7EB',
                                    stroke: selectedMuscles.includes('Legs') ? '#FF5252' : '#D1D5DB',
                                    strokeWidth: selectedMuscles.includes('Legs') ? '2' : '1',
                                    filter: selectedMuscles.includes('Legs') ? 'url(#glow)' : 'none'
                                  }}
                                  onClick={() => toggleSelection('Legs', selectedMuscles, setSelectedMuscles)}
                                />
                                <path
                                  d="M 86,258 C 76,285 82,335 88,340 C 90,340 92,300 92,258 Z"
                                  className="transition-all duration-300 cursor-pointer hover:opacity-85"
                                  style={{
                                    fill: selectedMuscles.includes('Legs') ? 'url(#activeMuscleGrad)' : '#E5E7EB',
                                    stroke: selectedMuscles.includes('Legs') ? '#FF5252' : '#D1D5DB',
                                    strokeWidth: selectedMuscles.includes('Legs') ? '2' : '1',
                                    filter: selectedMuscles.includes('Legs') ? 'url(#glow)' : 'none'
                                  }}
                                  onClick={() => toggleSelection('Legs', selectedMuscles, setSelectedMuscles)}
                                />
                                <path
                                  d="M 114,206 C 128,225 124,250 114,255 C 108,255 104,230 104,206 Z"
                                  className="transition-all duration-300 cursor-pointer hover:opacity-85"
                                  style={{
                                    fill: selectedMuscles.includes('Legs') ? 'url(#activeMuscleGrad)' : '#E5E7EB',
                                    stroke: selectedMuscles.includes('Legs') ? '#FF5252' : '#D1D5DB',
                                    strokeWidth: selectedMuscles.includes('Legs') ? '2' : '1',
                                    filter: selectedMuscles.includes('Legs') ? 'url(#glow)' : 'none'
                                  }}
                                  onClick={() => toggleSelection('Legs', selectedMuscles, setSelectedMuscles)}
                                />
                                <path
                                  d="M 114,258 C 124,285 118,335 112,340 C 110,340 108,300 108,258 Z"
                                  className="transition-all duration-300 cursor-pointer hover:opacity-85"
                                  style={{
                                    fill: selectedMuscles.includes('Legs') ? 'url(#activeMuscleGrad)' : '#E5E7EB',
                                    stroke: selectedMuscles.includes('Legs') ? '#FF5252' : '#D1D5DB',
                                    strokeWidth: selectedMuscles.includes('Legs') ? '2' : '1',
                                    filter: selectedMuscles.includes('Legs') ? 'url(#glow)' : 'none'
                                  }}
                                  onClick={() => toggleSelection('Legs', selectedMuscles, setSelectedMuscles)}
                                />
                              </svg>
                            </div>

                          </div>
                        </div>
                      </div>

                      {/* Right: Selection List */}
                      <div className="md:col-span-7 space-y-4">
                        <h3 className="text-lg font-bold text-[#0B4550] uppercase tracking-wider mb-2">Target Muscles</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {MUSCLE_OPTIONS.map(m => {
                            const isSelected = selectedMuscles.includes(m);
                            return (
                              <div
                                key={m}
                                onClick={() => toggleSelection(m, selectedMuscles, setSelectedMuscles)}
                                className={`p-5 rounded-[2rem] border-4 cursor-pointer transition-all flex flex-col items-center gap-3 hover:scale-[1.02] ${isSelected ? 'border-[#0B4550] bg-[#0B4550] text-white shadow-md' : 'bg-white border-transparent text-[#0B4550] shadow-sm hover:border-gray-200'}`}
                              >
                                <Target size={30} className={isSelected ? 'text-[#E6FF2B]' : 'text-gray-400'} />
                                <span className="font-extrabold text-sm tracking-wide">{m}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: AI ROUTINE PREFERENCES */}
                {step === 3 && (
                  <div className="animate-in slide-in-from-right-4">
                    <div className="text-center mb-6 sm:mb-10">
                      <h2 className="text-3xl sm:text-4xl font-medium text-[#0B4550] mb-2">AI Routine Customizer</h2>
                      <p className="text-base sm:text-lg text-[#898A8D] font-medium">Fine-tune your training program parameters.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                      {/* Fitness Experience */}
                      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-3">
                        <label className="text-[11px] font-bold text-[#898A8D] uppercase tracking-widest block">Fitness Experience</label>
                        <div className="flex gap-2 bg-[#F9F7F2] p-1.5 rounded-2xl border border-gray-100">
                          {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                            <button
                              type="button"
                              key={level}
                              onClick={() => setDifficulty(level)}
                              className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all ${difficulty === level ? 'bg-[#0B4550] text-white shadow-sm' : 'text-[#898A8D] hover:text-[#0B4550]'}`}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Fitness Goal */}
                      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-3">
                        <label className="text-[11px] font-bold text-[#898A8D] uppercase tracking-widest block">Fitness Goal</label>
                        <div className="flex gap-2 bg-[#F9F7F2] p-1.5 rounded-2xl border border-gray-100">
                          {['Strength', 'Hypertrophy', 'Endurance'].map(goalOption => (
                            <button
                              type="button"
                              key={goalOption}
                              onClick={() => setWorkoutGoal(goalOption)}
                              className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all ${workoutGoal === goalOption ? 'bg-[#0B4550] text-white shadow-sm' : 'text-[#898A8D] hover:text-[#0B4550]'}`}
                            >
                              {goalOption}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Workout Style */}
                      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-3">
                        <label className="text-[11px] font-bold text-[#898A8D] uppercase tracking-widest block">Workout Style</label>
                        <div className="flex gap-2 bg-[#F9F7F2] p-1.5 rounded-2xl border border-gray-100">
                          {['Standard', 'Circuits'].map(style => (
                            <button
                              type="button"
                              key={style}
                              onClick={() => setWorkoutStyle(style)}
                              className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all ${workoutStyle === style ? 'bg-[#0B4550] text-white shadow-sm' : 'text-[#898A8D] hover:text-[#0B4550]'}`}
                            >
                              {style === 'Standard' ? 'Standard Sets' : 'Circuits & Supersets'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Workout Duration */}
                      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-3">
                        <label className="text-[11px] font-bold text-[#898A8D] uppercase tracking-widest block">Workout Duration</label>
                        <div className="flex gap-2 bg-[#F9F7F2] p-1.5 rounded-2xl border border-gray-100">
                          {[30, 45, 60, 90].map(mins => (
                            <button
                              type="button"
                              key={mins}
                              onClick={() => setWorkoutDuration(mins)}
                              className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all ${workoutDuration === mins ? 'bg-[#0B4550] text-white shadow-sm' : 'text-[#898A8D] hover:text-[#0B4550]'}`}
                            >
                              {mins} min
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Warm-Up / Cool-Down Toggles */}
                      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4 col-span-1 md:col-span-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-extrabold text-sm text-[#0B4550]">Include Warm-Up Routine</p>
                            <p className="text-xs font-bold text-[#898A8D]">Add a 5-minute dynamic warm-up to prep joints</p>
                          </div>
                          <Toggle active={includeWarmup} onClick={() => setIncludeWarmup(!includeWarmup)} />
                        </div>
                        <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                          <div>
                            <p className="font-extrabold text-sm text-[#0B4550]">Include Cool-Down Routine</p>
                            <p className="text-xs font-bold text-[#898A8D]">Add a 5-minute full-body static stretching session</p>
                          </div>
                          <Toggle active={includeCooldown} onClick={() => setIncludeCooldown(!includeCooldown)} />
                        </div>
                      </div>

                      {/* Joint Care / Injuries */}
                      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-3 col-span-1 md:col-span-2">
                        <label className="text-[11px] font-bold text-[#898A8D] uppercase tracking-widest block">Joint Care & Focus (Protect from strain)</label>
                        <div className="flex flex-wrap gap-2">
                          {['Lower Back', 'Knees', 'Shoulders', 'Wrists'].map(joint => {
                            const active = injuries.includes(joint);
                            return (
                              <button
                                type="button"
                                key={joint}
                                onClick={() => {
                                  if (active) setInjuries(injuries.filter(j => j !== joint));
                                  else setInjuries([...injuries, joint]);
                                }}
                                className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${active ? 'bg-red-500 border-red-500 text-white shadow-sm' : 'bg-[#F9F7F2] border-gray-200 text-[#898A8D]'}`}
                              >
                                Protect {joint}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Exclude Exercises */}
                      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-3 col-span-1 md:col-span-2">
                        <label className="text-[11px] font-bold text-[#898A8D] uppercase tracking-widest block">Exclude Specific Exercises (Optional)</label>
                        <input
                          type="text"
                          value={excludeExercises}
                          onChange={(e) => setExcludeExercises(e.target.value)}
                          placeholder="e.g. Burpees, squats, pull-ups"
                          className="w-full bg-[#F9F7F2] border border-gray-100 rounded-xl p-4 text-xs font-bold text-[#0B4550] outline-none focus:border-[#0B4550] focus:bg-white transition-colors"
                        />
                      </div>

                      {/* Custom Prompt / Special Requests */}
                      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-3 col-span-1 md:col-span-2">
                        <label className="text-[11px] font-bold text-[#898A8D] uppercase tracking-widest block">Special AI Prompts or Requests</label>
                        <textarea
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          placeholder="e.g. Add some core work at the end, extra high intensity, focus on mobility..."
                          className="w-full bg-[#F9F7F2] border border-gray-100 rounded-xl p-4 text-xs font-bold text-[#0B4550] outline-none focus:border-[#0B4550] focus:bg-white transition-colors resize-none h-24"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: EXERCISES REVIEW */}
                {step === 4 && generatedWorkout && (
                  <div className="animate-in slide-in-from-right-4">
                    <div className="text-center mb-8">
                      <h2 className="text-4xl font-medium text-[#0B4550] mb-2">Workout Ready</h2>
                      <p className="text-lg text-[#898A8D] font-medium">Review and customize your custom-tailored training session.</p>
                    </div>

                    {/* AI SUMMARY CARD GRID */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
                        <Clock size={22} className="text-[#0B4550] mb-2 opacity-80" />
                        <span className="text-[10px] font-bold text-[#898A8D] uppercase tracking-widest">Est. Duration</span>
                        <span className="text-lg font-black text-[#0B4550] mt-1">
                          {workoutDuration} mins
                        </span>
                      </div>
                      <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
                        <Target size={22} className="text-[#0B4550] mb-2 opacity-80" />
                        <span className="text-[10px] font-bold text-[#898A8D] uppercase tracking-widest">Training Focus</span>
                        <span className="text-lg font-black text-[#0B4550] mt-1">{workoutGoal}</span>
                      </div>
                      <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
                        <Zap size={22} className="text-[#0B4550] mb-2 opacity-80" />
                        <span className="text-[10px] font-bold text-[#898A8D] uppercase tracking-widest">Intensity Level</span>
                        <span className="text-lg font-black text-[#0B4550] mt-1">{difficulty}</span>
                      </div>
                      <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
                        <Dumbbell size={22} className="text-[#0B4550] mb-2 opacity-80" />
                        <span className="text-[10px] font-bold text-[#898A8D] uppercase tracking-widest">Total Exercises</span>
                        <span className="text-lg font-black text-[#0B4550] mt-1">{generatedWorkout.length} Moves</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                      <div className="divide-y divide-gray-100">
                        {generatedWorkout.map((ex, i) => (
                          <div key={i} className="p-6 flex items-center gap-6 hover:bg-gray-50 transition-colors">
                            <div className="w-14 h-14 bg-[#F9F7F2] rounded-2xl flex items-center justify-center font-medium text-[#0B4550] text-xl shrink-0">
                              {ex.muscle === "Warm-up" || ex.muscle === "Cool-down" ? <Activity size={24} /> : ex.muscle.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-xl font-medium text-[#0B4550]">{ex.name}</h4>
                              <p className="text-sm font-medium text-[#898A8D] uppercase tracking-widest mt-1">
                                {ex.muscle} • {ex.sets?.length || 3} Sets {ex.restDuration > 0 ? `• ${ex.restDuration}s Rest` : ''}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              {ex.muscle !== "Warm-up" && ex.muscle !== "Cool-down" && (
                                <>
                                  <button onClick={() => shuffleExercise(i)} className="flex items-center gap-2 px-5 py-2.5 border-2 border-blue-100 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors text-sm"><RefreshCw size={16} /> Swap</button>
                                  <button onClick={() => removeExercise(i)} className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"><Trash2 size={24} /></button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-6 bg-gray-50 border-t border-gray-100">
                        <button onClick={() => setStep(2)} className="flex items-center gap-2 text-[#0B4550] font-medium text-lg hover:underline"><Plus size={24} /> Add more exercises</button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            <div className="bg-white p-6 pb-8 sm:pb-6 border-t border-gray-100 flex justify-center shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
              <div className="max-w-4xl w-full flex justify-between items-center">
                <button onClick={() => step > 1 ? setStep(step - 1) : setIsBuilderOpen(false)} className="px-8 font-medium text-[#898A8D] flex items-center gap-2 hover:text-[#0B4550] transition-colors">
                  <ChevronLeft size={20} /> Previous
                </button>
                <button
                  disabled={isGenerating || (step === 1 ? selectedEquip.length === 0 : step === 2 ? selectedMuscles.length === 0 : false)}
                  onClick={() => {
                    if (step === 3) {
                      generateWorkout();
                    } else if (step === 4) {
                      setIsBuilderOpen(false);
                    } else {
                      setStep(step + 1);
                    }
                  }}
                  className="bg-[#E6FF2B] text-[#0B4550] px-16 py-4 rounded-full font-medium text-lg shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-3"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#0B4550]/20 border-t-[#0B4550] rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    step === 3 ? 'Generate Workout' : step === 4 ? 'Save to Dashboard' : 'Continue'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE TRACKER MODAL */}
        {isTrackerOpen && generatedWorkout && (
          <div className="fixed inset-0 bg-[#F9F7F2] z-[110] flex flex-col animate-in slide-in-from-right duration-500">
            <header className="bg-white px-8 py-5 border-b border-gray-100 flex justify-between items-center sticky top-0 z-10 shadow-sm shrink-0"><div><h2 className="text-3xl font-medium text-[#0B4550]">Active Session</h2><div className="flex items-center gap-4 mt-1"><span className="text-[#898A8D] font-medium">Targeting: {selectedMuscles.join(", ")}</span><span className="flex items-center gap-1.5 text-[#0B4550] font-medium bg-[#E6FF2B] px-3 py-1 rounded-lg text-sm shadow-sm"><Timer size={16} /> {formatTime(workoutTime)}</span></div></div><div className="flex items-center gap-6">{restTime > 0 && <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-5 py-2.5 rounded-2xl font-medium animate-pulse border border-blue-100 shadow-sm"><Clock size={20} /> Rest: {formatTime(restTime)}</div>}<button onClick={() => setIsTrackerOpen(false)} className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-[#898A8D] hover:bg-red-50 hover:text-red-500 transition-colors"><X size={24} /></button></div></header>
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-4xl mx-auto space-y-8 pb-20">
                {generatedWorkout.map((ex, exIdx) => (
                  <div key={exIdx} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm"><div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6"><div><p className="text-xs font-medium text-[#898A8D] uppercase tracking-widest mb-1">{ex.muscle}</p><h4 className="text-2xl font-medium text-[#0B4550]">{ex.name}</h4></div><div className="flex gap-2"><a href={`https://www.youtube.com/results?search_query=how+to+do+${ex.name.replace(/ /g, '+')}+exercise`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 bg-red-50 px-4 py-2 rounded-xl transition-colors"><PlayCircle size={18} /> Tutorial</a><button onClick={() => shuffleExercise(exIdx)} className="flex items-center gap-2 text-sm font-medium text-blue-500 hover:text-blue-600 bg-blue-50 px-4 py-2 rounded-xl transition-colors"><RefreshCw size={18} /> Swap</button></div></div><div className="flex flex-col gap-3"><div className="grid grid-cols-4 gap-4 px-4 pb-2 border-b border-gray-100 text-xs font-medium text-[#898A8D] uppercase tracking-widest text-center"><div>Set</div><div>Target</div><div>Weight (kg)</div><div>Done</div></div>{ex.sets.map((set, setIdx) => (<div key={setIdx} className={`grid grid-cols-4 gap-4 items-center p-3 rounded-2xl transition-all border ${set.completed ? 'bg-emerald-50 border-emerald-100 opacity-70' : 'bg-[#F9F7F2] border-transparent'}`}><div className="font-medium text-lg text-center text-[#0B4550]">{setIdx + 1}</div><div className="font-medium text-center text-[#898A8D]">{set.targetReps} Reps</div><div><input type="number" placeholder="-" value={set.weight || ''} onChange={(e) => updateSetWeight(exIdx, setIdx, e.target.value)} className={`w-full p-2 rounded-xl text-center font-medium outline-none ${set.completed ? 'bg-transparent text-[#10B981]' : 'bg-white text-[#0B4550] shadow-sm'}`} /></div><button onClick={() => toggleSetComplete(exIdx, setIdx)} className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center transition-all ${set.completed ? 'bg-emerald-500 text-white shadow-md scale-105' : 'bg-white text-gray-300 hover:text-emerald-500 shadow-sm'}`}><CheckCircle2 size={24} /></button></div>))}</div></div>
                ))}
                <button onClick={finishWorkoutSession} className="w-full bg-[#0B4550] text-[#E6FF2B] py-6 rounded-[2.5rem] font-medium text-2xl shadow-xl transition-all hover:scale-[1.02]">Finish & Save Workout</button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW CLASS DETAILS MODAL */}
        {viewClassDetails && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[150] flex justify-center items-center p-4" onClick={() => setViewClassDetails(null)}>
            <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
              <button onClick={() => setViewClassDetails(null)} className="absolute top-6 right-6 w-8 h-8 bg-[#F9F7F2] rounded-full flex items-center justify-center text-[#0B4550] hover:bg-gray-200 transition-colors"><X size={18} /></button>

              <span className="inline-block px-3 py-1 rounded-lg bg-[#E6FF2B] text-[#0B4550] text-[10px] font-medium uppercase tracking-widest mb-4">{viewClassDetails.type}</span>
              <h2 className="text-2xl font-medium text-[#0B4550] mb-2">{viewClassDetails.title}</h2>
              <p className="text-[#898A8D] font-medium text-sm flex items-center gap-2 mb-2"><Clock size={16} /> {formatDbDate(viewClassDetails.date)} at {viewClassDetails.time}</p>
              <p className="text-[#898A8D] font-medium text-sm flex items-center gap-2 mb-6"><MapPin size={16} /> {viewClassDetails.location}</p>

              <div className="bg-[#F9F7F2] rounded-2xl p-5 border border-gray-100">
                <h3 className="text-[#0B4550] font-medium mb-4 flex items-center justify-between">
                  Attendees
                  <span className="text-sm font-medium text-[#898A8D] bg-white px-2 py-1 rounded-md shadow-sm">{viewClassDetails.attendees?.length || 0} / {viewClassDetails.capacity}</span>
                </h3>
                <div className="space-y-3">
                  {viewClassDetails.attendees && viewClassDetails.attendees.length > 0 ? (
                    viewClassDetails.attendees.map((a, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0B4550] text-[#E6FF2B] flex items-center justify-center text-xs font-medium border-2 border-white shadow-sm">{getInitials(a.name)}</div>
                        <span className="font-medium text-[#0B4550] text-sm">{a.name}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-[#898A8D] text-sm font-medium">No one else has joined yet.</p>
                  )}
                </div>
              </div>
              {/* CANCEL BUTTON - Only shows if the client is actually in the attendees list */}
              {viewClassDetails.attendees?.some(a => a.client_id === clientData.id) && (
                <button
                  onClick={handleCancelBooking}
                  className="w-full mt-6 py-4 rounded-xl font-bold text-red-500 bg-red-50 border border-red-100 hover:bg-red-500 hover:text-white transition-colors"
                >
                  Cancel My Booking
                </button>
              )}

            </div>
          </div>
        )}

        {/* INVOICE DETAIL & PDF PRINT MODAL */}
        {isInvoiceOpen && selectedInvoice && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-[150] flex justify-center items-center p-4 overflow-y-auto" onClick={() => setIsInvoiceOpen(false)}>
            <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-4xl shadow-2xl relative animate-in zoom-in-95 duration-200 my-8 max-h-[90vh] overflow-y-auto no-scrollbar" onClick={e => e.stopPropagation()}>
              <button onClick={() => setIsInvoiceOpen(false)} className="absolute top-6 right-6 w-10 h-10 bg-[#F9F7F2] rounded-full flex items-center justify-center text-[#0B4550] hover:bg-gray-200 transition-colors print:hidden"><X size={20} /></button>

              <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-5 print:hidden">
                <div>
                  <h2 className="text-2xl font-bold text-[#0B4550]">Invoice Receipt</h2>
                  <p className="text-xs text-[#898A8D] font-bold mt-1">Review transaction details or download invoice as PDF.</p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="bg-[#0B4550] text-[#E6FF2B] hover:bg-[#E6FF2B] hover:text-[#0B4550] border border-transparent px-5 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-sm mr-12"
                >
                  <Printer size={16} /> Print / Save PDF
                </button>
              </div>

              <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                  body * {
                    visibility: hidden !important;
                  }
                  #printable-invoice-area, #printable-invoice-area * {
                    visibility: visible !important;
                  }
                  #printable-invoice-area {
                    position: absolute !important;
                    left: 0 !important;
                    top: 0 !important;
                    width: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    background: white !important;
                    color: black !important;
                  }
                  .print\\:hidden {
                    display: none !important;
                  }
                }
              `}} />

              <div id="printable-invoice-area" className="bg-white text-gray-800 font-sans leading-relaxed p-2">
                <div className="flex flex-col md:flex-row md:justify-between items-start gap-4 md:gap-0 mb-12">
                  <div>
                    <h1 className="text-3xl font-black text-[#0B4550] tracking-tight uppercase">TrackPoint App</h1>
                    <p className="text-xs text-gray-400 mt-1 font-bold tracking-widest uppercase">Premium Performance & Coaching Portal</p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-3xl font-extrabold text-[#0B4550] tracking-tight uppercase mb-2">Invoice</h2>
                    <div className="space-y-1 text-sm font-semibold text-gray-500">
                      <p>Invoice No: <span className="text-[#0B4550] font-bold">{selectedInvoice.invoiceNumber}</span></p>
                      <p>Date: {selectedInvoice.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                      <p>Payment Term: Paid in Full</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 border-t border-b border-gray-100 py-6 mb-8">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Bill To</h4>
                    <div className="text-sm font-semibold text-gray-700">
                      <p className="text-base font-extrabold text-[#0B4550]">{clientData.name || 'Client'}</p>
                      <p className="mt-1">Email: {clientData.email || 'N/A'}</p>
                      <p>Phone: {clientData.phone || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-end items-end text-right">
                    <div className="bg-[#F9F7F2] border border-gray-100 rounded-2xl p-4 w-full max-w-[280px]">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Amount Paid</span>
                      <span className="text-2xl font-black text-[#0B4550]">RM {parseFloat(selectedInvoice.amount || 0).toFixed(2)}</span>
                      <span className="text-xs text-gray-500 font-semibold block mt-1">Paid in full via {selectedInvoice.method || 'Cash'}</span>
                    </div>
                  </div>
                </div>

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
                        <p className="font-extrabold text-base text-[#0B4550]">{selectedInvoice.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Physical Training & Coaching Pack</p>
                      </td>
                      <td className="py-5 text-right font-bold">1</td>
                      <td className="py-5 text-right font-bold">RM {parseFloat(selectedInvoice.amount || 0).toFixed(2)}</td>
                      <td className="py-5 text-right pr-2 font-extrabold text-[#0B4550]">RM {parseFloat(selectedInvoice.amount || 0).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex justify-end">
                  <div className="w-full max-w-xs space-y-3 font-semibold text-sm text-gray-500">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-gray-700">RM {parseFloat(selectedInvoice.amount || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (0%)</span>
                      <span className="text-gray-700">RM 0.00</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-100 pt-3 text-base text-[#0B4550] font-bold">
                      <span>Total Paid</span>
                      <span>RM {parseFloat(selectedInvoice.amount || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-8 mt-12 text-center text-xs text-gray-400 font-bold uppercase tracking-widest">
                  Thank you for your business!
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}