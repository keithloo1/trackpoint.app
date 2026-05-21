import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import {
  Home, Activity, Calendar, Layout, Settings, Search, Plus,
  Target, Flame, ChevronDown, X, Clock, MapPin, Scale, Users,
  Zap, Trophy, ChevronLeft, ChevronRight, Package, CheckCircle2, RefreshCw,
  Trash2, Dumbbell, PlayCircle, Timer, CalendarPlus, CalendarCheck,
  CreditCard, ShieldCheck, TrendingUp, Award, User, Bell, FileText, Camera, Loader2
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
const formatDbDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

  const dailyQuote = getDailyQuote(); // <--- PASTE IT RIGHT HERE!

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clientData, setClientData] = useState(null);

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

  const [settingsTab, setSettingsTab] = useState('profile');
  const [alerts, setAlerts] = useState({ workouts: true, messages: true, billing: false });
  const [tempProfileName, setTempProfileName] = useState('');
  const [tempProfileEmail, setTempProfileEmail] = useState('');
  const [tempProfilePhone, setTempProfilePhone] = useState('');

  const [step, setStep] = useState(1);
  const [selectedEquip, setSelectedEquip] = useState(["Bodyweight"]);
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [generatedWorkout, setGeneratedWorkout] = useState(null);

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
        const { data: realClient, error: clientErr } = await supabase.from('clients').select('*').eq('id', clientId).single();
        if (clientErr) throw new Error("Invalid Link.");
        if (!realClient) throw new Error("Client not found.");

        const ACTUAL_CLIENT_ID = realClient.id;
        const TRAINER_ID = realClient.trainer_id;

        const { data: profile } = await supabase.from('profiles').select('*').eq('id', TRAINER_ID).maybeSingle();
        const { data: metrics } = await supabase.from('client_metrics').select('*').eq('client_id', ACTUAL_CLIENT_ID).maybeSingle();
        const { data: weights } = await supabase.from('weight_logs').select('*').eq('client_id', ACTUAL_CLIENT_ID).order('created_at', { ascending: false });

        // FETCH TRANSACTIONS (The Ledger)
        const { data: transData } = await supabase.from('transactions')
          .select('*')
          .eq('client_id', ACTUAL_CLIENT_ID)
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

            // Add to upcoming if booked by this client
            if (isBookedByMe) clientUpcoming.push(fullSession);
            return fullSession;
          });
          setLiveSessions(formattedSessions);
          setUpcomingBookings(clientUpcoming);

          // COMBINE TRANSACTIONS AND BOOKINGS INTO HISTORY LEDGER
          const combined = [];

          // Add Transactions
          if (transData) {
            transData.forEach(t => {
              combined.push({
                id: `trans-${t.id}`,
                date: new Date(t.created_at),
                title: t.description || 'Manual Entry',
                type: t.amount > 0 ? 'purchase' : 'usage',
                amount: t.amount,
                method: t.payment_method,
                isTransaction: true
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

        setClientData({
          id: ACTUAL_CLIENT_ID,
          name: realClient.name || 'Client',
          email: realClient.email || '',
          phone: realClient.phone || '',
          unlimited: realClient.unlimited,
          trainer_id: realClient.trainer_id,
          usedSessions: metrics?.used_sessions || realClient.used_sessions || 0,
          totalSessions: metrics?.total_sessions || realClient.total_sessions || 10,
          remainingSessions: realClient.remaining_package || 0,
          startWeight: parseFloat(metrics?.start_weight) || 80,
          currentWeight: latestWeight,
          goalWeight: parseFloat(metrics?.goal_weight) || 62,
          weightHistory: formattedWeights.length > 0 ? formattedWeights : [{ date: "Today", weight: 68, feeling: '🙂' }],
          prs: [
            { exercise: "Barbell Squat", weight: "85 kg", reps: 5, date: "Apr 18" },
            { exercise: "Deadlift", weight: "100 kg", reps: 1, date: "Mar 30" }
          ]
        });

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

  const remainingSessions = clientData.totalSessions - clientData.usedSessions;
  const weightProgress = Math.max(0, Math.min(100, ((clientData.startWeight - clientData.currentWeight) / (clientData.startWeight - clientData.goalWeight)) * 100));

  // Filter live sessions for the specific date selected in the modal
  const filteredSessionsForDate = liveSessions.filter(s => {
    const sessionDate = new Date(s.date);
    return sessionDate.getDate() === selectedDate && sessionDate.getMonth() === currentMonth && sessionDate.getFullYear() === 2026;
  });

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
      time_slot: selectedLiveSession.time
    }]);

    if (error) {
      alert("Booking failed: " + error.message);
      return;
    }

    // 2. Deduct session IF they are not on an unlimited package
    if (!clientData.unlimited) {
      const newRemaining = clientData.remainingSessions - 1;
      const newUsed = clientData.usedSessions + 1;
      await supabase.from('clients').update({ remaining_package: newRemaining, used_sessions: newUsed }).eq('id', clientData.id);
      await supabase.from('client_metrics').update({ used_sessions: newUsed }).eq('client_id', clientData.id);
      setClientData(prev => ({ ...prev, remainingSessions: newRemaining, usedSessions: newUsed }));
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
    const { error: logError } = await supabase.from('weight_logs').insert([{ client_id: clientData.id, weight: tempWeight, feeling: tempFeeling }]);
    if (logError) return alert("Database Error (Logs): " + logError.message);

    const { error: metricError } = await supabase.from('client_metrics').update({ current_weight: tempWeight, goal_weight: tempGoal }).eq('client_id', clientData.id);
    if (metricError) return alert("Database Error (Metrics): " + metricError.message);

    const d = new Date(tempDate);
    const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    setClientData(prev => ({ ...prev, currentWeight: tempWeight, goalWeight: tempGoal, weightHistory: [{ date: formattedDate, weight: tempWeight, feeling: tempFeeling }, ...prev.weightHistory] }));
    setIsWeightModalOpen(false);
  };

  const saveSettings = async () => {
    await supabase.from('profiles').update({ full_name: tempProfileName, email: tempProfileEmail, phone: tempProfilePhone }).eq('id', clientData.id);
    setClientData(prev => ({ ...prev, name: tempProfileName, email: tempProfileEmail, phone: tempProfilePhone }));
    setIsSettingsOpen(false);
  };

  const finishWorkoutSession = async () => {
    await supabase.from('workouts').insert([{ client_id: clientData.id, duration_seconds: workoutTime, workout_data: generatedWorkout }]);
    alert(`Workout Saved! Total time: ${formatTime(workoutTime)}`);
    setIsTrackerOpen(false); setGeneratedWorkout(null); setStep(1); setSelectedMuscles([]); setWorkoutTime(0); setRestTime(0);
  };

  const closeBookingDrawer = () => { setIsBookingOpen(false); setTimeout(() => { setBookingStep('select'); setSelectedLiveSession(null); }, 300); };
  const openBookingDrawer = (date = null) => { if (date) setSelectedDate(date); setBookingStep('select'); setSelectedLiveSession(null); setIsBookingOpen(true); };
  const openWeightModal = () => { setTempWeight(clientData.currentWeight); setTempGoal(clientData.goalWeight); setTempFeeling('🙂'); setTempDate(localDateTime); setIsWeightModalOpen(true); };
  const openSettingsModal = () => { setTempProfileName(clientData.name); setTempProfileEmail(clientData.email); setTempProfilePhone(clientData.phone); setIsSettingsOpen(true); };

  const toggleSelection = (item, list, setList) => { if (list.includes(item)) setList(list.filter(i => i !== item)); else setList([...list, item]); };
  const generateWorkout = async () => {
    setIsGenerating(true);
    try {
      // 🤖 Call the AI Brain
      const { data, error } = await supabase.functions.invoke('generate-workout', {
        body: { 
          muscles: selectedMuscles,
          equipment: selectedEquip,
          clientName: clientData.name
        }
      });

      if (error) throw error;
      setGeneratedWorkout(data.workout);
      setStep(3);
    } catch (err) {
      console.error("AI Generation Failed, using local engine:", err);
      // Robust Fallback: Rule-based generation
      let newWorkout = [];
      selectedMuscles.forEach(muscle => {
        let possibleExercises = [];
        selectedEquip.forEach(eq => { if (EXERCISE_DB[muscle] && EXERCISE_DB[muscle][eq]) possibleExercises.push(...EXERCISE_DB[muscle][eq]); });
        if (possibleExercises.length === 0) possibleExercises.push(...(EXERCISE_DB[muscle]["Bodyweight"] || []));
        const shuffled = [...new Set(possibleExercises)].sort(() => 0.5 - Math.random()).slice(0, selectedMuscles.length === 1 ? 5 : 2);
        shuffled.forEach(ex => { if (!newWorkout.some(w => w.name === ex)) newWorkout.push({ muscle, name: ex, sets: [{ targetReps: 12, completed: false }, { targetReps: 10, completed: false }] }); });
      });
      if (newWorkout.length === 0) newWorkout.push({ muscle: "Core", name: "Plank", sets: [{ targetReps: "60s", completed: false }] });
      setGeneratedWorkout(newWorkout); 
      setStep(3);
    } finally {
      setIsGenerating(false);
    }
  };
  const shuffleExercise = (index) => {
    const targetMuscle = generatedWorkout[index].muscle;
    const newEx = EXERCISE_DB[targetMuscle]["Bodyweight"][Math.floor(Math.random() * EXERCISE_DB[targetMuscle]["Bodyweight"].length)];
    const updated = [...generatedWorkout]; updated[index] = { muscle: targetMuscle, name: newEx, sets: [{ targetReps: 12, completed: false }, { targetReps: 10, completed: false }] };
    setGeneratedWorkout(updated);
  };
  const toggleSetComplete = (exIndex, setIndex) => {
    const updated = [...generatedWorkout]; updated[exIndex].sets[setIndex].completed = !updated[exIndex].sets[setIndex].completed;
    setGeneratedWorkout(updated); if (updated[exIndex].sets[setIndex].completed) setRestTime(60); else setRestTime(0);
  };

  return (
    <div className="flex h-screen w-full bg-[#F9F7F2] font-sans text-[#0B4550] overflow-hidden p-3 md:p-4 lg:p-6 gap-4 md:gap-6 relative">

      {/* SIDEBAR - HIDDEN ON MOBILE */}
      <aside className="hidden lg:flex w-[88px] h-full flex-col justify-between shrink-0 relative z-40">
        <div className=" h-24 flex items-center justify-center -sm border border-gray-100">
          <img src={newLogo} alt="TP" className="h-50 w-auto" onError={(e) => e.target.style.display = 'none'} />
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
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center py-3 px-2 z-[50] shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
        <button onClick={() => setActiveNav('Home')} className={`flex flex-col items-center gap-1 ${activeNav === 'Home' ? 'text-[#0B4550]' : 'text-gray-400'}`}>
          <Home size={24} />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button onClick={() => setActiveNav('Progress')} className={`flex flex-col items-center gap-1 ${activeNav === 'Progress' ? 'text-[#0B4550]' : 'text-gray-400'}`}>
          <TrendingUp size={24} />
          <span className="text-[10px] font-medium">Progress</span>
        </button>
        <button onClick={() => setActiveNav('History')} className={`flex flex-col items-center gap-1 ${activeNav === 'History' ? 'text-[#0B4550]' : 'text-gray-400'}`}>
          <FileText size={24} />
          <span className="text-[10px] font-medium">History</span>
        </button>
        <button onClick={openSettingsModal} className={`flex flex-col items-center gap-1 ${isSettingsOpen ? 'text-[#0B4550]' : 'text-gray-400'}`}>
          <User size={24} />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </div>

      <main className="flex-1 h-full overflow-y-auto flex flex-col relative z-10 pb-20 lg:pb-0">
        <header className="flex justify-between items-center mb-8 px-2">
          <div>
            <h1 className="text-3xl md:text-5xl font-medium text-[#0B4550] mb-2 leading-tight">
              {activeNav === 'Progress' ? 'Your Progress' :
                activeNav === 'History' ? 'Activity Ledger' :
                  `${getGreeting()}, ${clientData.name.split(' ')[0]}!`}
            </h1>
            <p className="text-[#898A8D] font-medium text-base md:text-xl italic mt-1">{dailyQuote}</p>
            <p className="text-[#898A8D] font-medium text-lg">
            </p>
          </div>
          <button onClick={() => remainingSessions > 0 ? openBookingDrawer() : setIsTopUpOpen(true)} className="hidden sm:block bg-[#0B4550] text-[#E6FF2B] px-6 md:px-8 py-3.5 rounded-full font-medium shadow-md hover:scale-105 transition-all whitespace-nowrap">
            {remainingSessions > 0 ? "Book Session" : "Top Up to Book"}
          </button>
        </header>

        {activeNav === 'Home' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 flex-1 pb-4 animate-in fade-in duration-500">
            <div className="md:col-span-12 lg:col-span-7 bg-white rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-gray-100 relative overflow-hidden flex flex-col min-h-[300px]">
              <div className="flex justify-between items-start z-10 mb-2">
                <h3 className="font-medium text-2xl text-[#0B4550]">Package Status</h3>
                <button onClick={() => setIsTopUpOpen(true)} className="bg-[#F9F7F2] text-[#0B4550] px-4 py-2 rounded-xl font-medium text-sm hover:bg-[#E6FF2B] transition-colors border border-gray-100 shadow-sm flex items-center gap-2 relative z-20"><CreditCard size={16} /> Top Up</button>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#E6FF2B] rounded-full filter blur-3xl opacity-60 z-0 animate-pulse"></div>
              <div className="flex-1 flex items-end z-10 pb-4 w-full">
                <div className="space-y-4 w-full">
                  <LegendItem
                    color={(clientData.remaining_package || clientData.remainingSessions || 0) <= 0 ? "bg-red-400" : "bg-[#E6FF2B]"}
                    label="Remaining Sessions"
                    value={clientData.remaining_package || clientData.remainingSessions || 0}
                  />
                  <LegendItem
                    color="bg-[#0B4550]"
                    label="Completed Sessions"
                    value={clientData.usedSessions || 0}
                  />
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mt-4">
                    <div
                      className={`h-full transition-all duration-700 ${(clientData.remaining_package || clientData.remainingSessions || 0) <= 0 ? 'bg-red-400' : 'bg-[#0B4550]'}`}
                      style={{ width: `${((clientData.usedSessions || 0) / ((clientData.usedSessions || 0) + (clientData.remaining_package || clientData.remainingSessions || 0))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-6 lg:col-span-5 bg-[#0B4550] rounded-[2.5rem] p-6 md:p-8 shadow-sm text-white flex flex-col">
              <div className="flex justify-between items-center mb-8 text-white">
                <h3 className="font-medium text-2xl">Training Days</h3>
                <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full border border-white/20 text-sm">
                  <ChevronLeft size={16} className="cursor-pointer" onClick={() => setCurrentMonth(prev => Math.max(0, prev - 1))} />
                  <span className="font-medium w-12 text-center">{MONTHS[currentMonth].substring(0, 3)}</span>
                  <ChevronRight size={16} className="cursor-pointer" onClick={() => setCurrentMonth(prev => Math.min(11, prev + 1))} />
                </div>
              </div>
              <div className="grid grid-cols-7 text-center font-medium text-white/50 mb-4 uppercase text-[10px] tracking-widest"><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div><div>S</div></div>
              <div className="grid grid-cols-7 text-center font-medium text-lg gap-y-4">
                {[...Array(30)].map((_, i) => {
                  const dayNum = i + 1;
                  return (<div key={dayNum} onClick={() => openBookingDrawer(dayNum)} className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto cursor-pointer transition-all hover:bg-[#E6FF2B] hover:text-[#0B4550] ${dayNum === selectedDate ? 'bg-[#E6FF2B] text-[#0B4550] shadow-[0_0_15px_rgba(230,255,43,0.3)]' : ''}`}>{dayNum}</div>)
                })}
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

              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex-1 flex flex-col justify-center relative group cursor-pointer hover:border-[#0B4550] transition-all" onClick={openWeightModal}>
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

            <div className="md:col-span-12 lg:col-span-7 bg-[#0B4550] rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-[#0B4550] flex flex-col text-white relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10"><Calendar size={160} /></div>
              <h3 className="font-medium text-2xl mb-6 relative z-10">Next Upcoming Class</h3>

              {upcomingBookings.length === 0 ? (
                <div className="bg-white/10 p-6 rounded-3xl text-center border border-white/20 relative z-10">
                  <p className="text-white/80 font-medium">You have no upcoming classes.</p>
                </div>
              ) : (
                <div className="space-y-4 relative z-10">
                  {upcomingBookings.slice(0, 2).map(booking => (
                    <div key={booking.id} onClick={() => setViewClassDetails(booking)} className="bg-white text-[#0B4550] p-5 rounded-3xl shadow-sm flex justify-between items-center hover:scale-[1.02] transition-transform cursor-pointer">
                      <div>
                        <span className="inline-block px-3 py-1 rounded-lg bg-[#E6FF2B] text-[#0B4550] text-[10px] font-medium uppercase tracking-widest mb-2">{booking.type}</span>
                        <h4 className="text-xl font-medium mb-1">{booking.title}</h4>
                        <p className="text-[#898A8D] font-medium text-sm flex items-center gap-2"><Clock size={14} /> {formatDbDate(booking.date)} at {booking.time}</p>
                      </div>
                      <div className="text-right">
                        <div className="w-12 h-12 bg-[#F9F7F2] rounded-full flex items-center justify-center text-[#0B4550] shadow-sm ml-auto mb-1"><MapPin size={20} /></div>
                        <p className="text-[10px] font-medium text-[#898A8D] uppercase tracking-widest">{booking.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- ACTIVITY LEDGER VIEW --- */}
        {activeNav === 'History' && (
          <div className="flex-1 pb-4 animate-in fade-in duration-500 max-w-4xl mx-auto w-full">
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
                    <div key={item.id} className="flex items-center justify-between p-4 md:p-6 bg-[#F9F7F2] rounded-3xl border border-transparent hover:border-[#E6FF2B] transition-all group">
                      <div className="flex items-center gap-5">
                        <div className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-xl md:text-2xl shadow-sm transition-transform group-hover:scale-110 ${item.type === 'purchase' ? 'bg-emerald-50 text-emerald-500' :
                            item.type === 'usage' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'
                          }`}>
                          {item.type === 'purchase' ? <CreditCard size={24} /> :
                            item.type === 'usage' ? <Zap size={24} /> : <FileText size={24} />}
                        </div>
                        <div>
                          <p className="text-base md:text-lg font-bold text-[#0B4550]">{item.title}</p>
                          <p className="text-sm font-medium text-[#898A8D]">
                            {item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            {item.method && ` • ${item.method}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-black ${item.type === 'purchase' ? 'text-emerald-500' :
                            item.type === 'usage' ? 'text-rose-500' : 'text-[#0B4550]'
                          }`}>
                          {item.type === 'purchase' ? '+' : '-'}{Math.abs(item.amount)}
                        </p>
                        <p className="text-[10px] font-bold text-[#898A8D] uppercase tracking-widest">
                          {item.isTransaction ? 'Credits' : 'Session'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- PROGRESS & ANALYTICS VIEW --- */}
        {activeNav === 'Progress' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 flex-1 pb-4 animate-in fade-in duration-500">
            <div className="md:col-span-12 lg:col-span-8 flex flex-col h-full"><WeightLineChart data={clientData.weightHistory} startWeight={clientData.startWeight} /></div>
            <div className="md:col-span-12 lg:col-span-4 flex flex-col gap-4 md:gap-6">
              <div className="bg-[#0B4550] rounded-[2.5rem] p-8 shadow-sm flex-1 flex flex-col justify-center items-center text-center relative overflow-hidden group">
                <div className="absolute -right-8 -top-8 opacity-10 group-hover:scale-110 transition-transform duration-500"><Dumbbell size={160} className="text-white" /></div>
                <h3 className="font-medium text-6xl text-[#E6FF2B] mb-2 relative z-10">12.4<span className="text-3xl">k</span></h3>
                <p className="text-white/70 font-medium text-xs uppercase tracking-widest relative z-10">Total Volume Lifted (kg)</p>
              </div>
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex-1 flex flex-col justify-center items-center text-center">
                <h3 className="font-medium text-6xl text-[#0B4550] mb-2">42</h3>
                <p className="text-[#898A8D] font-medium text-xs uppercase tracking-widest">Workouts Completed</p>
              </div>
              <button onClick={openWeightModal} className="bg-[#E6FF2B] text-[#0B4550] py-6 rounded-[2.5rem] font-medium text-xl shadow-sm hover:scale-[1.02] transition-all flex items-center justify-center gap-2 border border-yellow-300"><Plus size={24} /> Log New Weight</button>
            </div>
            <div className="col-span-12 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 mt-2">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3"><div className="w-12 h-12 bg-[#F9F7F2] rounded-2xl flex items-center justify-center text-[#0B4550]"><Award size={24} /></div><h3 className="font-medium text-2xl text-[#0B4550]">Personal Records</h3></div>
                <button className="text-[#898A8D] font-medium hover:text-[#0B4550] text-sm">View All History</button>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {clientData.prs.map((pr, i) => (
                  <div key={i} className="bg-[#F9F7F2] p-6 rounded-[2rem] border border-gray-100 flex flex-col justify-between hover:border-[#E6FF2B] transition-all cursor-pointer">
                    <div className="mb-6"><p className="text-xs font-medium text-[#898A8D] uppercase tracking-widest mb-1">{pr.date}</p><h4 className="text-xl font-medium text-[#0B4550] leading-tight">{pr.exercise}</h4></div>
                    <div className="flex justify-between items-end"><span className="font-medium text-4xl text-[#0B4550]">{pr.weight}</span><span className="font-medium text-[#0B4550] bg-white px-3 py-1.5 rounded-xl text-xs uppercase tracking-widest shadow-sm border border-gray-100">{pr.reps} Rep Max</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS MODAL */}
        {isSettingsOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[115] transition-opacity" onClick={() => setIsSettingsOpen(false)} />}
        <div className={`fixed top-0 right-0 h-full w-[500px] bg-white z-[120] shadow-2xl transition-transform duration-500 ease-out p-10 flex flex-col ${isSettingsOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center mb-8"><h2 className="text-3xl font-medium text-[#0B4550]">Settings</h2><button onClick={() => setIsSettingsOpen(false)} className="w-10 h-10 rounded-full bg-[#F9F7F2] flex items-center justify-center text-[#0B4550] hover:bg-gray-200 transition-colors"><X size={20} /></button></div>
          <div className="flex gap-2 bg-[#F9F7F2] p-2 rounded-2xl mb-8">
            <button onClick={() => setSettingsTab('profile')} className={`flex-1 py-3 font-medium text-sm rounded-xl transition-all ${settingsTab === 'profile' ? 'bg-white shadow-sm text-[#0B4550]' : 'text-[#898A8D]'}`}>Profile</button>
            <button onClick={() => setSettingsTab('billing')} className={`flex-1 py-3 font-medium text-sm rounded-xl transition-all ${settingsTab === 'billing' ? 'bg-white shadow-sm text-[#0B4550]' : 'text-[#898A8D]'}`}>Billing</button>
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
            {settingsTab === 'billing' && (
              <div className="animate-in fade-in">
                <h3 className="font-medium text-[#0B4550] text-lg mb-4">Payment Method</h3>
                <div className="bg-gradient-to-tr from-[#0B4550] to-[#125c6a] p-6 rounded-3xl text-white shadow-xl mb-10 relative overflow-hidden"><Zap size={120} className="absolute -right-10 -bottom-10 opacity-10 text-[#E6FF2B]" /><div className="flex justify-between items-center mb-8 relative z-10"><CreditCard size={28} /><span className="font-medium tracking-widest uppercase text-xs opacity-70">Visa</span></div><div className="relative z-10"><p className="font-medium text-2xl tracking-[0.2em] mb-2">**** **** **** 4242</p><div className="flex justify-between text-sm font-medium opacity-70"><span>{clientData.name}</span><span>12/28</span></div></div></div>
                <h3 className="font-medium text-[#0B4550] text-lg mb-4">Past Invoices</h3>
                <div className="space-y-3">{PAST_INVOICES.map(inv => (<div key={inv.id} className="flex justify-between items-center p-4 bg-[#F9F7F2] rounded-2xl border border-gray-100 hover:border-[#0B4550] transition-colors cursor-pointer group"><div><p className="font-medium text-[#0B4550]">{inv.item}</p><p className="text-xs font-medium text-[#898A8D]">{inv.date} • {inv.id}</p></div><div className="flex items-center gap-4"><span className="font-medium text-[#0B4550]">{inv.amount}</span><div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#898A8D] group-hover:text-blue-500 shadow-sm"><FileText size={14} /></div></div></div>))}</div>
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
        {isBookingOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[115] transition-opacity" onClick={closeBookingDrawer} />}
        <div className={`fixed top-0 right-0 h-full w-[450px] bg-white z-[120] shadow-2xl transition-transform duration-500 ease-out p-10 flex flex-col ${isBookingOpen ? 'translate-x-0' : 'translate-x-full'}`}>
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
                  {[...Array(30)].map((_, i) => {
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

        {/* TOP UP MODAL */}
        {isTopUpOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] flex justify-center items-end sm:items-center p-0 sm:p-4">
            <div className="bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 w-full max-w-xl shadow-2xl relative animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto no-scrollbar">
              <button onClick={() => setIsTopUpOpen(false)} className="absolute top-6 right-6 w-10 h-10 bg-[#F9F7F2] rounded-full flex items-center justify-center text-[#0B4550] hover:bg-gray-200 transition-colors"><X size={20} /></button>

              <div className="text-center mb-8 mt-2">
                <div className="w-16 h-16 bg-[#0B4550] text-[#E6FF2B] rounded-full flex items-center justify-center mx-auto mb-4 shadow-md"><Package size={32} /></div>
                <h2 className="text-3xl font-extrabold text-[#0B4550]">Top Up Sessions</h2>
                <p className="text-[#898A8D] font-bold mt-2">Choose a package to continue booking classes.</p>
              </div>

              <div className="space-y-4">
                {packagesList.map(pkg => (
                  <div key={pkg.id} className="border-2 border-gray-100 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-center gap-6 hover:border-[#0B4550] transition-colors group bg-white">
                    <div className="flex-1 w-full text-center sm:text-left">
                      <span className="inline-block px-3 py-1 rounded-lg bg-[#F9F7F2] text-[#0B4550] text-[10px] font-extrabold uppercase tracking-widest mb-3">{pkg.type}</span>
                      <h3 className="text-xl font-extrabold text-[#0B4550] mb-1">{pkg.name}</h3>
                      <p className="text-[#898A8D] font-bold text-sm">Valid for {pkg.validity_days} days</p>
                    </div>

                    <div className="text-center sm:text-right w-full sm:w-auto">
                      <div className="flex items-baseline justify-center sm:justify-end gap-1 mb-3">
                        <span className="text-sm font-bold text-[#898A8D]">RM</span>
                        <span className="text-3xl font-black text-[#0B4550]">{pkg.price}</span>
                      </div>
                      <button
                        onClick={() => handlePurchasePackage(pkg)}
                        className="w-full sm:w-auto px-8 py-3 rounded-xl font-extrabold bg-[#0B4550] text-[#E6FF2B] hover:scale-105 transition-transform shadow-md"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* WORKOUT BUILDER MODAL */}
        {isBuilderOpen && (
          <div className="fixed inset-0 bg-[#F9F7F2] z-[100] flex flex-col animate-in zoom-in duration-300">
            <div className="bg-white px-10 py-6 border-b border-gray-100 flex items-center justify-between shadow-sm shrink-0"><div className="flex items-center gap-16 mx-auto w-full max-w-4xl"><StepIndicator num={1} label="Equipment" active={step >= 1} current={step === 1} /><div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-[#0B4550]' : 'bg-gray-100'}`}></div><StepIndicator num={2} label="Muscles" active={step >= 2} current={step === 2} /><div className={`flex-1 h-1 rounded-full ${step >= 3 ? 'bg-[#0B4550]' : 'bg-gray-100'}`}></div><StepIndicator num={3} label="Exercises" active={step === 3} current={step === 3} /></div><button onClick={() => { setIsBuilderOpen(false); setStep(1); }} className="absolute right-8 top-8 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#898A8D] hover:bg-red-50 hover:text-red-500 transition-colors"><X size={20} /></button></div>
            <div className="flex-1 overflow-y-auto p-8 flex justify-center">
              <div className="max-w-4xl w-full">
                {step === 1 && (<div className="animate-in slide-in-from-right-4"><div className="text-center mb-10"><h2 className="text-4xl font-medium text-[#0B4550] mb-2">Select Equipment</h2><p className="text-lg text-[#898A8D] font-medium">What are we working with?</p></div><div className="grid grid-cols-4 gap-4">{EQUIPMENT_OPTIONS.map(eq => (<div key={eq} onClick={() => toggleSelection(eq, selectedEquip, setSelectedEquip)} className={`bg-white p-6 rounded-[2rem] border-4 cursor-pointer transition-all flex flex-col items-center gap-3 ${selectedEquip.includes(eq) ? 'border-[#0B4550] shadow-lg' : 'border-transparent shadow-sm'}`}><Dumbbell size={48} className={selectedEquip.includes(eq) ? 'text-[#0B4550]' : 'text-gray-300'} /><span className={`font-medium text-sm ${selectedEquip.includes(eq) ? 'text-[#0B4550]' : 'text-[#898A8D]'}`}>{eq}</span></div>))}</div></div>)}
                {step === 2 && (<div className="animate-in slide-in-from-right-4"><div className="text-center mb-10"><h2 className="text-4xl font-medium text-[#0B4550] mb-2">Target Muscles</h2><p className="text-lg text-[#898A8D] font-medium">What are we hitting today?</p></div><div className="grid grid-cols-3 gap-6">{MUSCLE_OPTIONS.map(m => (<div key={m} onClick={() => toggleSelection(m, selectedMuscles, setSelectedMuscles)} className={`bg-white p-8 rounded-[2rem] border-4 cursor-pointer transition-all flex flex-col items-center gap-4 ${selectedMuscles.includes(m) ? 'border-[#0B4550] bg-[#0B4550] text-white shadow-xl' : 'border-transparent text-[#0B4550] shadow-sm'}`}><Target size={48} className={selectedMuscles.includes(m) ? 'text-[#E6FF2B]' : 'text-[#898A8D]'} /><span className="font-medium text-xl">{m}</span></div>))}</div></div>)}
                {step === 3 && generatedWorkout && (<div className="animate-in slide-in-from-right-4"><div className="text-center mb-10"><h2 className="text-4xl font-medium text-[#0B4550] mb-2">Workout Ready</h2><p className="text-lg text-[#898A8D] font-medium">Review and customize your session.</p></div><div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden"><div className="divide-y divide-gray-100">{generatedWorkout.map((ex, i) => (<div key={i} className="p-6 flex items-center gap-6 hover:bg-gray-50 transition-colors"><div className="w-14 h-14 bg-[#F9F7F2] rounded-2xl flex items-center justify-center font-medium text-[#0B4550] text-xl shrink-0">{ex.muscle.charAt(0)}</div><div className="flex-1"><h4 className="text-xl font-medium text-[#0B4550]">{ex.name}</h4><p className="text-sm font-medium text-[#898A8D] uppercase tracking-widest mt-1">{ex.muscle}</p></div><div className="flex items-center gap-3"><button onClick={() => shuffleExercise(i)} className="flex items-center gap-2 px-5 py-2.5 border-2 border-blue-100 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors text-sm"><RefreshCw size={16} /> Swap</button><button onClick={() => removeExercise(i)} className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"><Trash2 size={24} /></button></div></div>))}</div><div className="p-6 bg-gray-50 border-t border-gray-100"><button onClick={() => setStep(2)} className="flex items-center gap-2 text-[#0B4550] font-medium text-lg hover:underline"><Plus size={24} /> Add more exercises</button></div></div></div>)}
              </div>
            </div>
            <div className="bg-white p-6 border-t border-gray-100 flex justify-center shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
              <div className="max-w-4xl w-full flex justify-between items-center">
                <button onClick={() => step > 1 ? setStep(step - 1) : setIsBuilderOpen(false)} className="px-8 font-medium text-[#898A8D] flex items-center gap-2 hover:text-[#0B4550] transition-colors">
                  <ChevronLeft size={20} /> Previous
                </button>
                <button 
                  disabled={isGenerating || (step === 1 ? selectedEquip.length === 0 : step === 2 ? selectedMuscles.length === 0 : false)} 
                  onClick={() => { if (step === 2) generateWorkout(); else if (step === 3) setIsBuilderOpen(false); else setStep(step + 1); }} 
                  className="bg-[#E6FF2B] text-[#0B4550] px-16 py-4 rounded-full font-medium text-lg shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-3"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#0B4550]/20 border-t-[#0B4550] rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    step === 3 ? 'Save to Dashboard' : 'Continue'
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
                  <div key={exIdx} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm"><div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6"><div><p className="text-xs font-medium text-[#898A8D] uppercase tracking-widest mb-1">{ex.muscle}</p><h4 className="text-2xl font-medium text-[#0B4550]">{ex.name}</h4></div><div className="flex gap-2"><a href={`https://www.youtube.com/results?search_query=how+to+do+${ex.name.replace(/ /g, '+')}+exercise`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 bg-red-50 px-4 py-2 rounded-xl transition-colors"><PlayCircle size={18} /> Tutorial</a><button onClick={() => shuffleExercise(exIdx)} className="flex items-center gap-2 text-sm font-medium text-blue-500 hover:text-blue-600 bg-blue-50 px-4 py-2 rounded-xl transition-colors"><RefreshCw size={18} /> Swap</button></div></div><div className="flex flex-col gap-3"><div className="grid grid-cols-4 gap-4 px-4 pb-2 border-b border-gray-100 text-xs font-medium text-[#898A8D] uppercase tracking-widest text-center"><div>Set</div><div>Target</div><div>Weight (kg)</div><div>Done</div></div>{ex.sets.map((set, setIdx) => (<div key={setIdx} className={`grid grid-cols-4 gap-4 items-center p-3 rounded-2xl transition-all border ${set.completed ? 'bg-emerald-50 border-emerald-100 opacity-70' : 'bg-[#F9F7F2] border-transparent'}`}><div className="font-medium text-lg text-center text-[#0B4550]">{setIdx + 1}</div><div className="font-medium text-center text-[#898A8D]">{set.targetReps} Reps</div><div><input type="number" placeholder="-" className={`w-full p-2 rounded-xl text-center font-medium outline-none ${set.completed ? 'bg-transparent text-emerald-700' : 'bg-white text-[#0B4550] shadow-sm'}`} /></div><button onClick={() => toggleSetComplete(exIdx, setIdx)} className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center transition-all ${set.completed ? 'bg-emerald-500 text-white shadow-md scale-105' : 'bg-white text-gray-300 hover:text-emerald-500 shadow-sm'}`}><CheckCircle2 size={24} /></button></div>))}</div></div>
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
                        <div className="w-8 h-8 rounded-full bg-[#0B45  50] text-[#E6FF2B] flex items-center justify-center text-xs font-medium border-2 border-white shadow-sm">{getInitials(a.name)}</div>
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

      </main>
    </div>
  );
}