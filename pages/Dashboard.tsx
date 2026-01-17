import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DateStrip } from '../components/DateStrip';
import { TaskCard } from '../components/TaskCard';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { MonthCalendar } from '../components/MonthCalendar'; // Import new component
import { isSameDay, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, CalendarDays, ChevronUp } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { tasks, isLoading } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMonthView, setShowMonthView] = useState(false);

  const dailyTasks = useMemo(() => {
    return tasks.filter(task => isSameDay(new Date(task.scheduledAt), selectedDate));
  }, [tasks, selectedDate]);

  const progress = useMemo(() => {
    if (dailyTasks.length === 0) return 0;
    const completed = dailyTasks.filter(t => t.status === 'COMPLETED').length;
    return Math.round((completed / dailyTasks.length) * 100);
  }, [dailyTasks]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-600">Carregando agenda...</div>;
  }

  return (
    <>
      <DateStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />

      {/* Month View Toggle Area */}
      <div className="px-4 mt-2">
          <button 
            onClick={() => setShowMonthView(!showMonthView)}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
              {showMonthView ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Ocultar Calendário Mensal
                  </>
              ) : (
                  <>
                    <CalendarDays className="w-4 h-4" />
                    Ver Mês Inteiro
                  </>
              )}
          </button>

          {showMonthView && (
              <div className="mt-2 mb-4">
                  <MonthCalendar 
                    selectedDate={selectedDate} 
                    onSelectDate={setSelectedDate} 
                    tasks={tasks}
                  />
              </div>
          )}
      </div>

      <div className="px-4 py-4">
        {/* Progress Header */}
        <div className="mb-6 bg-blue-600 dark:bg-blue-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-200 dark:shadow-none transition-colors">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <h2 className="text-xl font-bold capitalize">
                        {format(selectedDate, "EEEE", { locale: ptBR })}
                    </h2>
                    <p className="text-blue-100 text-sm">
                        {dailyTasks.length} tarefas agendadas
                    </p>
                </div>
                <div className="text-3xl font-bold">{progress}%</div>
            </div>
            <div className="w-full bg-blue-800/30 rounded-full h-2">
                <div 
                    className="bg-white h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>

        {/* Task List */}
        <div className="space-y-1 pb-10">
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 ml-1">
                Cronograma
            </h3>
            
            {dailyTasks.length > 0 ? (
                dailyTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                ))
            ) : (
                <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-200 dark:border-slate-700">
                    <p className="text-gray-400 text-sm">Nenhuma tarefa para este dia.</p>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="mt-2 text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                    >
                        + Adicionar Tarefa
                    </button>
                </div>
            )}
        </div>
      </div>
      
      {/* Floating Action Button (FAB) */}
      <button 
        className="fixed bottom-24 md:bottom-10 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl shadow-blue-600/30 flex items-center justify-center active:scale-95 transition-all z-40"
        aria-label="Add Task"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="w-8 h-8" />
      </button>

      <CreateTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        selectedDate={selectedDate}
      />
    </>
  );
};