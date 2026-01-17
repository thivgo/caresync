import React from 'react';
import { useApp } from '../context/AppContext';
import { Avatar } from '../components/ui/Avatar';
import { LogOut, Moon, Sun, Shield, Mail } from 'lucide-react';

export const Settings: React.FC = () => {
  const { currentUser, logout, theme, toggleTheme } = useApp();

  if (!currentUser) return null;

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
       <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Configurações</h2>

       {/* Profile Card */}
       <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 flex items-center gap-4">
          <Avatar src={currentUser.avatarUrl} alt={currentUser.name} size="lg" className="w-20 h-20" />
          <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{currentUser.name}</h3>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mt-1">
                  <Mail className="w-3.5 h-3.5" />
                  {currentUser.email}
              </div>
              <div className="flex items-center gap-2 text-blue-600 text-sm mt-1 bg-blue-50 dark:bg-blue-900/20 w-fit px-2 py-0.5 rounded-md">
                  <Shield className="w-3.5 h-3.5" />
                  {currentUser.role}
              </div>
          </div>
       </div>

       {/* General Options */}
       <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
           <button 
             onClick={toggleTheme}
             className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors border-b border-gray-100 dark:border-slate-700"
           >
               <div className="flex items-center gap-3">
                   <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                       {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                   </div>
                   <div className="text-left">
                       <p className="font-semibold text-gray-900 dark:text-white">Aparência</p>
                       <p className="text-xs text-gray-500">Alternar modo claro/escuro</p>
                   </div>
               </div>
               <span className="text-sm font-medium text-gray-400">{theme === 'light' ? 'Claro' : 'Escuro'}</span>
           </button>

           <button 
             onClick={logout}
             className="w-full flex items-center justify-between p-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group"
           >
               <div className="flex items-center gap-3">
                   <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg group-hover:bg-red-200">
                       <LogOut className="w-5 h-5" />
                   </div>
                   <div className="text-left">
                       <p className="font-semibold text-gray-900 dark:text-white group-hover:text-red-600">Sair da Conta</p>
                       <p className="text-xs text-gray-500">Encerrar sessão neste dispositivo</p>
                   </div>
               </div>
           </button>
       </div>
       
       <p className="text-center text-xs text-gray-400 mt-8">CareSync v1.1.0 • Serverless Edition</p>
    </div>
  );
};