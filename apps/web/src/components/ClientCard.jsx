
import React, { useState, useRef, useEffect } from 'react';
import { format, isWithinInterval, addDays, setYear, differenceInDays } from 'date-fns';
import { Pencil, Plus, Minus, RefreshCw, Archive, Trash2, AlertCircle, Mail, Phone, Calendar as CalendarIcon, Link as LinkIcon, Gift, Activity, Infinity, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useClientManagement } from '../context/ClientManagementContext.jsx';
import { useIsMobile } from '@/hooks/use-mobile.jsx';
import EditClientModal from './EditClientModal.jsx';
import SessionDateTimePicker from './SessionDateTimePicker.jsx';
import RenewalModal from './RenewalModal.jsx';
import ClientDetailsModal from './ClientDetailsModal.jsx';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const ClientCard = ({ client, isSelected, onToggleSelect }) => {
  const { deductSession, addSession, archiveClient, deleteClient, getExpiryStatus, refreshClients } = useClientManagement();
  const isMobile = useIsMobile();
  
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeductOpen, setIsDeductOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isRenewalOpen, setIsRenewalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);

  const longPressTimer = useRef(null);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const { id, name, email, phone, currentSessions, packageSize, archived, expiryDate, memberStatus, birthday, unlimited, attendance_count, follow_up_status } = client;

  const percentage = packageSize > 0 ? (currentSessions / packageSize) : 0;
  const { status: expiryStatus, daysRemaining } = getExpiryStatus(expiryDate);

  const getSessionStatusIndicator = () => {
    if (archived) return 'bg-slate-200 ring-slate-100';
    if (unlimited) return 'bg-blue-500 ring-blue-500/20';
    if (percentage > 0.5) return 'bg-green-500 ring-green-500/20';
    if (percentage >= 0.2) return 'bg-yellow-500 ring-yellow-500/20';
    return 'bg-red-500 ring-red-500/20';
  };

  const getStatusConfig = () => {
    if (archived) return { bgColor: '#F8FAFC', borderColor: '#E2E8F0', status: 'Archived', variant: 'outline' };
    if (unlimited) return { bgColor: '#F0F9FF', borderColor: '#BAE6FD', status: 'Unlimited', variant: 'default' };
    if (currentSessions > 2) return { bgColor: '#ffffff', borderColor: '#E2E8F0', status: 'Active', variant: 'secondary' };
    if (currentSessions >= 1) return { bgColor: '#FEFCE8', borderColor: '#FDE047', status: 'Low', variant: 'secondary' };
    return { bgColor: '#FEF2F2', borderColor: '#FCA5A5', status: 'Expired', variant: 'destructive' };
  };

  const statusConfig = getStatusConfig();
  const isExpired = (!unlimited && currentSessions === 0) || expiryStatus === 'expired';

  const isBirthdaySoon = () => {
    if (!birthday) return false;
    const today = new Date();
    const nextWeek = addDays(today, 7);
    const bday = new Date(birthday);
    const bdayThisYear = setYear(bday, today.getFullYear());
    
    if (bdayThisYear < today && differenceInDays(today, bdayThisYear) > 0) {
      const bdayNextYear = setYear(bday, today.getFullYear() + 1);
      return isWithinInterval(bdayNextYear, { start: today, end: nextWeek });
    }
    return isWithinInterval(bdayThisYear, { start: today, end: nextWeek });
  };

  const handleDelete = () => {
    if (window.confirm(`Permanently delete ${name} and all associated history?`)) {
      deleteClient(id);
    }
  };

  const handleCopyPortalLink = () => {
    const url = `${window.location.origin}/client-portal/${id}`;
    navigator.clipboard.writeText(url)
      .then(() => toast.success('Portal link copied to clipboard!'))
      .catch(() => toast.error('Failed to copy link.'));
  };

  const handleMoveToFollowUp = async () => {
    try {
      await pb.collection('clients').update(id, { follow_up_status: true }, { $autoCancel: false });
      await refreshClients();
      toast.success(`${name} moved to follow-up`);
    } catch (error) {
      console.error('Error moving to follow-up:', error);
      toast.error('Failed to move client to follow-up');
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
      onToggleSelect(id);
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
        className={`rounded-2xl border flex flex-col h-full transition-all hover:shadow-lg ${archived ? 'opacity-80' : ''} ${isSelected ? 'ring-2 ring-primary bg-primary/5' : ''} ${isLongPressing ? 'scale-[0.98]' : ''} p-2 sm:p-4 md:p-6`}
        style={{ backgroundColor: statusConfig.bgColor, borderColor: statusConfig.borderColor }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex flex-col gap-1 sm:gap-2 md:gap-3 mb-2 sm:mb-3 md:mb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-1 sm:gap-2 flex-1 pr-1 sm:pr-2 min-w-0">
              {!archived && !isMobile && (
                <Checkbox 
                  checked={isSelected} 
                  onCheckedChange={() => onToggleSelect(id)}
                  className="mt-1 shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                  <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full ring-2 sm:ring-4 shrink-0 ${getSessionStatusIndicator()}`} />
                  <h3 className="text-sm sm:text-lg md:text-xl font-bold text-slate-900 cursor-pointer hover:text-primary transition-colors break-words" onClick={() => setIsDetailsOpen(true)}>{name}</h3>
                  {isBirthdaySoon() && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Gift className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500 animate-bounce shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent>Birthday coming up!</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                
                <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 mt-1 sm:mt-2 flex-wrap">
                  <Badge variant={memberStatus === 'member' ? 'default' : 'secondary'} className={`text-[10px] sm:text-xs ${memberStatus === 'member' ? 'bg-green-600 hover:bg-green-700' : ''}`}>
                    {memberStatus === 'member' ? 'Member' : 'Non-Member'}
                  </Badge>
                  {unlimited && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] sm:text-xs">
                      <Infinity className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" /> Unlimited
                    </Badge>
                  )}
                </div>

                <div className="flex flex-col gap-0.5 sm:gap-1 mt-2 sm:mt-3 text-[10px] sm:text-xs md:text-sm text-slate-600 min-w-0">
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
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1 sm:gap-2 shrink-0">
              <Badge variant={statusConfig.variant} className={`text-[10px] sm:text-xs ${!archived && currentSessions > 2 && !unlimited ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : ''}`}>
                {statusConfig.status}
              </Badge>
              {!archived && (
                <div className="flex flex-wrap justify-end items-center gap-0.5 sm:gap-1 md:-mr-2 max-w-[80px] sm:max-w-[100px] md:max-w-none">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button onClick={() => setIsDetailsOpen(true)} className="p-1 sm:p-1.5 text-primary hover:text-primary/80 hover:bg-primary/10 rounded-md transition-colors min-h-[32px] min-w-[32px] sm:min-h-[36px] sm:min-w-[36px] flex items-center justify-center">
                          <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>View Progress</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button onClick={handleCopyPortalLink} className="p-1 sm:p-1.5 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-md transition-colors min-h-[32px] min-w-[32px] sm:min-h-[36px] sm:min-w-[36px] flex items-center justify-center">
                          <LinkIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Copy Portal Link</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <button onClick={() => setIsEditOpen(true)} className="p-1 sm:p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors min-h-[32px] min-w-[32px] sm:min-h-[36px] sm:min-w-[36px] flex items-center justify-center"><Pencil className="w-3 h-3 sm:w-4 sm:h-4" /></button>
                  {!follow_up_status && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button onClick={handleMoveToFollowUp} className="p-1 sm:p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors min-h-[32px] min-w-[32px] sm:min-h-[36px] sm:min-w-[36px] flex items-center justify-center">
                            <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Move to Follow Up</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  <button onClick={() => archiveClient(id)} className="p-1 sm:p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors min-h-[32px] min-w-[32px] sm:min-h-[36px] sm:min-w-[36px] flex items-center justify-center"><Archive className="w-3 h-3 sm:w-4 sm:h-4" /></button>
                  <button onClick={handleDelete} className="p-1 sm:p-1.5 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors min-h-[32px] min-w-[32px] sm:min-h-[36px] sm:min-w-[36px] flex items-center justify-center"><Trash2 className="w-3 h-3 sm:w-4 sm:h-4" /></button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-3 sm:mb-4 md:mb-6 flex-1">
          {unlimited ? (
            <>
              <div className="flex items-baseline gap-1">
                <span className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tabular-nums tracking-tight ${archived ? 'text-slate-500' : 'text-slate-900'}`}>{attendance_count}</span>
              </div>
              <p className={`text-[10px] sm:text-xs md:text-sm font-medium mt-0.5 sm:mt-1 ${archived ? 'text-slate-400' : 'text-slate-500'}`}>classes attended</p>
            </>
          ) : (
            <>
              <div className="flex items-baseline gap-0.5 sm:gap-1">
                <span className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tabular-nums tracking-tight ${archived ? 'text-slate-500' : 'text-slate-900'}`}>{currentSessions}</span>
                <span className={`text-sm sm:text-base md:text-lg font-medium ${archived ? 'text-slate-400' : 'text-slate-500'}`}>/ {packageSize}</span>
              </div>
              <p className={`text-[10px] sm:text-xs md:text-sm font-medium mt-0.5 sm:mt-1 ${archived ? 'text-slate-400' : 'text-slate-500'}`}>sessions remaining</p>
            </>
          )}
          
          {expiryDate && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`mt-2 sm:mt-3 md:mt-4 flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs md:text-sm font-medium px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md w-fit cursor-help ${
                    expiryStatus === 'expired' ? 'bg-red-100 text-red-800' : 
                    expiryStatus === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {expiryStatus === 'expired' ? <AlertCircle className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" /> : <CalendarIcon className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />}
                    Expires: {format(new Date(expiryDate), 'MMM d, yyyy')}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{expiryStatus === 'expired' ? 'Package has expired' : `${daysRemaining} days remaining`}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {!archived && (
          <div className="mt-auto flex flex-col gap-1.5 sm:gap-2 md:gap-3 pt-2 sm:pt-3 md:pt-4 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              <Button onClick={() => setIsDeductOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] w-full shadow-sm min-h-[40px] sm:min-h-[44px] md:min-h-[40px] text-xs sm:text-sm">
                <Minus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" /> Punch
              </Button>
              <Button onClick={() => setIsAddOpen(true)} variant="outline" className="w-full bg-white border-slate-300 hover:bg-slate-50 text-slate-800 min-h-[40px] sm:min-h-[44px] md:min-h-[40px] text-xs sm:text-sm">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" /> Add
              </Button>
            </div>

            {isExpired ? (
              <Button onClick={() => setIsRenewalOpen(true)} className="w-full bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] shadow-sm min-h-[40px] sm:min-h-[44px] md:min-h-[40px] text-xs sm:text-sm">
                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" /> Renew Package
              </Button>
            ) : (
              <Button onClick={() => setIsRenewalOpen(true)} variant="ghost" className="w-full text-[10px] sm:text-xs text-slate-500 hover:text-slate-900 min-h-[36px] sm:min-h-[40px] md:min-h-[36px] mt-0.5 sm:mt-1">
                Process Early Renewal
              </Button>
            )}
          </div>
        )}
      </div>

      <EditClientModal client={client} open={isEditOpen} onOpenChange={setIsEditOpen} />
      
      <RenewalModal 
        clientId={id}
        clientName={name}
        currentExpiryDate={expiryDate}
        open={isRenewalOpen} 
        onOpenChange={setIsRenewalOpen}
        onRenewalComplete={() => setIsRenewalOpen(false)}
      />
      
      <ClientDetailsModal client={client} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
      <SessionDateTimePicker client={client} mode="deduct" open={isDeductOpen} onOpenChange={setIsDeductOpen} onSubmit={(dateTime) => deductSession(id, dateTime)} />
      <SessionDateTimePicker client={client} mode="add" open={isAddOpen} onOpenChange={setIsAddOpen} onSubmit={(dateTime) => addSession(id, dateTime)} />
    </>
  );
};

export default ClientCard;
