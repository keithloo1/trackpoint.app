import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 
import { 
  Home, Activity, Calendar, Layout, Settings, Search, Plus, 
  Target, Flame, ChevronDown, X, Clock, MapPin, Scale, Users, 
  Zap, Trophy, ChevronLeft, ChevronRight, CheckCircle2, RefreshCw, 
  Trash2, Dumbbell, PlayCircle, Timer, CalendarPlus, CalendarCheck,
  CreditCard, ShieldCheck, TrendingUp, Award, User, Bell, FileText, Camera, Loader2
} from 'lucide-react';
import dobermanLogo from '../assets/doberman.png';

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
  { id: "INV-2049", date: "Mar 01, 2026", item: "Starter Package", amount: "$400" }
];

const ACTIVE_USER_ID = '70c81ab4-97c5-46d6-ac9b-475486eaa274';

// --- HELPER FUNCTIONS ---
const formatTime = (totalSeconds) => {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const downloadICS = (date, month, timeStr) => {
  const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:TrackPoint PT Session\nDESCRIPTION:Personal Training Session with Emmanuel\nDTSTART:2026${(month + 1).toString().padStart(2, '0')}${date.toString().padStart(2, '0')}T090000Z\nDTEND:2026${(month + 1).toString().padStart(2, '0')}${date.toString().padStart(2, '0')}T100000Z\nEND:VEVENT\nEND:VCALENDAR`;
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
  <div className="flex items-center gap-4"><div className={`w-10 h-4 rounded-full ${color}`}></div><span className="text-[#898A8D] font-bold text-lg w-56">{label}</span><span className="text-[#0B4550] font-extrabold text-2xl">{value}</span></div>
);

const ActivityItem = ({ name, action, time, icon }) => (
  <div className="flex items-center justify-between p-4 bg-[#F9F7F2] rounded-2xl border border-transparent hover:border-[#E6FF2B] transition-all"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-xl">{icon}</div><div><p className="text-lg font-bold text-[#0B4550]"><span className="text-[#898A8D]">{name}</span> {action}</p><p className="text-sm font-medium text-[#898A8D]">{time}</p></div></div></div>
);

function StepIndicator({ num, label, active, current }) {
  return (
    <div className="flex flex-col items-center gap-2 relative">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-xl transition-all ${active ? 'bg-[#0B4550] text-[#E6FF2B]' : 'bg-[#F9F7F2] text-[#898A8D] border-2 border-gray-200'} ${current ? 'ring-4 ring-[#0B4550]/20' : ''}`}>
        {active && !current ? <CheckCircle2 size={24}/> : num}
      </div>
      <span className={`font-bold text-sm absolute -bottom-6 whitespace-nowrap ${current ? 'text-[#0B4550]' : 'text-[#898A8D]'}`}>{label}</span>
    </div>
  );
}

const Toggle = ({ active, onClick }) => (
  <div onClick={onClick} className={`w-12 h-6 rounded-full cursor-pointer flex items-center p-1 transition-colors ${active ? 'bg-[#0B4550]' : 'bg-gray-200'}`}>
    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${active ? 'translate-x-6' : 'translate-x-0'}`} />
  </div>
);

// --- UPDATED INTERACTIVE CHART WITH AXES ---
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
     const xc = (points[i][0] + points[i+1][0]) / 2;
     pathD += `C ${xc},${points[i][1]} ${xc},${points[i+1][1]} ${points[i+1][0]},${points[i+1][1]} `;
  }
  const areaD = `${pathD} L 100,105 L 0,105 Z`;
  const totalLost = startWeight - activeData.weight;

  return (
    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 flex-1 flex flex-col relative w-full h-full group">
       <div className="mb-8 relative z-20 pointer-events-none">
         <p className="text-[#898A8D] font-bold text-sm mb-1">Your weight</p>
         <div className="flex items-baseline gap-2">
           <h2 className="text-8xl font-extrabold text-[#0B4550] tracking-tighter transition-all duration-300">{activeData.weight}</h2>
           <span className="text-4xl font-extrabold text-[#0B4550]">kg</span>
         </div>
         {totalLost !== 0 && (
           <p className={`font-extrabold text-2xl mt-2 transition-all duration-300 ${totalLost > 0 ? 'text-[#10B981]' : 'text-red-500'}`}>
             {totalLost > 0 ? '↓' : '↑'} {Math.abs(totalLost).toFixed(1)} kg <span className="text-[#898A8D] text-base font-bold ml-1">vs start</span>
           </p>
         )}
       </div>

       {/* --- CHART AREA WITH AXES --- */}
       <div className="flex-1 w-full relative mt-auto min-h-[250px] flex pl-10 pb-8">
         
         {/* Y-Axis */}
         <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[#898A8D] font-bold text-[10px] pb-1 z-10 w-8 text-right pr-2">
            <span>{max.toFixed(0)}</span>
            <span>{((max + min) / 2).toFixed(0)}</span>
            <span>{min.toFixed(0)}</span>
         </div>

         {/* Horizontal Grid Lines */}
         <div className="absolute left-10 right-0 top-2 bottom-9 flex flex-col justify-between pointer-events-none z-0">
            <div className="w-full border-b border-gray-100/80"></div>
            <div className="w-full border-b border-gray-100/80"></div>
            <div className="w-full border-b border-gray-100/80"></div>
         </div>

         {/* X-Axis */}
         <div className="absolute left-10 right-0 bottom-0 flex justify-between text-[#898A8D] font-bold text-[10px] pt-3 z-10 border-t border-gray-100">
            <span>{chartData[0]?.date}</span>
            {chartData.length > 2 && <span>{chartData[Math.floor(chartData.length/2)]?.date}</span>}
            <span>{chartData[chartData.length-1]?.date}</span>
         </div>

         {/* SVG Container */}
         <div className="flex-1 relative w-full h-full z-10">
           <div className="absolute top-0 bottom-0 flex flex-col items-center pointer-events-none z-10 transition-all duration-200 ease-out" style={{ left: `${getX(activeIndex)}%`, transform: 'translateX(-50%)' }}>
              <div className="bg-white text-[#0B4550] text-xs font-extrabold px-3 py-1.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)] whitespace-nowrap mb-2 border border-gray-50 transition-all">{activeData.date}</div>
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
  const [isLoading, setIsLoading] = useState(true);
  const [clientData, setClientData] = useState(null);

  const [activeNav, setActiveNav] = useState('Home'); 
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [topUpStep, setTopUpStep] = useState('select'); 
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingStep, setBookingStep] = useState('select'); 
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); 
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [selectedSlot, setSelectedSlot] = useState(null);
  
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

  const availableSlots = ["09:00 AM", "10:30 AM", "02:00 PM", "04:30 PM"];

  // ==========================================
  // 1. SUPABASE FETCH ON LOAD
  // ==========================================
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: profile, error: profileErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', ACTIVE_USER_ID)
          .maybeSingle(); 

        if (profileErr) console.error("Profile Error:", profileErr);

        const { data: metrics, error: metricsErr } = await supabase
          .from('client_metrics')
          .select('*')
          .eq('client_id', ACTIVE_USER_ID)
          .maybeSingle();

        if (metricsErr) console.error("Metrics Error:", metricsErr);

        const { data: weights } = await supabase
          .from('weight_logs')
          .select('*')
          .eq('client_id', ACTIVE_USER_ID)
          .order('created_at', { ascending: false });

        const formattedWeights = weights ? weights.map(w => ({
          date: new Date(w.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          weight: parseFloat(w.weight),
          feeling: w.feeling
        })) : [];

        if (!profile) {
           console.warn("⚠️ No profile found in DB! Using fallback mock data.");
        }

        // Fix: Make sure currentWeight ALWAYS pulls the most recent log from the history
        const latestWeight = formattedWeights.length > 0 ? formattedWeights[0].weight : (parseFloat(metrics?.current_weight) || 68);

        setClientData({
          id: ACTIVE_USER_ID,
          name: profile?.full_name || 'Amanda',
          email: profile?.email || 'amanda@test.com',
          phone: profile?.phone || '+1 (555) 123-4567',
          usedSessions: metrics?.used_sessions || 6,
          totalSessions: metrics?.total_sessions || 10,
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // --- Timer Hooks ---
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

  if (isLoading || !clientData) {
    return (
      <div className="flex h-screen w-full bg-[#F9F7F2] items-center justify-center flex-col">
         <Loader2 size={48} className="text-[#0B4550] animate-spin mb-4" />
         <h2 className="text-2xl font-extrabold text-[#0B4550]">Connecting to Supabase...</h2>
      </div>
    );
  }

  const remainingSessions = clientData.totalSessions - clientData.usedSessions;
  const weightProgress = Math.max(0, Math.min(100, ((clientData.startWeight - clientData.currentWeight) / (clientData.startWeight - clientData.goalWeight)) * 100));

  // ==========================================
  // 2. SUPABASE WRITE HANDLERS 
  // ==========================================
  
  const handleConfirmBooking = async () => {
    if (remainingSessions > 0) {
      const newUsed = clientData.usedSessions + 1;
      
      await supabase.from('client_metrics').update({ used_sessions: newUsed }).eq('client_id', clientData.id);
      await supabase.from('bookings').insert([{
        client_id: clientData.id,
        session_date: `2026-${(currentMonth + 1).toString().padStart(2,'0')}-${selectedDate.toString().padStart(2,'0')}`,
        time_slot: selectedSlot
      }]);

      setClientData(prev => ({ ...prev, usedSessions: newUsed }));
      setBookingStep('success'); 
    } else {
      setIsBookingOpen(false);
      setIsTopUpOpen(true);
      setTopUpStep('select');
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
    const { error: logError } = await supabase.from('weight_logs').insert([
      { client_id: clientData.id, weight: tempWeight, feeling: tempFeeling }
    ]);
    
    if (logError) {
      alert("Database Error (Logs): " + logError.message);
      return; 
    }

    const { error: metricError } = await supabase.from('client_metrics')
      .update({ current_weight: tempWeight, goal_weight: tempGoal })
      .eq('client_id', clientData.id);

    if (metricError) {
      alert("Database Error (Metrics): " + metricError.message);
      return; 
    }

    const d = new Date(tempDate);
    const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const newHistory = [{ date: formattedDate, weight: tempWeight, feeling: tempFeeling }, ...clientData.weightHistory];
    
    setClientData(prev => ({ 
      ...prev, 
      currentWeight: tempWeight, 
      goalWeight: tempGoal,
      weightHistory: newHistory
    }));
    setIsWeightModalOpen(false);
  };

  const saveSettings = async () => {
    await supabase.from('profiles').update({
      full_name: tempProfileName, email: tempProfileEmail, phone: tempProfilePhone
    }).eq('id', clientData.id);

    setClientData(prev => ({ ...prev, name: tempProfileName, email: tempProfileEmail, phone: tempProfilePhone }));
    setIsSettingsOpen(false);
  };

  const finishWorkoutSession = async () => {
    await supabase.from('workouts').insert([{
      client_id: clientData.id, 
      duration_seconds: workoutTime, 
      workout_data: generatedWorkout
    }]);

    alert(`Workout Saved! Total time: ${formatTime(workoutTime)}`);
    setIsTrackerOpen(false); 
    setGeneratedWorkout(null); 
    setStep(1); 
    setSelectedMuscles([]); 
    setWorkoutTime(0); 
    setRestTime(0);
  };

  // --- General UI Handlers ---
  const closeBookingDrawer = () => { setIsBookingOpen(false); setTimeout(() => { setBookingStep('select'); setSelectedSlot(null); }, 300); };
  const openBookingDrawer = (date = null) => { if (date) setSelectedDate(date); setBookingStep('select'); setIsBookingOpen(true); };
  const openWeightModal = () => { setTempWeight(clientData.currentWeight); setTempGoal(clientData.goalWeight); setTempFeeling('🙂'); setTempDate(localDateTime); setIsWeightModalOpen(true); };
  const openSettingsModal = () => { setTempProfileName(clientData.name); setTempProfileEmail(clientData.email); setTempProfilePhone(clientData.phone); setIsSettingsOpen(true); };
  
  const toggleSelection = (item, list, setList) => { if (list.includes(item)) setList(list.filter(i => i !== item)); else setList([...list, item]); };
  const generateWorkout = () => { 
    let newWorkout = [];
    selectedMuscles.forEach(muscle => {
      let possibleExercises = [];
      selectedEquip.forEach(eq => { if (EXERCISE_DB[muscle] && EXERCISE_DB[muscle][eq]) possibleExercises.push(...EXERCISE_DB[muscle][eq]); });
      if (possibleExercises.length === 0) possibleExercises.push(...(EXERCISE_DB[muscle]["Bodyweight"] || []));
      const shuffled = [...new Set(possibleExercises)].sort(() => 0.5 - Math.random()).slice(0, selectedMuscles.length === 1 ? 5 : 2);
      shuffled.forEach(ex => { if (!newWorkout.some(w => w.name === ex)) newWorkout.push({ muscle, name: ex, sets: [{ targetReps: 12, completed: false }, { targetReps: 10, completed: false }] }); });
    });
    if (newWorkout.length === 0) newWorkout.push({ muscle: "Core", name: "Plank", sets: [{ targetReps: "60s", completed: false }] });
    setGeneratedWorkout(newWorkout); setStep(3);
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
    <div className="flex h-screen w-full bg-[#F9F7F2] font-sans text-[#0B4550] overflow-hidden p-4 lg:p-6 gap-6 relative">
      
      {/* SIDEBAR */}
      <aside className="w-[88px] h-full flex flex-col justify-between shrink-0 relative z-40">
        <div className="bg-white rounded-full h-24 flex items-center justify-center shadow-sm border border-gray-100">
          <img src={dobermanLogo} alt="TP" className="h-8 w-auto" onError={(e) => e.target.style.display = 'none'} />
        </div>
        <nav className="bg-white rounded-full py-6 flex flex-col items-center gap-4 shadow-sm border border-gray-100">
          <NavIcon icon={<Home size={24} />} isActive={activeNav === 'Home'} onClick={() => setActiveNav('Home')} />
          <NavIcon icon={<TrendingUp size={24} />} isActive={activeNav === 'Progress'} onClick={() => setActiveNav('Progress')} />
        </nav>
        <div onClick={openSettingsModal} className="bg-white rounded-full py-4 flex flex-col items-center shadow-sm border border-gray-100 cursor-pointer hover:border-[#0B4550] transition-colors group">
            <div className="w-12 h-12 rounded-full bg-[#0B4550] flex items-center justify-center text-[#E6FF2B] font-bold group-hover:scale-105 transition-transform">
              {clientData.name.charAt(0).toUpperCase()}
            </div>
        </div>
      </aside>

      <main className="flex-1 h-full overflow-y-auto flex flex-col relative z-10">
        <header className="flex justify-between items-center mb-8 px-2">
          <div>
            <h1 className="text-5xl font-extrabold text-[#0B4550] mb-2">{activeNav === 'Progress' ? 'Your Progress' : `${getGreeting()}, ${clientData.name.split(' ')[0]}!`}</h1>
            <p className="text-[#898A8D] font-bold text-lg">
               {activeNav === 'Progress' ? 'Track your gains and body composition.' : '“The only bad workout is the one that didn\'t happen.”'}
            </p>
          </div>
          <button onClick={() => remainingSessions > 0 ? openBookingDrawer() : setIsTopUpOpen(true)} className="bg-[#0B4550] text-[#E6FF2B] px-8 py-3.5 rounded-full font-bold shadow-md hover:scale-105 transition-all">
            {remainingSessions > 0 ? "Book Session" : "Top Up to Book"}
          </button>
        </header>

        {activeNav === 'Home' && (
          <div className="grid grid-cols-12 gap-6 flex-1 pb-4 animate-in fade-in duration-500">
            <div className="col-span-7 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden flex flex-col">
              <div className="flex justify-between items-start z-10 mb-2">
                 <h3 className="font-extrabold text-2xl text-[#0B4550]">Package Status</h3>
                 <button onClick={() => setIsTopUpOpen(true)} className="bg-[#F9F7F2] text-[#0B4550] px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#E6FF2B] transition-colors border border-gray-100 shadow-sm flex items-center gap-2 relative z-20"><CreditCard size={16}/> Top Up</button>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#E6FF2B] rounded-full filter blur-3xl opacity-60 z-0 animate-pulse"></div>
              <div className="flex-1 flex items-end z-10 pb-4 w-full">
                <div className="space-y-4 w-full">
                  <LegendItem color={remainingSessions === 0 ? "bg-red-400" : "bg-[#E6FF2B]"} label="Remaining Sessions" value={remainingSessions} />
                  <LegendItem color="bg-[#0B4550]" label="Completed Sessions" value={clientData.usedSessions} />
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mt-4">
                    <div className={`h-full transition-all duration-700 ${remainingSessions === 0 ? 'bg-red-400' : 'bg-[#0B4550]'}`} style={{width: `${(clientData.usedSessions / clientData.totalSessions) * 100}%`}}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-5 bg-[#0B4550] rounded-[2.5rem] p-8 shadow-sm text-white flex flex-col">
              <div className="flex justify-between items-center mb-8 text-white">
                <h3 className="font-extrabold text-2xl">Training Days</h3>
                <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full border border-white/20 text-sm">
                  <ChevronLeft size={16} className="cursor-pointer" onClick={() => setCurrentMonth(prev => Math.max(0, prev - 1))} />
                  <span className="font-bold w-12 text-center">{MONTHS[currentMonth].substring(0,3)}</span>
                  <ChevronRight size={16} className="cursor-pointer" onClick={() => setCurrentMonth(prev => Math.min(11, prev + 1))} />
                </div>
              </div>
              <div className="grid grid-cols-7 text-center font-bold text-white/50 mb-4 uppercase text-[10px] tracking-widest"><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div><div>S</div></div>
              <div className="grid grid-cols-7 text-center font-extrabold text-lg gap-y-4">
                {[...Array(30)].map((_, i) => {
                  const dayNum = i + 1;
                  return ( <div key={dayNum} onClick={() => openBookingDrawer(dayNum)} className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto cursor-pointer transition-all hover:bg-[#E6FF2B] hover:text-[#0B4550] ${dayNum === selectedDate ? 'bg-[#E6FF2B] text-[#0B4550] shadow-[0_0_15px_rgba(230,255,43,0.3)]' : ''}`}>{dayNum}</div> )
                })}
              </div>
            </div>

            <div className="col-span-5 flex flex-col gap-6">
               <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex-1 flex justify-between items-center">
                  <div>
                     <h3 className="font-extrabold text-2xl text-[#0B4550] mb-1">{generatedWorkout ? "Today's Plan" : "Workout Builder"}</h3>
                     <p className="text-[#898A8D] font-bold text-sm mb-4">{generatedWorkout ? "Ready to crush it?" : "Generate your session"}</p>
                     <div className="flex gap-2">
                       <button onClick={() => {if (generatedWorkout) setIsTrackerOpen(true); else { setStep(1); setIsBuilderOpen(true); }}} className="flex items-center gap-2 text-[#0B4550] font-bold bg-[#E6FF2B] px-5 py-2.5 rounded-full hover:scale-105 transition-all text-sm z-20 relative">{generatedWorkout ? "Start Workout" : "Start Building"} <Plus size={16} /></button>
                       {generatedWorkout && <button onClick={() => {setGeneratedWorkout(null); setStep(1); setIsBuilderOpen(true);}} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-50 hover:text-red-500 text-[#0B4550] transition-all z-20 relative"><RefreshCw size={16} /></button>}
                     </div>
                  </div>
                  <Zap size={40} className={generatedWorkout ? "text-[#E6FF2B]" : "text-[#F9F7F2]"} />
               </div>

               <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex-1 flex flex-col justify-center relative group cursor-pointer hover:border-[#0B4550] transition-all" onClick={openWeightModal}>
                  <div className="flex justify-between items-end mb-4">
                      <div><h3 className="font-extrabold text-xl text-[#0B4550]">Weight Tracker</h3><p className="text-[#898A8D] font-bold text-xs uppercase tracking-widest">{weightProgress.toFixed(0)}% to Goal</p></div>
                      <div className="text-right">
                          <span className="font-extrabold text-3xl text-[#0B4550] block">{clientData.currentWeight} kg</span>
                          {clientData.startWeight > clientData.currentWeight && <span className="text-xs font-bold text-emerald-500">-{ (clientData.startWeight - clientData.currentWeight).toFixed(1) } kg so far!</span>}
                      </div>
                  </div>
                  <div className="relative pt-2">
                      <div className="w-full h-3 bg-[#F9F7F2] rounded-full overflow-hidden"><div className="h-full bg-[#0B4550] transition-all duration-1000" style={{ width: `${weightProgress}%` }}></div></div>
                  </div>
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"><div className="bg-[#F9F7F2] p-2 rounded-xl text-[#0B4550]"><Plus size={18}/></div></div>
               </div>
            </div>
            
            <div className="col-span-7 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col">
              <h3 className="font-extrabold text-2xl text-[#0B4550] mb-6">Activity Board</h3>
              <div className="space-y-4">
                 <ActivityItem name="Marcus" action="crushed a Leg Day" time="1h ago" icon="🏋️" />
                 <ActivityItem name="Sarah" action="logged 5k Run" time="3h ago" icon="🏃‍♀️" />
                 <ActivityItem name="James" action="hit a new Bench PR!" time="5h ago" icon="🔥" />
              </div>
            </div>
          </div>
        )}

        {/* --- PROGRESS & ANALYTICS VIEW --- */}
        {activeNav === 'Progress' && (
          <div className="grid grid-cols-12 gap-6 flex-1 pb-4 animate-in fade-in duration-500">
             <div className="col-span-8 flex flex-col h-full"><WeightLineChart data={clientData.weightHistory} startWeight={clientData.startWeight} /></div>
             <div className="col-span-4 flex flex-col gap-6">
                <div className="bg-[#0B4550] rounded-[2.5rem] p-8 shadow-sm flex-1 flex flex-col justify-center items-center text-center relative overflow-hidden group">
                   <div className="absolute -right-8 -top-8 opacity-10 group-hover:scale-110 transition-transform duration-500"><Dumbbell size={160} className="text-white" /></div>
                   <h3 className="font-extrabold text-6xl text-[#E6FF2B] mb-2 relative z-10">12.4<span className="text-3xl">k</span></h3>
                   <p className="text-white/70 font-bold text-xs uppercase tracking-widest relative z-10">Total Volume Lifted (kg)</p>
                </div>
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex-1 flex flex-col justify-center items-center text-center">
                   <h3 className="font-extrabold text-6xl text-[#0B4550] mb-2">42</h3>
                   <p className="text-[#898A8D] font-bold text-xs uppercase tracking-widest">Workouts Completed</p>
                </div>
                <button onClick={openWeightModal} className="bg-[#E6FF2B] text-[#0B4550] py-6 rounded-[2.5rem] font-extrabold text-xl shadow-sm hover:scale-[1.02] transition-all flex items-center justify-center gap-2 border border-yellow-300"><Plus size={24} /> Log New Weight</button>
             </div>
             <div className="col-span-12 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 mt-2">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3"><div className="w-12 h-12 bg-[#F9F7F2] rounded-2xl flex items-center justify-center text-[#0B4550]"><Award size={24} /></div><h3 className="font-extrabold text-2xl text-[#0B4550]">Personal Records</h3></div>
                  <button className="text-[#898A8D] font-bold hover:text-[#0B4550] text-sm">View All History</button>
                </div>
                <div className="grid grid-cols-3 gap-6">
                   {clientData.prs.map((pr, i) => (
                     <div key={i} className="bg-[#F9F7F2] p-6 rounded-[2rem] border border-gray-100 flex flex-col justify-between hover:border-[#E6FF2B] transition-all cursor-pointer">
                        <div className="mb-6"><p className="text-xs font-bold text-[#898A8D] uppercase tracking-widest mb-1">{pr.date}</p><h4 className="text-xl font-extrabold text-[#0B4550] leading-tight">{pr.exercise}</h4></div>
                        <div className="flex justify-between items-end"><span className="font-extrabold text-4xl text-[#0B4550]">{pr.weight}</span><span className="font-bold text-[#0B4550] bg-white px-3 py-1.5 rounded-xl text-xs uppercase tracking-widest shadow-sm border border-gray-100">{pr.reps} Rep Max</span></div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* SETTINGS MODAL */}
        {isSettingsOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[115] transition-opacity" onClick={() => setIsSettingsOpen(false)} />}
        <div className={`fixed top-0 right-0 h-full w-[500px] bg-white z-[120] shadow-2xl transition-transform duration-500 ease-out p-10 flex flex-col ${isSettingsOpen ? 'translate-x-0' : 'translate-x-full'}`}>
           <div className="flex justify-between items-center mb-8"><h2 className="text-3xl font-extrabold text-[#0B4550]">Settings</h2><button onClick={() => setIsSettingsOpen(false)} className="w-10 h-10 rounded-full bg-[#F9F7F2] flex items-center justify-center text-[#0B4550] hover:bg-gray-200 transition-colors"><X size={20}/></button></div>
           <div className="flex gap-2 bg-[#F9F7F2] p-2 rounded-2xl mb-8">
             <button onClick={() => setSettingsTab('profile')} className={`flex-1 py-3 font-bold text-sm rounded-xl transition-all ${settingsTab === 'profile' ? 'bg-white shadow-sm text-[#0B4550]' : 'text-[#898A8D]'}`}>Profile</button>
             <button onClick={() => setSettingsTab('billing')} className={`flex-1 py-3 font-bold text-sm rounded-xl transition-all ${settingsTab === 'billing' ? 'bg-white shadow-sm text-[#0B4550]' : 'text-[#898A8D]'}`}>Billing</button>
             <button onClick={() => setSettingsTab('alerts')} className={`flex-1 py-3 font-bold text-sm rounded-xl transition-all ${settingsTab === 'alerts' ? 'bg-white shadow-sm text-[#0B4550]' : 'text-[#898A8D]'}`}>Alerts</button>
           </div>
           <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
              {settingsTab === 'profile' && (
                <div className="animate-in fade-in">
                   <div className="flex flex-col items-center mb-10">
                      <div className="w-28 h-28 bg-[#0B4550] rounded-full flex items-center justify-center text-white text-3xl font-extrabold mb-4 relative group cursor-pointer shadow-lg">{clientData.name.charAt(0).toUpperCase()}<div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera size={28} className="text-white" /></div></div>
                      <button className="text-sm font-bold text-blue-500 hover:underline">Change Picture</button>
                   </div>
                   <div className="space-y-5">
                      <div><label className="text-[#898A8D] font-bold text-xs uppercase tracking-widest mb-2 block">Full Name</label><input type="text" value={tempProfileName} onChange={(e) => setTempProfileName(e.target.value)} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-xl p-4 font-bold text-[#0B4550] outline-none focus:border-[#0B4550] transition-colors" /></div>
                      <div><label className="text-[#898A8D] font-bold text-xs uppercase tracking-widest mb-2 block">Email Address</label><input type="email" value={tempProfileEmail} onChange={(e) => setTempProfileEmail(e.target.value)} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-xl p-4 font-bold text-[#0B4550] outline-none focus:border-[#0B4550] transition-colors" /></div>
                      <div><label className="text-[#898A8D] font-bold text-xs uppercase tracking-widest mb-2 block">Phone Number</label><input type="tel" value={tempProfilePhone} onChange={(e) => setTempProfilePhone(e.target.value)} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-xl p-4 font-bold text-[#0B4550] outline-none focus:border-[#0B4550] transition-colors" /></div>
                   </div>
                </div>
              )}
              {settingsTab === 'billing' && (
                <div className="animate-in fade-in">
                   <h3 className="font-extrabold text-[#0B4550] text-lg mb-4">Payment Method</h3>
                   <div className="bg-gradient-to-tr from-[#0B4550] to-[#125c6a] p-6 rounded-3xl text-white shadow-xl mb-10 relative overflow-hidden"><Zap size={120} className="absolute -right-10 -bottom-10 opacity-10 text-[#E6FF2B]" /><div className="flex justify-between items-center mb-8 relative z-10"><CreditCard size={28} /><span className="font-bold tracking-widest uppercase text-xs opacity-70">Visa</span></div><div className="relative z-10"><p className="font-extrabold text-2xl tracking-[0.2em] mb-2">**** **** **** 4242</p><div className="flex justify-between text-sm font-bold opacity-70"><span>{clientData.name}</span><span>12/28</span></div></div></div>
                   <h3 className="font-extrabold text-[#0B4550] text-lg mb-4">Past Invoices</h3>
                   <div className="space-y-3">{PAST_INVOICES.map(inv => (<div key={inv.id} className="flex justify-between items-center p-4 bg-[#F9F7F2] rounded-2xl border border-gray-100 hover:border-[#0B4550] transition-colors cursor-pointer group"><div><p className="font-bold text-[#0B4550]">{inv.item}</p><p className="text-xs font-bold text-[#898A8D]">{inv.date} • {inv.id}</p></div><div className="flex items-center gap-4"><span className="font-extrabold text-[#0B4550]">{inv.amount}</span><div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#898A8D] group-hover:text-blue-500 shadow-sm"><FileText size={14}/></div></div></div>))}</div>
                </div>
              )}
              {settingsTab === 'alerts' && (
                <div className="animate-in fade-in space-y-6">
                   <div className="flex justify-between items-center p-5 bg-[#F9F7F2] rounded-2xl border border-gray-100"><div><p className="font-bold text-[#0B4550]">Workout Reminders</p><p className="text-xs font-bold text-[#898A8D]">Push notifications 1 hour before session.</p></div><Toggle active={alerts.workouts} onClick={() => setAlerts(prev => ({...prev, workouts: !prev.workouts}))} /></div>
                   <div className="flex justify-between items-center p-5 bg-[#F9F7F2] rounded-2xl border border-gray-100"><div><p className="font-bold text-[#0B4550]">Trainer Messages</p><p className="text-xs font-bold text-[#898A8D]">Emails and push alerts from Emmanuel.</p></div><Toggle active={alerts.messages} onClick={() => setAlerts(prev => ({...prev, messages: !prev.messages}))} /></div>
                   <div className="flex justify-between items-center p-5 bg-[#F9F7F2] rounded-2xl border border-gray-100"><div><p className="font-bold text-[#0B4550]">Billing Alerts</p><p className="text-xs font-bold text-[#898A8D]">Notify me when sessions are low.</p></div><Toggle active={alerts.billing} onClick={() => setAlerts(prev => ({...prev, billing: !prev.billing}))} /></div>
                </div>
              )}
           </div>
           <button onClick={() => settingsTab === 'profile' ? saveSettings() : setIsSettingsOpen(false)} className="mt-auto w-full py-5 rounded-[2rem] font-extrabold text-xl bg-[#E6FF2B] text-[#0B4550] shadow-lg transition-all hover:scale-[1.02] shrink-0">{settingsTab === 'profile' ? 'Save Changes' : 'Done'}</button>
        </div>

        {/* WEIGHT MODAL */}
        {isWeightModalOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[115] transition-opacity" onClick={() => setIsWeightModalOpen(false)} />}
        <div className={`fixed top-0 right-0 h-full w-[400px] bg-white z-[120] shadow-2xl transition-transform duration-500 ease-out p-10 flex flex-col ${isWeightModalOpen ? 'translate-x-0' : 'translate-x-full'}`}>
           <div className="flex justify-between items-center mb-6"><h2 className="text-3xl font-extrabold text-[#0B4550]">Log Weight</h2><button onClick={() => setIsWeightModalOpen(false)} className="w-10 h-10 rounded-full bg-[#F9F7F2] flex items-center justify-center text-[#0B4550] hover:bg-gray-200 transition-colors"><X size={20}/></button></div>
           <div className="bg-blue-50 text-blue-600 px-4 py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm mb-8 border border-blue-100"><Clock size={16} /> History remains strictly private.</div>
           <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 pb-10">
              <div><label className="text-[#898A8D] font-bold text-xs uppercase tracking-widest mb-3 block">Date & Time</label><input type="datetime-local" value={tempDate} onChange={(e) => setTempDate(e.target.value)} className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl p-4 font-bold text-[#0B4550] outline-none focus:border-[#0B4550] transition-colors" /></div>
              <div className="bg-[#0B4550] p-8 rounded-[2rem] text-center relative overflow-hidden shadow-lg"><Scale size={64} className="mx-auto mb-2 text-white/10 absolute -right-4 -bottom-4 w-40 h-40 pointer-events-none" /><div className="relative z-10"><p className="text-white/60 font-bold text-xs uppercase tracking-widest mb-4">Current Entry</p><div className="flex items-center justify-center gap-4"><button onClick={() => setTempWeight(w => +(w - 0.5).toFixed(1))} className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center font-extrabold text-3xl text-white hover:bg-white/20 transition-colors">-</button><div className="flex items-baseline gap-1"><input type="number" value={tempWeight} onChange={(e) => setTempWeight(Number(e.target.value))} className="w-24 text-center font-extrabold text-5xl bg-transparent outline-none text-white p-0" step="0.1" /><span className="text-white/60 font-bold text-xl">kg</span></div><button onClick={() => setTempWeight(w => +(w + 0.5).toFixed(1))} className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center font-extrabold text-3xl text-white hover:bg-white/20 transition-colors">+</button></div></div></div>
              <div><label className="text-[#898A8D] font-bold text-xs uppercase tracking-widest mb-3 block">How are you feeling?</label><div className="flex justify-between items-center bg-[#F9F7F2] p-2 rounded-2xl border border-gray-100">{['😫', '🥱', '🙂', '💪', '🔥'].map(emoji => (<button key={emoji} onClick={() => setTempFeeling(emoji)} className={`w-14 h-14 rounded-xl text-3xl flex items-center justify-center transition-all ${tempFeeling === emoji ? 'bg-white shadow-sm scale-110' : 'hover:bg-white/50 grayscale opacity-50'}`}>{emoji}</button>))}</div></div>
              <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl"><label className="text-[#898A8D] font-bold text-xs uppercase tracking-widest mb-3 block flex items-center gap-2"><Settings size={14}/> Settings</label><div className="flex justify-between items-center"><span className="text-sm font-bold text-[#0B4550]">Update Goal Weight:</span><div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 w-32"><button onClick={() => setTempGoal(g => +(g - 0.5).toFixed(1))} className="w-8 h-8 flex items-center justify-center text-[#898A8D] hover:bg-gray-100 rounded-md font-bold">-</button><input type="number" value={tempGoal} onChange={(e) => setTempGoal(Number(e.target.value))} className="flex-1 text-center font-bold text-sm outline-none text-[#0B4550]" step="0.1" /><button onClick={() => setTempGoal(g => +(g + 0.5).toFixed(1))} className="w-8 h-8 flex items-center justify-center text-[#898A8D] hover:bg-gray-100 rounded-md font-bold">+</button></div></div></div>
           </div>
           <button onClick={saveWeightProgress} className="mt-auto w-full py-5 rounded-[2rem] font-extrabold text-xl bg-[#E6FF2B] text-[#0B4550] shadow-lg transition-all hover:scale-[1.02] shrink-0">Log Entry</button>
        </div>

        {/* BOOKING MODAL */}
        {isBookingOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[115] transition-opacity" onClick={closeBookingDrawer} />}
        <div className={`fixed top-0 right-0 h-full w-[450px] bg-white z-[120] shadow-2xl transition-transform duration-500 ease-out p-10 flex flex-col ${isBookingOpen ? 'translate-x-0' : 'translate-x-full'}`}>
           <div className="flex justify-between items-center mb-10"><h2 className="text-3xl font-extrabold text-[#0B4550]">Book Session</h2><button onClick={closeBookingDrawer} className="w-10 h-10 rounded-full bg-[#F9F7F2] flex items-center justify-center text-[#0B4550] hover:bg-gray-200 transition-colors"><X size={20}/></button></div>
           {bookingStep === 'select' ? (
             <>
               <div className="bg-[#F9F7F2] p-6 rounded-[2rem] mb-8 shadow-sm border border-gray-100"><div className="flex justify-between items-center mb-6"><button onClick={() => setCurrentMonth(prev => Math.max(0, prev - 1))} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#0B4550] shadow-sm hover:scale-105"><ChevronLeft size={16}/></button><h3 className="font-extrabold text-[#0B4550] text-xl">{MONTHS[currentMonth]} 2026</h3><button onClick={() => setCurrentMonth(prev => Math.min(11, prev + 1))} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#0B4550] shadow-sm hover:scale-105"><ChevronRight size={16}/></button></div><div className="grid grid-cols-7 text-center text-[#898A8D] font-bold text-[10px] uppercase tracking-widest mb-3"><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div><div>S</div></div><div className="grid grid-cols-7 gap-y-2 text-center">{[...Array(30)].map((_, i) => { const d = i + 1; return ( <div key={d} onClick={() => setSelectedDate(d)} className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center cursor-pointer font-extrabold text-sm transition-all ${selectedDate === d ? 'bg-[#0B4550] text-[#E6FF2B] shadow-md scale-110' : 'text-[#0B4550] hover:bg-gray-200'}`}>{d}</div> ) })}</div></div>
               <div className="mb-10"><p className="text-[#898A8D] font-bold text-xs uppercase tracking-widest mb-4">Select Time Slot</p><div className="grid grid-cols-2 gap-3 text-[#0B4550]">{availableSlots.map(s => <button key={s} onClick={() => setSelectedSlot(s)} className={`py-4 rounded-2xl font-bold border-2 transition-all ${selectedSlot === s ? 'bg-[#0B4550] text-[#E6FF2B] border-[#0B4550] shadow-md' : 'bg-white border-gray-100 hover:border-[#0B4550]'}`}>{s}</button>)}</div></div>
               <div className="mt-auto bg-[#F9F7F2] p-5 rounded-2xl mb-4 flex justify-between items-center border border-gray-100"><span className="font-bold text-[#0B4550] text-sm">Package Deduction</span><span className="font-extrabold text-red-500">-1 Session</span></div>
               <button disabled={!selectedSlot} onClick={handleConfirmBooking} className="w-full py-5 rounded-[2rem] font-extrabold text-xl bg-[#E6FF2B] text-[#0B4550] shadow-lg disabled:opacity-50 transition-all hover:scale-[1.02]">Confirm Booking</button>
             </>
           ) : (
             <div className="flex flex-col items-center justify-center flex-1 animate-in zoom-in duration-500 text-center"><div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-sm"><CalendarCheck size={48} /></div><h2 className="text-3xl font-extrabold text-[#0B4550] mb-2">Session Confirmed!</h2><p className="text-[#898A8D] font-bold mb-8">Emmanuel has been notified.</p><div className="bg-[#F9F7F2] w-full p-6 rounded-3xl border border-gray-100 mb-8"><p className="text-xs font-bold text-[#898A8D] uppercase tracking-widest mb-1">Date & Time</p><h3 className="text-xl font-extrabold text-[#0B4550]">{MONTHS[currentMonth]} {selectedDate}, 2026</h3><h3 className="text-xl font-extrabold text-[#0B4550]">{selectedSlot}</h3></div><button onClick={() => downloadICS(selectedDate, currentMonth, selectedSlot)} className="w-full bg-[#0B4550] text-[#E6FF2B] py-5 rounded-[2rem] font-extrabold text-xl shadow-lg flex items-center justify-center gap-3 hover:scale-105 transition-all mb-4"><CalendarPlus size={24} /> Add to Calendar</button><button onClick={closeBookingDrawer} className="font-bold text-[#898A8D] hover:text-[#0B4550] transition-colors">Close</button></div>
           )}
        </div>

        {/* STORE MODAL */}
        {isTopUpOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[115] transition-opacity" onClick={() => setIsTopUpOpen(false)} />}
        <div className={`fixed top-0 right-0 h-full w-[500px] bg-white z-[120] shadow-2xl transition-transform duration-500 ease-out p-10 flex flex-col ${isTopUpOpen ? 'translate-x-0' : 'translate-x-full'}`}>
           <div className="flex justify-between items-center mb-10"><h2 className="text-3xl font-extrabold text-[#0B4550]">Store</h2><button onClick={() => setIsTopUpOpen(false)} className="w-10 h-10 rounded-full bg-[#F9F7F2] flex items-center justify-center text-[#0B4550] hover:bg-gray-200 transition-colors"><X size={20}/></button></div>
           {topUpStep === 'select' && (
             <div className="animate-in slide-in-from-right-4 flex-1 flex flex-col">
               <p className="text-[#898A8D] font-bold text-lg mb-6">Choose a package to top up your account.</p>
               <div className="space-y-4">
                 {STORE_PACKAGES.map(pkg => (
                   <div key={pkg.id} onClick={() => setSelectedPackage(pkg)} className={`p-6 rounded-3xl border-2 cursor-pointer transition-all relative ${selectedPackage?.id === pkg.id ? 'bg-[#0B4550] border-[#0B4550] text-white shadow-xl scale-[1.02]' : 'bg-white border-gray-200 text-[#0B4550] hover:border-[#0B4550]'}`}>
                     {pkg.popular && <span className="absolute -top-3 left-6 bg-[#E6FF2B] text-[#0B4550] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border-2 border-white">Most Popular</span>}
                     <div className="flex justify-between items-center"><div><h4 className="text-xl font-extrabold">{pkg.name}</h4><p className={selectedPackage?.id === pkg.id ? 'text-white/70 font-bold' : 'text-[#898A8D] font-bold'}>{pkg.sessions} Sessions</p></div><span className="text-3xl font-extrabold">${pkg.price}</span></div>
                   </div>
                 ))}
               </div>
               <button disabled={!selectedPackage} onClick={() => setTopUpStep('checkout')} className="mt-auto w-full py-5 rounded-[2rem] font-extrabold text-xl bg-[#E6FF2B] text-[#0B4550] shadow-lg disabled:opacity-50 transition-all hover:scale-[1.02]">Proceed to Checkout</button>
             </div>
           )}
           {topUpStep === 'checkout' && selectedPackage && (
             <div className="animate-in slide-in-from-right-4 flex-1 flex flex-col">
               <div className="bg-[#F9F7F2] p-6 rounded-3xl mb-8 border border-gray-100"><div className="flex justify-between items-center mb-2"><span className="text-[#898A8D] font-bold">Package:</span><span className="font-extrabold text-[#0B4550]">{selectedPackage.name} ({selectedPackage.sessions}x)</span></div><div className="flex justify-between items-center"><span className="text-[#898A8D] font-bold">Total:</span><span className="font-extrabold text-2xl text-[#0B4550]">${selectedPackage.price}.00</span></div></div>
               <div className="space-y-4 mb-8">
                 <div className="bg-white p-4 rounded-2xl border border-gray-200"><span className="block text-[10px] font-bold text-[#898A8D] uppercase mb-1 tracking-widest">Cardholder Name</span><input type="text" placeholder={`${clientData.name} Smith`} className="w-full font-bold text-[#0B4550] outline-none" /></div>
                 <div className="bg-white p-4 rounded-2xl border border-gray-200 flex items-center"><div className="flex-1"><span className="block text-[10px] font-bold text-[#898A8D] uppercase mb-1 tracking-widest">Card Number</span><input type="text" placeholder="4242 4242 4242 4242" className="w-full font-bold text-[#0B4550] outline-none" /></div><CreditCard className="text-gray-300" /></div>
                 <div className="flex gap-4"><div className="bg-white p-4 rounded-2xl border border-gray-200 flex-1"><span className="block text-[10px] font-bold text-[#898A8D] uppercase mb-1 tracking-widest">Expiry</span><input type="text" placeholder="MM/YY" className="w-full font-bold text-[#0B4550] outline-none" /></div><div className="bg-white p-4 rounded-2xl border border-gray-200 flex-1"><span className="block text-[10px] font-bold text-[#898A8D] uppercase mb-1 tracking-widest">CVC</span><input type="text" placeholder="123" className="w-full font-bold text-[#0B4550] outline-none" /></div></div>
               </div>
               <div className="mt-auto flex flex-col gap-4">
                 <button onClick={handlePayment} className="w-full py-5 rounded-[2rem] font-extrabold text-xl bg-[#0B4550] text-[#E6FF2B] shadow-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-all"><ShieldCheck size={24} /> Pay ${selectedPackage.price}</button>
                 <button onClick={() => setTopUpStep('select')} className="font-bold text-[#898A8D] hover:text-[#0B4550] transition-colors">Back</button>
               </div>
             </div>
           )}
           {topUpStep === 'success' && (
             <div className="flex flex-col items-center justify-center flex-1 animate-in zoom-in duration-500 text-center"><div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-sm"><CheckCircle2 size={48} /></div><h2 className="text-3xl font-extrabold text-[#0B4550] mb-2">Payment Successful!</h2><p className="text-[#898A8D] font-bold mb-8">{selectedPackage.sessions} sessions have been added to your account.</p><button onClick={() => {setIsTopUpOpen(false); setTimeout(() => setTopUpStep('select'), 300);}} className="w-full bg-[#E6FF2B] text-[#0B4550] py-5 rounded-[2rem] font-extrabold text-xl shadow-lg hover:scale-105 transition-all">Back to Dashboard</button></div>
           )}
        </div>

        {/* WORKOUT BUILDER MODAL */}
        {isBuilderOpen && (
          <div className="fixed inset-0 bg-[#F9F7F2] z-[100] flex flex-col animate-in zoom-in duration-300">
             <div className="bg-white px-10 py-6 border-b border-gray-100 flex items-center justify-between shadow-sm shrink-0"><div className="flex items-center gap-16 mx-auto w-full max-w-4xl"><StepIndicator num={1} label="Equipment" active={step >= 1} current={step === 1} /><div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-[#0B4550]' : 'bg-gray-100'}`}></div><StepIndicator num={2} label="Muscles" active={step >= 2} current={step === 2} /><div className={`flex-1 h-1 rounded-full ${step >= 3 ? 'bg-[#0B4550]' : 'bg-gray-100'}`}></div><StepIndicator num={3} label="Exercises" active={step === 3} current={step === 3} /></div><button onClick={() => {setIsBuilderOpen(false); setStep(1);}} className="absolute right-8 top-8 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#898A8D] hover:bg-red-50 hover:text-red-500 transition-colors"><X size={20}/></button></div>
             <div className="flex-1 overflow-y-auto p-8 flex justify-center">
                <div className="max-w-4xl w-full">
                   {step === 1 && (<div className="animate-in slide-in-from-right-4"><div className="text-center mb-10"><h2 className="text-4xl font-extrabold text-[#0B4550] mb-2">Select Equipment</h2><p className="text-lg text-[#898A8D] font-bold">What are we working with?</p></div><div className="grid grid-cols-4 gap-4">{EQUIPMENT_OPTIONS.map(eq => (<div key={eq} onClick={() => toggleSelection(eq, selectedEquip, setSelectedEquip)} className={`bg-white p-6 rounded-[2rem] border-4 cursor-pointer transition-all flex flex-col items-center gap-3 ${selectedEquip.includes(eq) ? 'border-[#0B4550] shadow-lg' : 'border-transparent shadow-sm'}`}><Dumbbell size={48} className={selectedEquip.includes(eq) ? 'text-[#0B4550]' : 'text-gray-300'} /><span className={`font-bold text-sm ${selectedEquip.includes(eq) ? 'text-[#0B4550]' : 'text-[#898A8D]'}`}>{eq}</span></div>))}</div></div>)}
                   {step === 2 && (<div className="animate-in slide-in-from-right-4"><div className="text-center mb-10"><h2 className="text-4xl font-extrabold text-[#0B4550] mb-2">Target Muscles</h2><p className="text-lg text-[#898A8D] font-bold">What are we hitting today?</p></div><div className="grid grid-cols-3 gap-6">{MUSCLE_OPTIONS.map(m => (<div key={m} onClick={() => toggleSelection(m, selectedMuscles, setSelectedMuscles)} className={`bg-white p-8 rounded-[2rem] border-4 cursor-pointer transition-all flex flex-col items-center gap-4 ${selectedMuscles.includes(m) ? 'border-[#0B4550] bg-[#0B4550] text-white shadow-xl' : 'border-transparent text-[#0B4550] shadow-sm'}`}><Target size={48} className={selectedMuscles.includes(m) ? 'text-[#E6FF2B]' : 'text-[#898A8D]'} /><span className="font-extrabold text-xl">{m}</span></div>))}</div></div>)}
                   {step === 3 && generatedWorkout && (<div className="animate-in slide-in-from-right-4"><div className="text-center mb-10"><h2 className="text-4xl font-extrabold text-[#0B4550] mb-2">Workout Ready</h2><p className="text-lg text-[#898A8D] font-bold">Review and customize your session.</p></div><div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden"><div className="divide-y divide-gray-100">{generatedWorkout.map((ex, i) => (<div key={i} className="p-6 flex items-center gap-6 hover:bg-gray-50 transition-colors"><div className="w-14 h-14 bg-[#F9F7F2] rounded-2xl flex items-center justify-center font-extrabold text-[#0B4550] text-xl shrink-0">{ex.muscle.charAt(0)}</div><div className="flex-1"><h4 className="text-xl font-extrabold text-[#0B4550]">{ex.name}</h4><p className="text-sm font-bold text-[#898A8D] uppercase tracking-widest mt-1">{ex.muscle}</p></div><div className="flex items-center gap-3"><button onClick={() => shuffleExercise(i)} className="flex items-center gap-2 px-5 py-2.5 border-2 border-blue-100 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors text-sm"><RefreshCw size={16}/> Swap</button><button onClick={() => removeExercise(i)} className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"><Trash2 size={24}/></button></div></div>))}</div><div className="p-6 bg-gray-50 border-t border-gray-100"><button onClick={() => setStep(2)} className="flex items-center gap-2 text-[#0B4550] font-extrabold text-lg hover:underline"><Plus size={24}/> Add more exercises</button></div></div></div>)}
                </div>
             </div>
             <div className="bg-white p-6 border-t border-gray-100 flex justify-center shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]"><div className="max-w-4xl w-full flex justify-between items-center"><button onClick={() => step > 1 ? setStep(step - 1) : setIsBuilderOpen(false)} className="px-8 font-bold text-[#898A8D] flex items-center gap-2 hover:text-[#0B4550] transition-colors"><ChevronLeft size={20}/> Previous</button><button disabled={step === 1 ? selectedEquip.length === 0 : step === 2 ? selectedMuscles.length === 0 : false} onClick={() => { if (step === 2) generateWorkout(); else if (step === 3) setIsBuilderOpen(false); else setStep(step + 1); }} className="bg-[#E6FF2B] text-[#0B4550] px-16 py-4 rounded-full font-extrabold text-lg shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100">{step === 3 ? 'Save to Dashboard' : 'Continue'}</button></div></div>
          </div>
        )}

        {/* ACTIVE TRACKER MODAL */}
        {isTrackerOpen && generatedWorkout && (
          <div className="fixed inset-0 bg-[#F9F7F2] z-[110] flex flex-col animate-in slide-in-from-right duration-500">
             <header className="bg-white px-8 py-5 border-b border-gray-100 flex justify-between items-center sticky top-0 z-10 shadow-sm shrink-0"><div><h2 className="text-3xl font-extrabold text-[#0B4550]">Active Session</h2><div className="flex items-center gap-4 mt-1"><span className="text-[#898A8D] font-bold">Targeting: {selectedMuscles.join(", ")}</span><span className="flex items-center gap-1.5 text-[#0B4550] font-extrabold bg-[#E6FF2B] px-3 py-1 rounded-lg text-sm shadow-sm"><Timer size={16} /> {formatTime(workoutTime)}</span></div></div><div className="flex items-center gap-6">{restTime > 0 && <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-5 py-2.5 rounded-2xl font-extrabold animate-pulse border border-blue-100 shadow-sm"><Clock size={20} /> Rest: {formatTime(restTime)}</div>}<button onClick={() => setIsTrackerOpen(false)} className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-[#898A8D] hover:bg-red-50 hover:text-red-500 transition-colors"><X size={24}/></button></div></header>
             <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto space-y-8 pb-20">
                   {generatedWorkout.map((ex, exIdx) => (
                     <div key={exIdx} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm"><div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6"><div><p className="text-xs font-bold text-[#898A8D] uppercase tracking-widest mb-1">{ex.muscle}</p><h4 className="text-2xl font-extrabold text-[#0B4550]">{ex.name}</h4></div><div className="flex gap-2"><a href={`https://www.youtube.com/results?search_query=how+to+do+${ex.name.replace(/ /g, '+')}+exercise`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 bg-red-50 px-4 py-2 rounded-xl transition-colors"><PlayCircle size={18} /> Tutorial</a><button onClick={() => shuffleExercise(exIdx)} className="flex items-center gap-2 text-sm font-bold text-blue-500 hover:text-blue-600 bg-blue-50 px-4 py-2 rounded-xl transition-colors"><RefreshCw size={18}/> Swap</button></div></div><div className="flex flex-col gap-3"><div className="grid grid-cols-4 gap-4 px-4 pb-2 border-b border-gray-100 text-xs font-bold text-[#898A8D] uppercase tracking-widest text-center"><div>Set</div><div>Target</div><div>Weight (kg)</div><div>Done</div></div>{ex.sets.map((set, setIdx) => (<div key={setIdx} className={`grid grid-cols-4 gap-4 items-center p-3 rounded-2xl transition-all border ${set.completed ? 'bg-emerald-50 border-emerald-100 opacity-70' : 'bg-[#F9F7F2] border-transparent'}`}><div className="font-extrabold text-lg text-center text-[#0B4550]">{setIdx + 1}</div><div className="font-bold text-center text-[#898A8D]">{set.targetReps} Reps</div><div><input type="number" placeholder="-" className={`w-full p-2 rounded-xl text-center font-extrabold outline-none ${set.completed ? 'bg-transparent text-emerald-700' : 'bg-white text-[#0B4550] shadow-sm'}`} /></div><button onClick={() => toggleSetComplete(exIdx, setIdx)} className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center transition-all ${set.completed ? 'bg-emerald-500 text-white shadow-md scale-105' : 'bg-white text-gray-300 hover:text-emerald-500 shadow-sm'}`}><CheckCircle2 size={24}/></button></div>))}</div></div>
                   ))}
                   <button onClick={finishWorkoutSession} className="w-full bg-[#0B4550] text-[#E6FF2B] py-6 rounded-[2.5rem] font-extrabold text-2xl shadow-xl transition-all hover:scale-[1.02]">Finish & Save Workout</button>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}