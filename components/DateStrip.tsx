import React, { useRef, useEffect } from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DateStripProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export const DateStrip: React.FC<DateStripProps> = ({ selectedDate, onSelectDate }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);
  
  // Generate 14 days around today
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 }); // Start Monday
  const dates = Array.from({ length: 14 }, (_, i) => addDays(startDate, i));

  // Auto scroll to selected date when it changes
  useEffect(() => {
    if (selectedRef.current) {
        selectedRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }
  }, [selectedDate]);

  return (
    <div className="flex items-center bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 shadow-sm sticky top-0 md:top-0 z-10 py-3 transition-colors duration-200">
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto no-scrollbar px-4 gap-3 w-full snap-x"
      >
        {dates.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, new Date());
          
          return (
            <button
              key={date.toISOString()}
              ref={isSelected ? selectedRef : null}
              onClick={() => onSelectDate(date)}
              className={`
                flex flex-col items-center justify-center min-w-[3.5rem] h-16 rounded-xl transition-all snap-center
                ${isSelected 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/50 transform scale-105' 
                  : 'bg-gray-50 dark:bg-slate-700/50 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
                }
                ${isToday && !isSelected ? 'border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-semibold' : ''}
              `}
            >
              <span className="text-xs uppercase font-medium mb-1">
                {format(date, 'EEE', { locale: ptBR }).replace('.', '')}
              </span>
              <span className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                {format(date, 'd')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};