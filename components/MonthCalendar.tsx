import React from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay, 
  isSameMonth,
  addMonths,
  subMonths
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Task } from '../types';

interface MonthCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  tasks: Task[];
}

export const MonthCalendar: React.FC<MonthCalendarProps> = ({ selectedDate, onSelectDate, tasks }) => {
  // Use state to track the "viewing" month, which might be different from "selected" date
  const [viewDate, setViewDate] = React.useState(selectedDate);

  // Sync view date if selected date changes drastically (optional, but good UX)
  React.useEffect(() => {
     if (!isSameMonth(selectedDate, viewDate)) {
         setViewDate(selectedDate);
     }
  }, [selectedDate]);

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const prevMonth = () => setViewDate(subMonths(viewDate, 1));
  const nextMonth = () => setViewDate(addMonths(viewDate, 1));

  // Helper to check for dots
  const hasTaskOnDay = (date: Date) => {
      return tasks.some(t => isSameDay(new Date(t.scheduledAt), date));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 animate-in slide-in-from-top-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full">
                <ChevronLeft className="w-5 h-5 text-gray-500" />
            </button>
            <h3 className="text-sm font-bold text-gray-800 dark:text-white capitalize">
                {format(viewDate, 'MMMM yyyy', { locale: ptBR })}
            </h3>
            <button onClick={nextMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full">
                <ChevronRight className="w-5 h-5 text-gray-500" />
            </button>
        </div>

        {/* Grid Header */}
        <div className="grid grid-cols-7 mb-2 text-center">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                <div key={i} className="text-xs font-medium text-gray-400">
                    {day}
                </div>
            ))}
        </div>

        {/* Grid Body */}
        <div className="grid grid-cols-7 gap-y-2">
            {calendarDays.map((day) => {
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, monthStart);
                const hasTask = hasTaskOnDay(day);
                const isToday = isSameDay(day, new Date());

                return (
                    <button
                        key={day.toString()}
                        onClick={() => onSelectDate(day)}
                        className={`
                            relative h-9 w-9 mx-auto flex items-center justify-center rounded-full text-sm transition-all
                            ${!isCurrentMonth ? 'text-gray-300 dark:text-slate-600' : 'text-gray-700 dark:text-gray-200'}
                            ${isSelected 
                                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/30' 
                                : 'hover:bg-gray-100 dark:hover:bg-slate-700'
                            }
                            ${isToday && !isSelected ? 'border border-blue-400 text-blue-600 dark:text-blue-400' : ''}
                        `}
                    >
                        {format(day, 'd')}
                        
                        {/* Task Dot Indicator */}
                        {hasTask && !isSelected && (
                            <span className="absolute bottom-1 w-1 h-1 bg-blue-400 rounded-full"></span>
                        )}
                        {hasTask && isSelected && (
                            <span className="absolute bottom-1 w-1 h-1 bg-white rounded-full"></span>
                        )}
                    </button>
                );
            })}
        </div>
    </div>
  );
};