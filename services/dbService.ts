import { MOCK_ELDERLY, MOCK_USERS, INITIAL_TASKS } from '../constants';
import { Task, User, ElderlyProfile, ActionResponse, TaskStatus, Role } from '../types';

// In a real Vercel app, this would be interacting with Neon (Postgres) or Supabase.
// Here we use LocalStorage to persist state during the session.

const STORAGE_KEY_TASKS = 'caresync_tasks_v7'; // Bump to V7 for simple random avatars
const STORAGE_KEY_USERS = 'caresync_users_v7';
const STORAGE_KEY_ELDERLY = 'caresync_elderly_v7'; 
const STORAGE_KEY_SESSION = 'caresync_session_v7';

// Helper to initialize storage if empty
const initStorage = () => {
    let usersStr = localStorage.getItem(STORAGE_KEY_USERS);
    
    if (!usersStr) {
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(MOCK_USERS));
    } else {
        // Ensure admin password matches constants (Dev Helper)
        const users = JSON.parse(usersStr) as User[];
        const adminIndex = users.findIndex(u => u.id === 'admin_user');
        const mockAdmin = MOCK_USERS.find(u => u.id === 'admin_user');
        
        if (adminIndex !== -1 && mockAdmin && users[adminIndex].password !== mockAdmin.password) {
            users[adminIndex].password = mockAdmin.password;
            localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
        }
    }

    if (!localStorage.getItem(STORAGE_KEY_ELDERLY)) {
        localStorage.setItem(STORAGE_KEY_ELDERLY, JSON.stringify(MOCK_ELDERLY));
    }
    if (!localStorage.getItem(STORAGE_KEY_TASKS)) {
        localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(INITIAL_TASKS));
    }
};

// --- Generic Helpers ---
const data = {
    users: (): User[] => JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]'),
    elderly: (): ElderlyProfile[] => JSON.parse(localStorage.getItem(STORAGE_KEY_ELDERLY) || '[]'),
    tasks: (): Task[] => JSON.parse(localStorage.getItem(STORAGE_KEY_TASKS) || '[]'),
};

const save = {
    users: (d: User[]) => localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(d)),
    elderly: (d: ElderlyProfile[]) => localStorage.setItem(STORAGE_KEY_ELDERLY, JSON.stringify(d)),
    tasks: (d: Task[]) => localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(d)),
};

// Ensure mock data exists on load
if (typeof window !== 'undefined') initStorage();

export const db = {
  // --- AUTH ---
  login: async (emailOrLogin: string, password?: string): Promise<ActionResponse<User>> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Keep delay only for login feel
    const users = data.users();
    const user = users.find(u => u.email.toLowerCase() === emailOrLogin.toLowerCase() || u.email.split('@')[0] === emailOrLogin.toLowerCase());
    
    if (!user) return { success: false, error: 'Usuário não encontrado.' };
    if (user.password !== password) return { success: false, error: 'Senha incorreta.' };
    
    localStorage.setItem(STORAGE_KEY_SESSION, user.id);
    return { success: true, data: user };
  },

  signup: async (name: string, email: string, password: string): Promise<ActionResponse<User>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = data.users();
    
    if (users.find(u => u.email === email)) {
        return { success: false, error: 'Email já cadastrado.' };
    }

    const newUser: User = {
        id: `u${Date.now()}`,
        name,
        email,
        password,
        // Simple random v7.x URL
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4`,
        role: 'MEMBER',
        color: 'bg-indigo-100 text-indigo-800'
    };

    save.users([...users, newUser]);
    localStorage.setItem(STORAGE_KEY_SESSION, newUser.id);
    return { success: true, data: newUser };
  },

  getCurrentUser: async (): Promise<User | null> => {
    const id = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!id) return null;
    return data.users().find(u => u.id === id) || null;
  },

  logout: async () => {
    localStorage.removeItem(STORAGE_KEY_SESSION);
  },

  // --- USERS MANAGEMENT (INSTANT - No Delays) ---
  getUsers: async (): Promise<User[]> => {
    return data.users();
  },

  updateUserRole: async (userId: string, newRole: Role): Promise<ActionResponse<User>> => {
    // No setTimeout
    const users = data.users();
    const index = users.findIndex(u => u.id === userId);
    
    if (index === -1) return { success: false, error: 'User not found' };
    
    const updatedUser = { ...users[index], role: newRole };
    const newUsers = [...users];
    newUsers[index] = updatedUser;
    
    save.users(newUsers);
    return { success: true, data: updatedUser };
  },

  deleteUser: async (userId: string): Promise<ActionResponse<void>> => {
    // No setTimeout
    const users = data.users().filter(u => u.id !== userId);
    save.users(users);

    // Unassign tasks assigned to this user
    const tasks = data.tasks().map(t => 
        t.assignedToId === userId ? { ...t, assignedToId: null } : t
    );
    save.tasks(tasks);
    
    return { success: true };
  },

  // --- TASKS (INSTANT) ---
  getTasks: async (): Promise<Task[]> => {
    return data.tasks();
  },

  assignTask: async (taskId: string, userId: string | null): Promise<ActionResponse<Task>> => {
    const tasks = data.tasks();
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) return { success: false, error: 'Task not found' };

    tasks[index] = { ...tasks[index], assignedToId: userId };
    save.tasks(tasks);
    return { success: true, data: tasks[index] };
  },

  updateTaskStatus: async (taskId: string, status: TaskStatus): Promise<ActionResponse<Task>> => {
    const tasks = data.tasks();
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) return { success: false, error: 'Task not found' };

    tasks[index] = { 
      ...tasks[index], 
      status,
      completedAt: status === TaskStatus.COMPLETED ? new Date().toISOString() : undefined
    };
    save.tasks(tasks);
    return { success: true, data: tasks[index] };
  },

  createTask: async (task: Task): Promise<ActionResponse<Task>> => {
    const tasks = data.tasks();
    save.tasks([...tasks, task]);
    return { success: true, data: task };
  },

  deleteTask: async (taskId: string): Promise<ActionResponse<void>> => {
      const tasks = data.tasks().filter(t => t.id !== taskId);
      save.tasks(tasks);
      return { success: true };
  },

  // --- PROFILES (INSTANT) ---
  getElderlyProfiles: async (): Promise<ElderlyProfile[]> => {
    return data.elderly();
  },

  createElderlyProfile: async (profile: ElderlyProfile): Promise<ActionResponse<ElderlyProfile>> => {
    const list = data.elderly();
    save.elderly([...list, profile]);
    return { success: true, data: profile };
  },

  deleteElderlyProfile: async (id: string): Promise<ActionResponse<void>> => {
      const list = data.elderly().filter(e => e.id !== id);
      save.elderly(list);

      const tasks = data.tasks().filter(t => t.elderlyId !== id);
      save.tasks(tasks);

      return { success: true };
  }
};