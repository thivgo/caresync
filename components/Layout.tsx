import React from 'react';
import { useApp } from '../context/AppContext';
import { Avatar } from './ui/Avatar';
import { LayoutGrid, Calendar, Users, Settings, Sun, Moon, LogOut, UserCog, HeartPulse } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const SidebarItem: React.FC<{ item: any; isActive: boolean }> = ({ item, isActive }) => (
  <Link 
    to={item.path}
    className={`
      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
      ${isActive 
        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium' 
        : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800'
      }
    `}
  >
    <item.icon className={`w-5 h-5 ${isActive ? 'fill-blue-100 dark:fill-blue-900' : ''}`} strokeWidth={2} />
    <span>{item.label}</span>
  </Link>
);

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, theme, toggleTheme, logout } = useApp();
  const location = useLocation();

  const navItems = [
    { icon: Calendar, label: 'Hoje', path: '/' },
    { icon: LayoutGrid, label: 'Tarefas', path: '/tasks' },
    { icon: Users, label: 'Idosos', path: '/profiles' },
  ];

  if (currentUser?.role === 'ADMIN') {
      navItems.push({ icon: UserCog, label: 'Usuários', path: '/users' });
  }

  navItems.push({ icon: Settings, label: 'Config', path: '/settings' });

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 overflow-hidden transition-colors duration-200">
      
      {/* Desktop/Tablet Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-800 border-r border-gray-100 dark:border-slate-700 h-full p-4 shrink-0 shadow-lg z-20">
        <div className="flex items-center gap-3 px-2 mb-8 mt-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
            <HeartPulse className="w-5 h-5" />
          </div>
          <h1 className="font-bold text-xl text-gray-800 dark:text-white tracking-tight">CareSync</h1>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <SidebarItem key={item.path} item={item} isActive={location.pathname === item.path} />
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between px-2">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tema</span>
                <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
                >
                    {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </button>
            </div>
            
            <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-600">
                <Avatar src={currentUser?.avatarUrl || ''} alt={currentUser?.name || 'U'} size="sm" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate dark:text-white">{currentUser?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentUser?.role}</p>
                </div>
                <button 
                  onClick={logout}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Sair"
                >
                  <LogOut className="w-4 h-4" />
                </button>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full w-full relative">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white dark:bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-gray-100 dark:border-slate-700 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <HeartPulse className="w-5 h-5" />
            </div>
            <h1 className="font-bold text-gray-800 dark:text-white tracking-tight">CareSync</h1>
          </div>
          <div className="flex items-center gap-3">
              <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                  {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <Avatar src={currentUser?.avatarUrl || ''} alt={currentUser?.name || ''} />
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-20 md:pb-0 bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
          <div className="max-w-4xl mx-auto w-full">
             {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 px-6 py-3 flex justify-between items-center z-30 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}
              >
                <item.icon className={`w-6 h-6 ${isActive ? 'fill-blue-100 dark:fill-blue-900' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  );
};