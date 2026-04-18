
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Timer, Repeat, Dumbbell, Target, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ExerciseCard = ({ exercise, restPeriod, onPlayVideo, onSwap }) => {
  return (
    <Card className="h-full border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden rounded-2xl">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3 gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2">
              {exercise.name}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] uppercase font-bold tracking-wider hover:bg-slate-200">
                <Dumbbell className="w-3 h-3 mr-1" /> {exercise.equipment}
              </Badge>
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] uppercase font-bold tracking-wider hover:bg-slate-200">
                <Target className="w-3 h-3 mr-1" /> {exercise.muscleGroup}
              </Badge>
            </div>
          </div>
          
          <div className="flex gap-2 shrink-0">
            {onSwap && (
              <Button 
                onClick={() => onSwap(exercise)}
                size="icon"
                variant="outline"
                className="rounded-full w-10 h-10 bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                title="Swap for alternative exercise"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
            <Button 
              onClick={() => onPlayVideo(exercise)}
              size="icon"
              className="rounded-full w-10 h-10 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              title="Watch Demonstration"
            >
              <Play className="w-4 h-4 ml-0.5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2">
            <Repeat className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-sm font-semibold text-slate-700">
              {exercise.recommendedSetsReps || '3 sets x 10 reps'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-sm font-semibold text-slate-700">
              {restPeriod}s rest
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-600 line-clamp-2 mt-auto leading-relaxed">
          {exercise.formTips || exercise.description || 'Focus on form and controlled movements.'}
        </p>
      </div>
    </Card>
  );
};

export default ExerciseCard;
