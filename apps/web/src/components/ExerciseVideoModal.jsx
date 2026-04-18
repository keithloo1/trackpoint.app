
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PlayCircle, Info, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ExerciseVideoModal = ({ isOpen, onClose, exercise }) => {
  if (!exercise) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden gap-0 rounded-2xl">
        {exercise.videoUrl ? (
          <div className="w-full bg-black aspect-video relative">
            <video 
              src={exercise.videoUrl} 
              controls 
              autoPlay
              controlsList="nodownload"
              className="w-full h-full object-cover"
              poster=""
            />
          </div>
        ) : (
          <div className="w-full bg-slate-100 aspect-video flex flex-col items-center justify-center text-slate-400">
            <PlayCircle className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm font-medium">Video preview unavailable</p>
          </div>
        )}
        
        <div className="p-6 space-y-4">
          <DialogHeader className="p-0 text-left space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 font-medium">
                {exercise.equipment}
              </Badge>
              <Badge variant="outline" className="text-slate-600 font-medium">
                {exercise.muscleGroup}
              </Badge>
            </div>
            <DialogTitle className="text-2xl font-bold text-slate-900">{exercise.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {exercise.description && (
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-1">Description</h4>
                  <DialogDescription className="text-slate-600 text-sm leading-relaxed">
                    {exercise.description}
                  </DialogDescription>
                </div>
              </div>
            )}

            {exercise.formTips && (
              <div className="flex gap-3 bg-orange-50 p-4 rounded-xl border border-orange-100">
                <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-orange-900 mb-1">Form Tips</h4>
                  <p className="text-orange-800 text-sm leading-relaxed font-medium">
                    {exercise.formTips}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseVideoModal;
