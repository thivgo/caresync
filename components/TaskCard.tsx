import React, { useState } from 'react';
import { Task, TaskPriority, TaskStatus, TaskType } from '../types';
import { useApp } from '../context/AppContext';
import { db } from '../services/dbService';
import { Avatar } from './ui/Avatar';
import { format } from 'date-fns';
import { 
  CheckCircle2, 
  Circle, 
  UserPlus, 
  Pill, 
  Utensils, 
  ShowerHead, 
  Activity, 
  CalendarClock,
  AlertCircle
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { users, elderlyProfiles, currentUser, refreshTasks } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);

  const elderly = elderlyProfiles.find(e => e.id === task.elderlyId);
  const assignee = users.find(u => u.id === task.assignedToId);
  
  const isAssignedToMe = task.assignedToId === currentUser.id;
  const isPending = task.status === TaskStatus.PENDING;

  const handleAssign = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsProcessing(true);
    // If assigned to me, unassign. If unassigned, assign to me.
    const newAssignee = isAssignedToMe ? null : currentUser.id;
    await db.assignTask(task.id, newAssignee);
    await refreshTasks();
    setIsProcessing(false);
  };

  const handleStatusToggle = async () => {
    if (!isAssignedToMe && task.assignedToId) return; // Cannot complete others' tasks easily
    
    setIsProcessing(true);
    const newStatus = task.status === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED;
    await db.updateTaskStatus(task.id, newStatus);
    await refreshTasks();
    setIsProcessing(false);
  };

  const getTypeIcon = () => {
    switch (task.type) {
      case TaskType.MEDICATION: return <Pill className="w-4 h-4 text-rose-500" />;
      case TaskType.MEAL: return <Utensils className="w-4 h-4 text-orange-500" />;
      case TaskType.HYGIENE: return <ShowerHead className="w-4 h-4 text-cyan-500" />;
      case TaskType.ACTIVITY: return <Activity className="w-4 h-4 text-emerald-500" />;
      default: return <CalendarClock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = () => {
    if (task.status === TaskStatus.COMPLETED) return 'border-l-gray-300 dark:border-l-slate-600';
    switch (task.priority) {
      case TaskPriority.CRITICAL: return 'border-l-red-500';
      case TaskPriority.HIGH: return 'border-l-orange-400';
      case TaskPriority.MEDIUM: return 'border-l-blue-400';
      default: return 'border-l-gray-300 dark:border-l-slate-600';
    }
  };

  return (
    <div className={`
      relative bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border-l-4 mb-3 transition-all duration-200
      ${getPriorityColor()}
      ${task.status === TaskStatus.COMPLETED ? 'opacity-70 bg-gray-50 dark:bg-slate-800/50' : 'hover:shadow-md dark:shadow-none dark:hover:bg-slate-750'}
    `}>
      <div className="flex items-start justify-between gap-3">
        
        {/* Checkbox / Status */}
        <button 
          onClick={handleStatusToggle}
          disabled={!task.assignedToId || (!isAssignedToMe && !!task.assignedToId) || isProcessing}
          className={`mt-1 transition-transform active:scale-95 ${!task.assignedToId ? 'cursor-not-allowed opacity-30' : ''}`}
        >
          {task.status === TaskStatus.COMPLETED ? (
            <CheckCircle2 className="w-6 h-6 text-green-500 fill-green-50 dark:fill-green-900/20" />
          ) : (
            <Circle className="w-6 h-6 text-gray-300 dark:text-gray-600 hover:text-blue-500 dark:hover:text-blue-400" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-gray-100 dark:bg-slate-700 rounded-md p-1">
              {getTypeIcon()}
            </span>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {format(new Date(task.scheduledAt), 'HH:mm')} • {elderly?.name.split(' ')[0]}
            </span>
            {task.priority === TaskPriority.CRITICAL && (
               <span className="flex items-center text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-1.5 py-0.5 rounded-full">
                 <AlertCircle className="w-3 h-3 mr-1" />
                 CRÍTICO
               </span>
            )}
          </div>
          
          <h3 className={`font-semibold text-gray-900 dark:text-gray-100 truncate ${task.status === TaskStatus.COMPLETED ? 'line-through text-gray-500 dark:text-gray-500' : ''}`}>
            {task.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
            {task.description}
          </p>

          {/* Footer: Assignment */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
                {assignee ? (
                   <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700 pr-3 rounded-full border border-gray-100 dark:border-slate-600">
                     <Avatar src={assignee.avatarUrl} alt={assignee.name} size="sm" />
                     <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                        {isAssignedToMe ? 'Eu' : assignee.name.split(' ')[0]}
                     </span>
                   </div>
                ) : (
                  <span className="text-xs text-gray-400 dark:text-gray-500 italic pl-1">
                    Sem responsável
                  </span>
                )}
            </div>

            {/* Assignment Action (Jira Style) */}
            {task.status !== TaskStatus.COMPLETED && (
              <button
                onClick={handleAssign}
                disabled={isProcessing}
                className={`
                  flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors
                  ${isAssignedToMe 
                    ? 'text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/30' 
                    : !assignee 
                      ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/30'
                      : 'text-gray-400 dark:text-gray-600 cursor-default'
                  }
                `}
              >
                {isProcessing ? (
                  <span className="animate-pulse">...</span>
                ) : isAssignedToMe ? (
                  'Abandonar'
                ) : !assignee ? (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    Assumir
                  </>
                ) : (
                  ''
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};