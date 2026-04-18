
import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Pencil, Plus, Minus, Trash2, Calendar as CalendarIcon, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useClientManagement } from '../context/ClientManagementContext.jsx';
import { useIsMobile } from '@/hooks/use-mobile.jsx';
import EditClientModal from './EditClientModal.jsx';
import SessionDateTimePicker from './SessionDateTimePicker.jsx';

const CompactClientCard = ({ client, isSelected, onToggleSelect }) => {
  const { deductSession, addSession, deleteClient, getExpiryStatus } = useClientManagement();
  const isMobile = useIsMobile();
  
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeductOpen, setIsDeductOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);

  const longPressTimer = useRef(null);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const cardRef = useRef(null);

  // Extract client data - use currentSessions (which maps to sessionsRemaining)
  const clientId = client?.id;
  const name = client?.clientName || client?.name || 'Unknown';
  const email = client?.email || '';
  const phone = client?.phone || '';
  const currentSessions = client?.currentSessions || 0;
  const packageSize = client?.packageSize || client?.totalSessions || 0;
  const archived = client?.archived || false;
  const expiryDate = client?.expiryDate;

  const percentage = packageSize > 0 ? (currentSessions / packageSize) : 0;
  const { status: expiryStatus } = getExpiryStatus(expiryDate);

  const handleDelete = () => {
    if (window.confirm(`Permanently delete ${name}?`)) {
      deleteClient(clientId);
    }
  };

  // Ensure we pass the correct client ID to the toggle handler
  const handleCheckboxChange = () => {
    if (onToggleSelect && clientId) {
      onToggleSelect(clientId);
    }
  };

  // Long-press handlers for mobile - ONLY on card element
  const handleTouchStart = (e) => {
    if (!isMobile || archived) return;
    
    // Check if touch started on an interactive element (button, input, etc.)
    const target = e.target;
    const isInteractive = target.closest('button, input, select, a, [role="button"]');
    if (isInteractive) return;
    
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    
    longPressTimer.current = setTimeout(() => {
      setIsLongPressing(true);
      onToggleSelect(clientId);
      // Haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500); // 500ms long press
  };

  const handleTouchMove = (e) => {
    if (!longPressTimer.current) return;
    
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPos.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartPos.current.y);
    
    // Cancel long press if finger moves too much
    if (deltaX > 10 || deltaY > 10) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setIsLongPressing(false);
  };

  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  return (
    <>
      <div 
        ref={cardRef}
        className={`bg-white rounded-xl border p-2 sm:p-3 md:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 md:gap-4 transition-smooth hover:shadow-md ${archived ? 'opacity-70' : ''} ${isSelected ? 'ring-2 ring-primary' : ''} ${isLongPressing ? 'scale-[0.98]' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-start gap-1.5 sm:gap-2 md:gap-3 flex-1 min-w-0 w-full">
          {!archived && !isMobile && (
            <div className="shrink-0 mt-0.5 sm:mt-1">
              <Checkbox 
                checked={isSelected} 
                onCheckedChange={handleCheckboxChange}
                aria-label={`Select ${name}`}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 break-words">{name}</h3>
            
            <div className="flex flex-col gap-0.5 sm:gap-1 mt-1 sm:mt-1.5 md:mt-2 text-[10px] sm:text-xs md:text-sm text-gray-600 min-w-0">
              {email && (
                <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                  <Mail className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 shrink-0" />
                  <span className="truncate" title={email}>{email}</span>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                  <Phone className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 shrink-0" />
                  <span className="truncate">{phone}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 mt-1.5 sm:mt-2 md:mt-3">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-10 sm:w-12 md:w-16 h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${percentage > 0.5 ? 'bg-green-500' : percentage > 0.2 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(Math.max(percentage * 100, 0), 100)}%` }}
                  />
                </div>
                <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-600 shrink-0">{currentSessions}/{packageSize}</span>
              </div>
              {expiryDate && (
                <Badge variant="outline" className={`text-[9px] sm:text-[10px] md:text-xs shrink-0 py-0 sm:py-0.5 md:py-1 px-1 sm:px-1.5 ${
                  expiryStatus === 'expired' ? 'bg-red-50 text-red-700 border-red-200' : 
                  expiryStatus === 'warning' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                  'bg-green-50 text-green-700 border-green-200'
                }`}>
                  <CalendarIcon className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 mr-0.5 sm:mr-1" />
                  {format(new Date(expiryDate), 'MMM d')}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {!archived && (
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 w-full sm:w-auto shrink-0 pt-1.5 sm:pt-2 border-t border-slate-100 sm:border-0 sm:pt-0">
            <Button size="sm" onClick={() => setIsDeductOpen(true)} className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 h-9 sm:h-10 text-xs sm:text-sm">
              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsAddOpen(true)} className="flex-1 sm:flex-none h-9 sm:h-10 text-xs sm:text-sm">
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            <div className="flex items-center">
              <Button size="icon" variant="ghost" onClick={() => setIsEditOpen(true)} className="text-gray-400 hover:text-gray-900 h-9 w-9 sm:h-10 sm:w-10">
                <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={handleDelete} className="text-gray-400 hover:text-red-600 h-9 w-9 sm:h-10 sm:w-10">
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <EditClientModal client={client} open={isEditOpen} onOpenChange={setIsEditOpen} />
      <SessionDateTimePicker client={client} mode="deduct" open={isDeductOpen} onOpenChange={setIsDeductOpen} onSubmit={(dateTime) => deductSession(clientId, dateTime)} />
      <SessionDateTimePicker client={client} mode="add" open={isAddOpen} onOpenChange={setIsAddOpen} onSubmit={(dateTime) => addSession(clientId, dateTime)} />
    </>
  );
};

export default CompactClientCard;
