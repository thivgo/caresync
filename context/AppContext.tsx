import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { Task, User, ElderlyProfile, Role } from '../types';
import { db } from '../services/dbService';

type Theme = 'light' | 'dark';

interface AppContextType {
  currentUser: User | null;
  tasks: Task[];
  users: User[];
  elderlyProfiles: ElderlyProfile[];
  refreshTasks: () => Promise<void>;
  refreshProfiles: () => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  deleteElderlyProfile: (id: string) => Promise<void>;
  updateUserRole: (userId: string, newRole: Role) => Promise<void>;
  isLoading: boolean;
  theme: Theme;
  toggleTheme: () => void;
  login: (email: string, password?: string) => Promise<{success: boolean, message?: string}>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [elderlyProfiles, setElderlyProfiles] = useState<ElderlyProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Theme initialization
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const refreshTasks = async () => {
    if (!currentUser) return;
    const data = await db.getTasks();
    const sorted = data.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
    setTasks(sorted);
  };

  const refreshProfiles = async () => {
      const profiles = await db.getElderlyProfiles();
      setElderlyProfiles(profiles);
  };

  const refreshUsers = async () => {
      const fetchedUsers = await db.getUsers();
      setUsers(fetchedUsers);
  }

  const loadData = async () => {
      try {
        const [fetchedUsers, fetchedElderly, fetchedTasks] = await Promise.all([
          db.getUsers(),
          db.getElderlyProfiles(),
          db.getTasks()
        ]);
        setUsers(fetchedUsers);
        setElderlyProfiles(fetchedElderly);
        setTasks(fetchedTasks.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()));
      } catch (error) {
        console.error("Failed to load data", error);
      }
  };

  // --- REALTIME LISTENER ---
  useEffect(() => {
    // This connects to the simulated realtime channel (or Supabase in production)
    const unsubscribe = db.subscribeToChanges(() => {
        if (currentUser) {
            console.log('Realtime update received. Refreshing data...');
            loadData();
        }
    });
    return unsubscribe;
  }, [currentUser]); // Re-subscribe if user changes, though mainly we just need to be logged in

  // Initial Auth Check
  useEffect(() => {
    const checkAuth = async () => {
        setIsLoading(true);
        const user = await db.getCurrentUser();
        if (user) {
            setCurrentUser(user);
            await loadData();
        }
        setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password?: string) => {
      setIsLoading(true);
      const res = await db.login(email, password);
      if (res.success && res.data) {
          setCurrentUser(res.data);
          await loadData();
          setIsLoading(false);
          return { success: true };
      }
      setIsLoading(false);
      return { success: false, message: res.error };
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    const res = await db.signup(name, email, password);
    if (res.success && res.data) {
        setCurrentUser(res.data);
        await loadData();
        setIsLoading(false);
        return true;
    }
    setIsLoading(false);
    return false;
  };

  const logout = async () => {
      await db.logout();
      setCurrentUser(null);
      setTasks([]);
  };

  const deleteTask = async (taskId: string) => {
    // Optimistic Update: Remove immediately from state
    const oldTasks = [...tasks];
    setTasks(prev => prev.filter(t => t.id !== taskId));
    
    // Sync DB
    const res = await db.deleteTask(taskId);
    if (!res.success) setTasks(oldTasks); // Revert if failed
  };

  const deleteUser = async (userId: string) => {
    // Optimistic Update
    const oldUsers = [...users];
    setUsers(prev => prev.filter(u => u.id !== userId));

    // Cleanup tasks locally immediately
    setTasks(prev => prev.map(t => t.assignedToId === userId ? { ...t, assignedToId: null } : t));
    
    // Sync DB
    const res = await db.deleteUser(userId);
    if (!res.success) setUsers(oldUsers);
  };

  const deleteElderlyProfile = async (id: string) => {
      // Optimistic Update
      const oldProfiles = [...elderlyProfiles];
      setElderlyProfiles(prev => prev.filter(e => e.id !== id));
      
      // Cleanup tasks locally
      const oldTasks = [...tasks];
      setTasks(prev => prev.filter(t => t.elderlyId !== id));

      // Sync DB
      const res = await db.deleteElderlyProfile(id);
      if (!res.success) {
          setElderlyProfiles(oldProfiles);
          setTasks(oldTasks);
      }
  };

  const updateUserRole = async (userId: string, newRole: Role) => {
    // Optimistic Update
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    
    if (currentUser && currentUser.id === userId) {
        setCurrentUser(prev => prev ? { ...prev, role: newRole } : null);
    }

    await db.updateUserRole(userId, newRole);
    // Do NOT call refreshUsers() here, rely on the optimistic update
  };

  return (
    <AppContext.Provider value={{ 
      currentUser, 
      tasks, 
      users, 
      elderlyProfiles, 
      refreshTasks,
      refreshProfiles,
      deleteTask,
      deleteUser,
      deleteElderlyProfile,
      updateUserRole,
      isLoading,
      theme,
      toggleTheme,
      login,
      signup,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};