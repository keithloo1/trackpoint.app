import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Target, CheckCircle2, ChevronRight, ChevronLeft, RotateCcw, Activity, AlertCircle, Loader2, Save, Calendar, Download, Coffee, PlayCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext.jsx';
import { jsPDF } from 'jspdf';

const GOAL_OPTIONS = [
  { value: 'Muscle Gain', label: 'Muscle Gain', desc: 'Build size and strength', reps: '8-12', sets: '3-4', rest: '90-120s', color: 'blue' },
  { value: 'Fat Loss', label: 'Fat Loss', desc: 'Burn calories and tone', reps: '10-15', sets: '3', rest: '60s', color: 'orange' },
  { value: 'Strength', label: 'Strength', desc: 'Maximize power output', reps: '4-6', sets: '4-5', rest: '120-180s', color: 'red' },
  { value: 'Endurance', label: 'Endurance', desc: 'Improve stamina', reps: '12-20', sets: '2-3', rest: '30-60s', color: 'green' }
];

const LEVEL_OPTIONS = [
  { value: 'Beginner', label: 'Beginner', desc: 'New to training', icon: '🌱' },
  { value: 'Intermediate', label: 'Intermediate', desc: '6+ months experience', icon: '💪' },
  { value: 'Advanced', label: 'Advanced', desc: '2+ years experience', icon: '🔥' }
];

const EQUIPMENT_OPTIONS = ["Bodyweight", "Dumbbell", "Barbell", "Kettlebell", "Cable", "Machine", "Resistance Band", "Medicine Ball", "Smith Machine", "TRX"];

const DURATION_OPTIONS = [4, 6, 8, 12];
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const SPLIT_TEMPLATES = {
  1: { name: 'Full Body Circuit', days: ['Full Body A'] },
  2: { name: 'Upper/Lower', days: ['Upper Body', 'Lower Body'] },
  3: { name: 'Full Body Split', days: ['Full Body A', 'Full Body B', 'Full Body C'] },
  4: { name: 'Upper/Lower Split', days: ['Upper Body', 'Lower Body', 'Upper Body', 'Lower Body'] },
  5: { name: 'Push/Pull/Legs/Upper/Lower', days: ['Push', 'Pull', 'Legs', 'Upper Body', 'Lower Body'] },
  6: { name: 'PPL x2', days: ['Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs'] },
  7: { name: 'Advanced Hybrid', days: ['Push', 'Pull', 'Legs', 'Upper Body', 'Lower Body', 'Full Body A', 'Full Body B'] }
};

const BODY_PART_MAPPING = {
  'Push': ['Chest', 'Shoulders', 'Triceps'],
  'Pull': ['Back', 'Biceps', 'Forearms'],
  'Legs': ['Quads', 'Hamstrings', 'Glutes', 'Calves'],
  'Lower Body': ['Quads', 'Hamstrings', 'Glutes', 'Calves'],
  'Upper Body': ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps'],
  'Full Body A': ['Chest', 'Back', 'Quads', 'Shoulders'],
  'Full Body B': ['Back', 'Chest', 'Hamstrings', 'Biceps'],
  'Full Body C': ['Shoulders', 'Back', 'Quads', 'Triceps']
};

// --- CURATED REALISTIC EXERCISE DATABASE ---
const generateExercisesDatabase = () => {
  const realisticMovements = [
    { name: "Bench Press", part: "Chest", eqs: ["Barbell", "Dumbbell", "Smith Machine"], mech: "Compound" },
    { name: "Incline Press", part: "Chest", eqs: ["Barbell", "Dumbbell", "Smith Machine", "Machine"], mech: "Compound" },
    { name: "Chest Fly", part: "Chest", eqs: ["Dumbbell", "Cable", "Machine"], mech: "Isolation" },
    { name: "Push-up", part: "Chest", eqs: ["Bodyweight"], mech: "Compound" },
    { name: "Pull-up", part: "Back", eqs: ["Bodyweight", "Machine", "Resistance Band"], mech: "Compound" },
    { name: "Lat Pulldown", part: "Back", eqs: ["Cable", "Machine"], mech: "Compound" },
    { name: "Row", part: "Back", eqs: ["Barbell", "Dumbbell", "Cable", "Machine", "Smith Machine", "TRX"], mech: "Compound" },
    { name: "Overhead Press", part: "Shoulders", eqs: ["Barbell", "Dumbbell", "Machine", "Smith Machine"], mech: "Compound" },
    { name: "Lateral Raise", part: "Shoulders", eqs: ["Dumbbell", "Cable", "Machine"], mech: "Isolation" },
    { name: "Front Raise", part: "Shoulders", eqs: ["Dumbbell", "Cable", "Weight Plate"], mech: "Isolation" },
    { name: "Face Pull", part: "Shoulders", eqs: ["Cable", "Resistance Band"], mech: "Isolation" },
    { name: "Bicep Curl", part: "Biceps", eqs: ["Barbell", "Dumbbell", "Cable", "Machine", "Resistance Band"], mech: "Isolation" },
    { name: "Hammer Curl", part: "Biceps", eqs: ["Dumbbell", "Cable"], mech: "Isolation" },
    { name: "Tricep Extension", part: "Triceps", eqs: ["Dumbbell", "Cable", "Machine"], mech: "Isolation" },
    { name: "Tricep Pushdown", part: "Triceps", eqs: ["Cable", "Resistance Band"], mech: "Isolation" },
    { name: "Dips", part: "Triceps", eqs: ["Bodyweight", "Machine"], mech: "Compound" },
    { name: "Squat", part: "Quads", eqs: ["Barbell", "Dumbbell", "Smith Machine", "Bodyweight", "Kettlebell"], mech: "Compound" },
    { name: "Leg Press", part: "Quads", eqs: ["Machine"], mech: "Compound" },
    { name: "Leg Extension", part: "Quads", eqs: ["Machine"], mech: "Isolation" },
    { name: "Lunge", part: "Quads", eqs: ["Dumbbell", "Barbell", "Bodyweight"], mech: "Compound" },
    { name: "Romanian Deadlift (RDL)", part: "Hamstrings", eqs: ["Barbell", "Dumbbell", "Smith Machine"], mech: "Compound" },
    { name: "Leg Curl", part: "Hamstrings", eqs: ["Machine", "Cable"], mech: "Isolation" },
    { name: "Hip Thrust", part: "Glutes", eqs: ["Barbell", "Machine", "Smith Machine", "Dumbbell"], mech: "Compound" },
    { name: "Glute Kickback", part: "Glutes", eqs: ["Cable", "Machine", "Resistance Band"], mech: "Isolation" },
    { name: "Calf Raise", part: "Calves", eqs: ["Machine", "Dumbbell", "Bodyweight", "Smith Machine"], mech: "Isolation" },
    { name: "Crunch", part: "Core", eqs: ["Bodyweight", "Machine", "Cable"], mech: "Isolation" },
    { name: "Plank", part: "Core", eqs: ["Bodyweight"], mech: "Isolation" },
    { name: "Russian Twist", part: "Core", eqs: ["Bodyweight", "Medicine Ball", "Dumbbell"], mech: "Isolation" }
  ];

  const exercises = [];
  let idCounter = 1;

  realisticMovements.forEach(mov => {
    mov.eqs.forEach(eq => {
      exercises.push({
        id: `ex_${idCounter++}`,
        name: `${eq} ${mov.name}`,
        bodyPart: mov.part,
        equipment: eq,
        mechanic: mov.mech,
        difficulty: eq === "Bodyweight" || eq === "Machine" ? "Beginner" : "Intermediate"
      });
    });
  });

  return exercises;
};
// ----------------------------------------------------------

const WorkoutBuilder = () => {
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);

  const [generatedProgram, setGeneratedProgram] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [allExercises, setAllExercises] = useState([]);
  const [loadingExercises, setLoadingExercises] = useState(true);

  useEffect(() => {
    try {
      const generatedDb = generateExercisesDatabase();
      setAllExercises(generatedDb);
    } catch (err) {
      toast.error('Failed to initialize exercise database');
    } finally {
      setLoadingExercises(false);
    }
  }, []);

  const toggleEquipment = (item) => {
    setSelectedEquipment(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const toggleDay = (day) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedGoal(null);
    setSelectedLevel(null);
    setSelectedEquipment([]);
    setSelectedDuration(null);
    setSelectedDays([]);
    setGeneratedProgram(null);
  };

  const selectExercisesForDay = (dayName, goalConfig, currentSelection = []) => {
    const targetBodyParts = BODY_PART_MAPPING[dayName] || [];
    const availableExercises = allExercises.filter(ex => {
      const bodyPartMatch = targetBodyParts.includes(ex.bodyPart);
      const equipmentMatch = selectedEquipment.includes(ex.equipment);
      return bodyPartMatch && equipmentMatch;
    });

    if (availableExercises.length === 0) return [];

    const compounds = availableExercises.filter(ex => ex.mechanic === 'Compound');
    const isolations = availableExercises.filter(ex => ex.mechanic === 'Isolation');
    const shuffleArray = (arr) => [...arr].sort(() => 0.5 - Math.random());

    const primaryCompounds = shuffleArray(compounds).slice(0, 2);
    const secondaryCompounds = shuffleArray(compounds.filter(ex => !primaryCompounds.includes(ex))).slice(0, 1);
    const isolationExercises = shuffleArray(isolations).slice(0, 3);

    const selectedExercises = [
      ...primaryCompounds.map(ex => ({ ...ex, category: 'Primary Lifts (Heavy)' })),
      ...secondaryCompounds.map(ex => ({ ...ex, category: 'Secondary Lifts' })),
      ...isolationExercises.map(ex => ({ ...ex, category: 'Isolation Focus' }))
    ];

    return selectedExercises.map(ex => ({
      ...ex,
      sets: goalConfig.sets,
      reps: goalConfig.reps,
      rest: goalConfig.rest
    }));
  };

  // --- SWAP / REFRESH EXERCISE LOGIC ---
  const swapExercise = (dayIndex, exerciseIndex) => {
    const programCopy = { ...generatedProgram };
    const day = programCopy.weeklySchedule[dayIndex];
    const currentEx = day.exercises[exerciseIndex];

    // Find all potential alternatives (same body part, matching equipment)
    const alternatives = allExercises.filter(ex =>
      ex.bodyPart === currentEx.bodyPart &&
      selectedEquipment.includes(ex.equipment) &&
      ex.id !== currentEx.id && // Don't pick the same one
      !day.exercises.some(existingEx => existingEx.id === ex.id) // Don't pick one already in today's workout
    );

    if (alternatives.length === 0) {
      toast.error(`No alternative ${currentEx.bodyPart} exercises available with your selected equipment.`);
      return;
    }

    // Pick a random alternative
    const newEx = alternatives[Math.floor(Math.random() * alternatives.length)];

    // Inject the new exercise while keeping the sets/reps/category intact
    day.exercises[exerciseIndex] = {
      ...newEx,
      sets: currentEx.sets,
      reps: currentEx.reps,
      rest: currentEx.rest,
      category: currentEx.category
    };

    setGeneratedProgram(programCopy);
    toast.success(`Swapped to ${newEx.name}`);
  };

  const generateProgram = useCallback(async () => {
    if (!selectedGoal || !selectedLevel || !selectedDuration || selectedDays.length === 0) return;

    setIsGenerating(true);
    setStep(5);
    setGeneratedProgram(null);

    setTimeout(() => {
      try {
        const goalConfig = GOAL_OPTIONS.find(g => g.value === selectedGoal);
        const numTrainingDays = selectedDays.length;
        const splitTemplate = SPLIT_TEMPLATES[numTrainingDays];

        if (!splitTemplate) {
          toast.error('Could not determine split for selected days.');
          setIsGenerating(false);
          return;
        }

        const weeklySchedule = [];
        let workoutIndex = 0;

        DAYS_OF_WEEK.forEach(dayName => {
          if (selectedDays.includes(dayName)) {
            const workoutDayName = splitTemplate.days[workoutIndex % splitTemplate.days.length];
            const exercises = selectExercisesForDay(workoutDayName, goalConfig);

            weeklySchedule.push({
              dayOfWeek: dayName,
              type: 'Workout',
              workoutTitle: workoutDayName,
              exercises
            });
            workoutIndex++;
          } else {
            weeklySchedule.push({
              dayOfWeek: dayName,
              type: 'Rest',
              workoutTitle: 'Active Recovery / Rest',
              exercises: []
            });
          }
        });

        setGeneratedProgram({
          goal: selectedGoal,
          level: selectedLevel,
          duration: selectedDuration,
          trainingDays: selectedDays,
          frequency: numTrainingDays,
          splitName: splitTemplate.name,
          weeklySchedule
        });

      } catch (error) {
        toast.error('Failed to generate program');
      } finally {
        setIsGenerating(false);
      }
    }, 800);
  }, [selectedGoal, selectedLevel, selectedEquipment, selectedDuration, selectedDays, allExercises]);

  const handleSaveProgram = async () => {
    if (!currentUser) {
      toast.error('Please log in to save programs');
      return;
    }
    if (!generatedProgram) return;

    try {
      setIsSaving(true);

      // We add isActive and startDate so your Dashboard can easily query this!
      await pb.collection('workout_programs').create({
        userId: currentUser.id,
        goal: generatedProgram.goal,
        level: generatedProgram.level,
        duration: generatedProgram.duration,
        frequency: generatedProgram.frequency,
        programData: generatedProgram,
        isActive: true, // Highlights this as their current main program
        startDate: new Date().toISOString()
      }, { $autoCancel: false });

      toast.success('Program saved! You can now view it on your Dashboard.');
    } catch (error) {
      toast.error('Failed to save program to database.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!generatedProgram) return;

    const doc = new jsPDF();
    let yPos = 20;

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(`${generatedProgram.splitName} Program`, 20, yPos);
    yPos += 10;

    // Subtitle
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`${generatedProgram.duration} Weeks | ${generatedProgram.goal} | Level: ${generatedProgram.level}`, 20, yPos);
    yPos += 15;

    // Schedule
    generatedProgram.weeklySchedule.forEach((day) => {
      // Check page break
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`${day.dayOfWeek}: ${day.workoutTitle}`, 20, yPos);
      yPos += 8;

      if (day.type === 'Rest') {
        doc.setFontSize(11);
        doc.setFont("helvetica", "italic");
        doc.text("Focus on hydration, stretching, and light activity.", 25, yPos);
        yPos += 10;
      } else {
        doc.setFontSize(11);
        day.exercises.forEach((ex, idx) => {
          if (yPos > 280) {
            doc.addPage();
            yPos = 20;
          }
          doc.setFont("helvetica", "bold");
          doc.text(`${idx + 1}. ${ex.name}`, 25, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(`${ex.sets} Sets × ${ex.reps} | Rest: ${ex.rest}`, 130, yPos);
          yPos += 7;
        });
        yPos += 5;
      }
    });

    // Save PDF
    doc.save(`${generatedProgram.splitName.replace(/\s+/g, '_')}_Schedule.pdf`);
    toast.success('PDF Downloaded Successfully');
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-10">
      <div className="flex items-center w-full max-w-3xl px-4">
        {[1, 2, 3, 4, 5].map((num, idx) => (
          <React.Fragment key={num}>
            <div className={`flex flex-col items-center relative ${step >= num ? 'text-primary' : 'text-slate-400'}`}>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm shrink-0 transition-all duration-300 ${step === num ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110' : step > num ? 'bg-primary text-primary-foreground' : 'bg-slate-100 text-slate-400'
                }`}>
                {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
              </div>
            </div>
            {idx < 4 && <div className={`flex-1 h-1.5 mx-2 rounded-full transition-colors duration-300 ${step > num ? 'bg-primary' : 'bg-slate-100'}`} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  if (loadingExercises) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-slate-500 font-medium">Initializing exercise library...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">Workout Program Builder</h2>
        <p className="text-slate-500 mt-3 text-lg text-balance max-w-2xl mx-auto">Create a structured {selectedDuration || 'multi'}-week training schedule mapped to your week.</p>
      </div>

      {renderStepIndicator()}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 md:p-10 min-h-[450px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                <div className="bg-primary/10 p-3 rounded-2xl text-primary"><Target className="w-7 h-7" /></div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Training Goal</h3>
                  <p className="text-base text-slate-500">What do you want to achieve?</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {GOAL_OPTIONS.map(opt => (
                  <div key={opt.value} onClick={() => setSelectedGoal(opt.value)} className={`cursor-pointer rounded-2xl border-2 p-6 transition-all duration-200 active:scale-[0.98] ${selectedGoal === opt.value ? 'border-primary bg-primary/5 shadow-md transform -translate-y-1' : 'border-slate-100 bg-slate-50 hover:border-slate-300 hover:bg-white hover:shadow-sm'}`}>
                    <h4 className={`text-xl font-bold mb-2 ${selectedGoal === opt.value ? 'text-primary' : 'text-slate-900'}`}>{opt.label}</h4>
                    <p className={`text-sm mb-4 ${selectedGoal === opt.value ? 'text-primary/80' : 'text-slate-500'}`}>{opt.desc}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <Badge variant="outline" className="bg-white">{opt.reps} reps</Badge>
                      <Badge variant="outline" className="bg-white">{opt.sets} sets</Badge>
                      <Badge variant="outline" className="bg-white">{opt.rest} rest</Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-8">
                <Button onClick={() => setStep(2)} disabled={!selectedGoal} className="h-14 px-8 text-base font-semibold shadow-sm rounded-xl">Next Step <ChevronRight className="w-5 h-5 ml-2" /></Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                <div className="bg-orange-100 p-3 rounded-2xl text-orange-600"><Activity className="w-7 h-7" /></div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Experience Level</h3>
                  <p className="text-base text-slate-500">How long have you been training?</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {LEVEL_OPTIONS.map(opt => (
                  <div key={opt.value} onClick={() => setSelectedLevel(opt.value)} className={`cursor-pointer rounded-2xl border-2 p-6 flex flex-col items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] ${selectedLevel === opt.value ? 'border-orange-500 bg-orange-50 shadow-md transform -translate-y-1' : 'border-slate-100 bg-slate-50 hover:border-slate-300 hover:bg-white hover:shadow-sm'}`}>
                    <span className="text-4xl">{opt.icon}</span>
                    <h4 className={`text-lg font-bold ${selectedLevel === opt.value ? 'text-orange-700' : 'text-slate-900'}`}>{opt.label}</h4>
                    <p className={`text-sm text-center ${selectedLevel === opt.value ? 'text-orange-600' : 'text-slate-500'}`}>{opt.desc}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-8">
                <Button variant="ghost" onClick={() => setStep(1)} className="h-14 px-6 text-slate-500 hover:text-slate-900 font-medium rounded-xl"><ChevronLeft className="w-5 h-5 mr-2" /> Back</Button>
                <Button onClick={() => setStep(3)} disabled={!selectedLevel} className="h-14 px-8 text-base font-semibold shadow-sm rounded-xl">Next Step <ChevronRight className="w-5 h-5 ml-2" /></Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                <div className="bg-blue-100 p-3 rounded-2xl text-blue-600"><Dumbbell className="w-7 h-7" /></div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Available Equipment</h3>
                  <p className="text-base text-slate-500">Select what you have access to.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {EQUIPMENT_OPTIONS.map(opt => (
                  <div key={opt} onClick={() => toggleEquipment(opt)} className={`cursor-pointer rounded-2xl border-2 p-5 flex flex-col items-center justify-center gap-4 transition-all duration-200 active:scale-[0.98] ${selectedEquipment.includes(opt) ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-slate-100/80'}`}>
                    <Checkbox checked={selectedEquipment.includes(opt)} onCheckedChange={() => toggleEquipment(opt)} className={`w-5 h-5 pointer-events-none ${selectedEquipment.includes(opt) ? 'data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500' : ''}`} />
                    <span className={`font-semibold text-center text-sm sm:text-base ${selectedEquipment.includes(opt) ? 'text-blue-700' : 'text-slate-600'}`}>{opt}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-8">
                <Button variant="ghost" onClick={() => setStep(2)} className="h-14 px-6 text-slate-500 hover:text-slate-900 font-medium rounded-xl"><ChevronLeft className="w-5 h-5 mr-2" /> Back</Button>
                <Button onClick={() => setStep(4)} disabled={selectedEquipment.length === 0} className="h-14 px-8 text-base font-semibold shadow-sm rounded-xl">Next Step <ChevronRight className="w-5 h-5 ml-2" /></Button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                <div className="bg-green-100 p-3 rounded-2xl text-green-600"><Calendar className="w-7 h-7" /></div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Program Schedule</h3>
                  <p className="text-base text-slate-500">Pick your duration and select your specific training days.</p>
                </div>
              </div>
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-4">Program Duration (weeks)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {DURATION_OPTIONS.map(weeks => (
                      <div key={weeks} onClick={() => setSelectedDuration(weeks)} className={`cursor-pointer rounded-2xl border-2 p-6 flex flex-col items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] ${selectedDuration === weeks ? 'border-green-500 bg-green-50 shadow-md' : 'border-slate-100 bg-slate-50 hover:border-slate-300 hover:bg-white'}`}>
                        <span className={`text-3xl font-extrabold ${selectedDuration === weeks ? 'text-green-600' : 'text-slate-700'}`}>{weeks}</span>
                        <span className={`text-xs font-bold uppercase tracking-wider ${selectedDuration === weeks ? 'text-green-500' : 'text-slate-400'}`}>Weeks</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-4">Select Your Training Days (Mon - Sun)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {DAYS_OF_WEEK.map(day => (
                      <Button key={day} onClick={() => toggleDay(day)} variant={selectedDays.includes(day) ? "default" : "outline"} className={`h-12 w-full justify-start px-4 font-semibold ${selectedDays.includes(day) ? "bg-green-600 hover:bg-green-700 text-white" : "border-slate-200 text-slate-600 hover:border-green-500"}`}>
                        {selectedDays.includes(day) && <CheckCircle2 className="w-4 h-4 mr-2" />}
                        {day}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-3 font-medium">You selected {selectedDays.length} day(s). We will automatically build a {selectedDays.length > 0 ? SPLIT_TEMPLATES[selectedDays.length]?.name || 'custom' : ''} program for you.</p>
                </div>
              </div>
              <div className="flex justify-between pt-8">
                <Button variant="ghost" onClick={() => setStep(3)} className="h-14 px-6 text-slate-500 hover:text-slate-900 font-medium rounded-xl"><ChevronLeft className="w-5 h-5 mr-2" /> Back</Button>
                <Button onClick={generateProgram} disabled={!selectedDuration || selectedDays.length === 0} className="h-14 px-8 text-base font-semibold shadow-sm rounded-xl bg-slate-900 hover:bg-slate-800 text-white">Generate Program <Activity className="w-5 h-5 ml-2" /></Button>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-8">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                  <Loader2 className="w-12 h-12 animate-spin text-primary mb-6" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Building Your Custom Week</h3>
                  <p>Cross-referencing exercises to build your perfect schedule...</p>
                </div>
              ) : generatedProgram ? (
                <>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 p-3 rounded-2xl text-green-600 shrink-0"><CheckCircle2 className="w-7 h-7" /></div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{generatedProgram.splitName} Schedule</h3>
                        <p className="text-base text-slate-500">{generatedProgram.duration} Weeks • {generatedProgram.frequency} Days/Week • {generatedProgram.goal}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" onClick={handleReset} className="h-10 border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl"><RotateCcw className="w-4 h-4 mr-2" /> Reset</Button>
                      <Button variant="outline" onClick={handleDownloadPDF} className="h-10 border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl"><Download className="w-4 h-4 mr-2" /> Download PDF</Button>
                      <Button onClick={handleSaveProgram} disabled={isSaving} className="h-10 rounded-xl bg-green-600 hover:bg-green-700 text-white">{isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save to Dashboard</Button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {generatedProgram.weeklySchedule.map((day, dayIdx) => (
                      <Card key={dayIdx} className={`overflow-hidden border-l-4 ${day.type === 'Rest' ? 'border-l-slate-300 opacity-75' : 'border-l-primary'}`}>
                        <CardHeader className={`${day.type === 'Rest' ? 'bg-slate-100/50' : 'bg-slate-50/50'} pb-4`}>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <span className="font-extrabold text-slate-800 w-24">{day.dayOfWeek}</span>
                            <span className="text-slate-400 font-normal">|</span>
                            {day.type === 'Rest' ? (
                              <span className="text-slate-500 font-medium flex items-center gap-2"><Coffee className="w-4 h-4" /> Active Recovery / Rest</span>
                            ) : (
                              <span className="text-primary font-bold">{day.workoutTitle}</span>
                            )}
                            {day.type === 'Workout' && <Badge variant="outline" className="ml-auto">{day.exercises.length} Exercises</Badge>}
                          </CardTitle>
                        </CardHeader>

                        {day.type === 'Workout' && (
                          <CardContent className="pt-6">
                            {day.exercises.length > 0 ? (
                              <div className="space-y-4">
                                {day.exercises.map((ex, exIdx) => (
                                  <div key={exIdx} className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 relative group">
                                    <div className="flex-1">
                                      <div className="flex items-start gap-2 mb-2">
                                        <h5 className="font-bold text-slate-900 text-lg leading-tight">{ex.name}</h5>
                                        <Badge variant="outline" className="text-xs shrink-0 bg-white">{ex.category}</Badge>
                                      </div>

                                      <a
                                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + ' exercise tutorial')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors mt-1 mb-3"
                                      >
                                        <PlayCircle className="w-4 h-4 mr-1.5" />
                                        Watch Tutorial
                                      </a>

                                      <div className="flex flex-wrap gap-2 text-xs mt-1">
                                        <Badge variant="secondary" className="bg-slate-200">{ex.bodyPart}</Badge>
                                        <Badge variant="secondary" className="bg-slate-200">{ex.equipment}</Badge>
                                      </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 mt-3 sm:mt-0">
                                      <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm flex-1 sm:flex-none text-center sm:text-right">
                                        <div className="text-sm font-extrabold text-slate-900">{ex.sets} Sets × {ex.reps}</div>
                                        <div className="text-xs font-medium text-slate-500 mt-1">{ex.rest} rest interval</div>
                                      </div>

                                      <Button
                                        onClick={() => swapExercise(dayIdx, exIdx)}
                                        variant="outline"
                                        size="sm"
                                        className="text-slate-500 hover:text-primary hover:bg-primary/10 transition-colors"
                                        title="Swap for a different exercise"
                                      >
                                        <RefreshCw className="w-4 h-4 mr-1" /> Swap
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-slate-500">
                                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                                <p className="text-sm">No exercises matched your exact equipment for this muscle group.</p>
                              </div>
                            )}
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                </>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WorkoutBuilder;