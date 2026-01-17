import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TaskCard } from '../components/TaskCard';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Trash2, Search, Calendar } from 'lucide-react';
import { TaskStatus } from '../types';
import { format, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const Tasks: React.FC = () => {
  const { tasks, deleteTask, currentUser } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filter tasks first
  const filteredTasks = tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'ALL' 
        ? true 
        : filter === 'PENDING' 
            ? task.status !== TaskStatus.COMPLETED 
            : task.status === TaskStatus.COMPLETED;
      return matchesSearch && matchesFilter;
  });

  // Group by Date Key (YYYY-MM-DD)
  const groupedTasks = filteredTasks.reduce((acc, task) => {
      const dateKey = task.scheduledAt.split('T')[0];
      if (!acc[dateKey]) {
          acc[dateKey] = [];
      }
      acc[dateKey].push(task);
      return acc;
  }, {} as Record<string, typeof tasks>);

  const sortedDates = Object.keys(groupedTasks).sort((a, b) => a.localeCompare(b));

  const confirmDelete = async () => {
      if (deleteId) {
          await deleteTask(deleteId);
          setDeleteId(null);
      }
  };

  const getDateLabel = (dateStr: string) => {
      const date = parseISO(dateStr);
      if (isToday(date)) return 'Hoje';
      if (isTomorrow(date)) return 'Amanhã';
      if (isYesterday(date)) return 'Ontem';
      return format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Gerenciar Tarefas</h2>
          
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Buscar tarefas..." 
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm dark:text-white"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
            
            <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl self-start md:self-auto">
               <button 
                 onClick={() => setFilter('ALL')}
                 className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === 'ALL' ? 'bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
               >
                 Todas
               </button>
               <button 
                 onClick={() => setFilter('PENDING')}
                 className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === 'PENDING' ? 'bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
               >
                 Pendentes
               </button>
               <button 
                 onClick={() => setFilter('COMPLETED')}
                 className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === 'COMPLETED' ? 'bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
               >
                 Feitas
               </button>
            </div>
          </div>
      </div>

      <div className="space-y-6">
          {sortedDates.length > 0 ? (
              sortedDates.map(dateKey => (
                  <div key={dateKey} className="animate-in slide-in-from-bottom-2">
                      <div className="flex items-center gap-2 mb-3 mt-6">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              {getDateLabel(dateKey)}
                          </h3>
                          <div className="h-px bg-gray-200 dark:bg-slate-700 flex-1"></div>
                      </div>
                      
                      <div className="space-y-2">
                        {groupedTasks[dateKey].map(task => (
                            <div key={task.id} className="group relative pl-2">
                                <TaskCard task={task} />
                                {/* Admin Delete Button */}
                                {(currentUser?.role === 'ADMIN' || currentUser?.id === task.createdBy) && (
                                    <button 
                                        onClick={() => setDeleteId(task.id)}
                                        className="absolute top-4 right-4 p-2 bg-white dark:bg-slate-700 text-gray-400 hover:text-red-500 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity border border-gray-100 dark:border-slate-600 z-10"
                                        title="Excluir tarefa"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                      </div>
                  </div>
              ))
          ) : (
              <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">Nenhuma tarefa encontrada com os filtros atuais.</p>
              </div>
          )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Excluir Tarefa"
        description="Tem certeza que deseja remover esta tarefa permanentemente?"
        confirmText="Excluir"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};