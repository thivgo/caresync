import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../services/dbService';
import { TaskPriority, TaskType, TaskStatus } from '../types';
import { X, Loader2 } from 'lucide-react';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, selectedDate }) => {
  const { elderlyProfiles, currentUser, refreshTasks } = useApp();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    elderlyId: elderlyProfiles[0]?.id || '',
    priority: TaskPriority.MEDIUM,
    type: TaskType.MEDICATION,
    time: '09:00'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setLoading(true);
    
    // Construct DateTime
    const [hours, minutes] = formData.time.split(':');
    const scheduledAt = new Date(selectedDate);
    scheduledAt.setHours(parseInt(hours), parseInt(minutes));

    await db.createTask({
        id: `t${Date.now()}`,
        title: formData.title,
        description: formData.description,
        elderlyId: formData.elderlyId,
        assignedToId: null,
        createdBy: currentUser.id,
        scheduledAt: scheduledAt.toISOString(),
        status: TaskStatus.PENDING,
        priority: formData.priority,
        type: formData.type
    });

    await refreshTasks();
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Nova Tarefa</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">O que deve ser feito?</label>
            <input 
              required
              type="text" 
              placeholder="Ex: Tomar remédio, Banho, Almoço..."
              className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Para quem?</label>
               <select 
                 className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm dark:text-white"
                 value={formData.elderlyId}
                 onChange={e => setFormData({...formData, elderlyId: e.target.value})}
               >
                 {elderlyProfiles.map(p => (
                   <option key={p.id} value={p.id}>{p.name}</option>
                 ))}
               </select>
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Horário</label>
               <input 
                 type="time"
                 className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm dark:text-white"
                 value={formData.time}
                 onChange={e => setFormData({...formData, time: e.target.value})}
               />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoria</label>
                <select 
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm dark:text-white"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as TaskType})}
                >
                   {Object.values(TaskType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prioridade</label>
                <select 
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm dark:text-white"
                  value={formData.priority}
                  onChange={e => setFormData({...formData, priority: e.target.value as TaskPriority})}
                >
                   {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Observações (Opcional)</label>
            <textarea 
              rows={3}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Criar Tarefa'}
          </button>
        </form>
      </div>
    </div>
  );
};