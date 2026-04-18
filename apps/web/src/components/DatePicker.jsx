
import React, { useState, useEffect } from 'react';
import { format, subDays, startOfMonth, subMonths, startOfYear, isValid, setMonth, setYear, getMonth, getYear } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DatePicker = ({ value, onChange, placeholder = "Select date", className, disabled }) => {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value || new Date());
  const [yearInput, setYearInput] = useState(getYear(viewDate).toString());

  useEffect(() => {
    if (value && isValid(value)) {
      setViewDate(value);
      setYearInput(getYear(value).toString());
    }
  }, [value]);

  const handleSelect = (date) => {
    if (date) {
      onChange(date);
      setOpen(false);
    }
  };

  const handleShortcut = (daysToSubtract, type = 'days') => {
    const today = new Date();
    let newDate = today;

    if (type === 'days') {
      newDate = subDays(today, daysToSubtract);
    } else if (type === 'thisMonth') {
      newDate = startOfMonth(today);
    } else if (type === 'lastMonth') {
      newDate = startOfMonth(subMonths(today, 1));
    } else if (type === 'thisYear') {
      newDate = startOfYear(today);
    }

    setViewDate(newDate);
    setYearInput(getYear(newDate).toString());
    onChange(newDate);
    setOpen(false);
  };

  const handleMonthChange = (monthStr) => {
    const monthIndex = MONTHS.indexOf(monthStr);
    if (monthIndex !== -1) {
      const newDate = setMonth(viewDate, monthIndex);
      setViewDate(newDate);
    }
  };

  const handleYearChange = (e) => {
    const newYearStr = e.target.value;
    setYearInput(newYearStr);
    const parsedYear = parseInt(newYearStr, 10);
    if (!isNaN(parsedYear) && parsedYear > 1900 && parsedYear < 2100) {
      setViewDate(setYear(viewDate, parsedYear));
    }
  };

  const handlePrevMonth = () => setViewDate(subMonths(viewDate, 1));
  const handleNextMonth = () => setViewDate(subMonths(viewDate, -1));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-white transition-all",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value && isValid(value) ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 flex flex-col sm:flex-row shadow-lg rounded-xl border-slate-200 overflow-hidden" align="start">
        {/* Shortcuts Sidebar */}
        <div className="bg-slate-50 border-b sm:border-b-0 sm:border-r border-slate-200 p-3 flex flex-row sm:flex-col gap-1 sm:w-[140px] overflow-x-auto no-scrollbar">
          <Button variant="ghost" size="sm" className="justify-start text-xs h-8" onClick={() => handleShortcut(0)}>Today</Button>
          <Button variant="ghost" size="sm" className="justify-start text-xs h-8" onClick={() => handleShortcut(1)}>Yesterday</Button>
          <Button variant="ghost" size="sm" className="justify-start text-xs h-8" onClick={() => handleShortcut(7)}>Last 7 days</Button>
          <Button variant="ghost" size="sm" className="justify-start text-xs h-8" onClick={() => handleShortcut(30)}>Last 30 days</Button>
          <Button variant="ghost" size="sm" className="justify-start text-xs h-8" onClick={() => handleShortcut(0, 'thisMonth')}>This month</Button>
          <Button variant="ghost" size="sm" className="justify-start text-xs h-8" onClick={() => handleShortcut(0, 'lastMonth')}>Last month</Button>
          <Button variant="ghost" size="sm" className="justify-start text-xs h-8" onClick={() => handleShortcut(0, 'thisYear')}>This year</Button>
        </div>

        {/* Main Calendar Area */}
        <div className="p-3 bg-white">
          {/* Custom Header */}
          <div className="flex items-center justify-between gap-2 mb-4 px-1">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex gap-2 flex-1">
              <Select value={MONTHS[getMonth(viewDate)]} onValueChange={handleMonthChange}>
                <SelectTrigger className="h-8 text-sm font-medium border-slate-200 focus:ring-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {MONTHS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
              
              <Input 
                type="number" 
                value={yearInput} 
                onChange={handleYearChange}
                className="h-8 w-[80px] text-sm font-medium border-slate-200 focus-visible:ring-primary text-center px-1 tabular-nums"
                placeholder="Year"
                min={1900}
                max={2100}
              />
            </div>

            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Calendar
            mode="single"
            selected={value}
            onSelect={handleSelect}
            month={viewDate}
            onMonthChange={setViewDate}
            className="p-0 border-none"
            showOutsideDays={true}
            classNames={{
              head_row: "flex w-full mt-2",
              head_cell: "text-slate-500 rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-slate-100/50 [&:has([aria-selected])]:bg-slate-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: cn(
                "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md transition-colors",
                "hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900"
              ),
              day_range_end: "day-range-end",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-slate-100 text-slate-900",
              day_outside: "day-outside text-slate-400 opacity-50 aria-selected:bg-slate-100/50 aria-selected:text-slate-500 aria-selected:opacity-30",
              day_disabled: "text-slate-400 opacity-50",
              day_hidden: "invisible",
              vhidden: "hidden" // hides the native caption
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
