import { MOCK_ELDERLY, MOCK_USERS, INITIAL_TASKS, SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants';
import { Task, User, ElderlyProfile, ActionResponse, TaskStatus, Role } from '../types';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// --- HYBRID SYSTEM CONFIGURATION ---
const isCloudMode = !!(SUPABASE_URL && SUPABASE_ANON_KEY);
console.log(isCloudMode ? "☁️ Running in CLOUD mode (Supabase)" : "🏠 Running in LOCAL mode (LocalStorage)");

let supabase: SupabaseClient | null = null;
if (isCloudMode) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

const STORAGE_KEY_TASKS = 'caresync_tasks_v7';
const STORAGE_KEY_USERS = 'caresync_users_v7';
const STORAGE_KEY_ELDERLY = 'caresync_elderly_v7'; 
const STORAGE_KEY_SESSION = 'caresync_session_v7';

// --- LOCAL HELPERS (Fallback) ---
const channel = new BroadcastChannel('caresync_realtime_channel');
const notifyChange = (entity: 'TASKS' | 'USERS' | 'PROFILES') => {
    channel.postMessage({ type: 'DB_UPDATE', entity });
};

const initStorage = () => {
    if (isCloudMode) return; // Skip if cloud
    let usersStr = localStorage.getItem(STORAGE_KEY_USERS);
    if (!usersStr) {
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(MOCK_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEY_ELDERLY)) {
        localStorage.setItem(STORAGE_KEY_ELDERLY, JSON.stringify(MOCK_ELDERLY));
    }
    if (!localStorage.getItem(STORAGE_KEY_TASKS)) {
        localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(INITIAL_TASKS));
    }
};

const localData = {
    users: (): User[] => JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]'),
    elderly: (): ElderlyProfile[] => JSON.parse(localStorage.getItem(STORAGE_KEY_ELDERLY) || '[]'),
    tasks: (): Task[] => JSON.parse(localStorage.getItem(STORAGE_KEY_TASKS) || '[]'),
};

const localSave = {
    users: (d: User[]) => { localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(d)); notifyChange('USERS'); },
    elderly: (d: ElderlyProfile[]) => { localStorage.setItem(STORAGE_KEY_ELDERLY, JSON.stringify(d)); notifyChange('PROFILES'); },
    tasks: (d: Task[]) => { localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(d)); notifyChange('TASKS'); },
};

if (typeof window !== 'undefined') initStorage();

// --- DATA MAPPING HELPERS (Supabase -> App Types) ---
const mapSupabaseTask = (t: any): Task => ({
    id: t.id,
    title: t.title,
    description: t.description || '',
    elderlyId: t.elderly_id,
    assignedToId: t.assigned_to_id,
    createdBy: t.created_by,
    scheduledAt: t.scheduled_at,
    completedAt: t.completed_at,
    status: t.status as TaskStatus,
    priority: t.priority as any,
    type: t.type as any
});

const mapSupabaseProfile = (p: any): User => ({
    id: p.id,
    name: p.name || 'Sem nome',
    email: p.email || '',
    role: p.role as Role,
    avatarUrl: p.avatar_url || '',
    color: 'bg-blue-100 text-blue-800',
    password: '' // Auth handled by Supabase
});

const mapSupabaseElderly = (e: any): ElderlyProfile => ({
    id: e.id,
    name: e.name,
    gender: e.gender,
    avatarUrl: e.avatar_url,
    conditions: e.conditions || [],
    notes: e.notes || ''
});


export const db = {
  // --- REALTIME SUBSCRIPTION ---
  subscribeToChanges: (callback: () => void) => {
      if (isCloudMode && supabase) {
          // Cloud Realtime
          const ch = supabase.channel('global_changes')
            .on('postgres_changes', { event: '*', schema: 'public' }, () => {
                callback();
            })
            .subscribe();
          return () => { supabase?.removeChannel(ch); };
      } else {
          // Local Realtime
          const handler = (event: MessageEvent) => {
              if (event.data?.type === 'DB_UPDATE') callback();
          };
          channel.addEventListener('message', handler);
          return () => channel.removeEventListener('message', handler);
      }
  },

  // --- AUTH ---
  login: async (email: string, password?: string): Promise<ActionResponse<User>> => {
    if (isCloudMode && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: password || '' });
        if (error) return { success: false, error: error.message };
        
        // Fetch profile details
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
        if (profile) return { success: true, data: mapSupabaseProfile(profile) };
        return { success: false, error: 'Perfil não encontrado.' };
    } else {
        await new Promise(r => setTimeout(r, 500));
        const users = localData.users();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() || u.email.split('@')[0] === email.toLowerCase());
        
        if (!user) return { success: false, error: 'Usuário não encontrado.' };
        if (user.password !== password) return { success: false, error: 'Senha incorreta.' };
        
        localStorage.setItem(STORAGE_KEY_SESSION, user.id);
        return { success: true, data: user };
    }
  },

  signup: async (name: string, email: string, password: string): Promise<ActionResponse<User>> => {
    if (isCloudMode && supabase) {
        const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
        if (authError) return { success: false, error: authError.message };
        if (!authData.user) return { success: false, error: "Erro ao criar usuário." };

        // Create profile
        const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4`;
        const { error: profileError } = await supabase.from('profiles').insert({
            id: authData.user.id,
            email,
            name,
            avatar_url: avatarUrl,
            role: 'MEMBER'
        });

        if (profileError) return { success: false, error: profileError.message };
        
        return { success: true, data: { id: authData.user.id, name, email, role: 'MEMBER', avatarUrl, color: '', password: '' } };

    } else {
        await new Promise(r => setTimeout(r, 500));
        const users = localData.users();
        if (users.find(u => u.email === email)) return { success: false, error: 'Email já cadastrado.' };

        const newUser: User = {
            id: `u${Date.now()}`,
            name,
            email,
            password,
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4`,
            role: 'MEMBER',
            color: 'bg-indigo-100 text-indigo-800'
        };
        localSave.users([...users, newUser]);
        localStorage.setItem(STORAGE_KEY_SESSION, newUser.id);
        return { success: true, data: newUser };
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    if (isCloudMode && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return null;
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        return profile ? mapSupabaseProfile(profile) : null;
    } else {
        const id = localStorage.getItem(STORAGE_KEY_SESSION);
        if (!id) return null;
        return localData.users().find(u => u.id === id) || null;
    }
  },

  logout: async () => {
    if (isCloudMode && supabase) {
        await supabase.auth.signOut();
    } else {
        localStorage.removeItem(STORAGE_KEY_SESSION);
    }
  },

  // --- READS ---
  getUsers: async (): Promise<User[]> => {
    if (isCloudMode && supabase) {
        const { data } = await supabase.from('profiles').select('*');
        return (data || []).map(mapSupabaseProfile);
    }
    return localData.users();
  },

  getTasks: async (): Promise<Task[]> => {
    if (isCloudMode && supabase) {
        const { data } = await supabase.from('tasks').select('*');
        return (data || []).map(mapSupabaseTask);
    }
    return localData.tasks();
  },

  getElderlyProfiles: async (): Promise<ElderlyProfile[]> => {
    if (isCloudMode && supabase) {
        const { data } = await supabase.from('elderly_profiles').select('*');
        return (data || []).map(mapSupabaseElderly);
    }
    return localData.elderly();
  },

  // --- WRITES (TASKS) ---
  createTask: async (task: Task): Promise<ActionResponse<Task>> => {
    if (isCloudMode && supabase) {
        const { data, error } = await supabase.from('tasks').insert({
            title: task.title,
            description: task.description,
            elderly_id: task.elderlyId,
            assigned_to_id: task.assignedToId,
            created_by: task.createdBy,
            scheduled_at: task.scheduledAt,
            status: task.status,
            priority: task.priority,
            type: task.type
        }).select().single();
        
        if (error) return { success: false, error: error.message };
        return { success: true, data: mapSupabaseTask(data) };
    } else {
        const tasks = localData.tasks();
        localSave.tasks([...tasks, task]);
        return { success: true, data: task };
    }
  },

  assignTask: async (taskId: string, userId: string | null): Promise<ActionResponse<Task>> => {
    if (isCloudMode && supabase) {
        const { data, error } = await supabase.from('tasks').update({ assigned_to_id: userId }).eq('id', taskId).select().single();
        if (error) return { success: false, error: error.message };
        return { success: true, data: mapSupabaseTask(data) };
    } else {
        const tasks = localData.tasks();
        const index = tasks.findIndex(t => t.id === taskId);
        if (index === -1) return { success: false, error: 'Task not found' };
        tasks[index] = { ...tasks[index], assignedToId: userId };
        localSave.tasks(tasks);
        return { success: true, data: tasks[index] };
    }
  },

  updateTaskStatus: async (taskId: string, status: TaskStatus): Promise<ActionResponse<Task>> => {
    if (isCloudMode && supabase) {
        const completedAt = status === TaskStatus.COMPLETED ? new Date().toISOString() : null;
        const { data, error } = await supabase.from('tasks').update({ status, completed_at: completedAt }).eq('id', taskId).select().single();
        if (error) return { success: false, error: error.message };
        return { success: true, data: mapSupabaseTask(data) };
    } else {
        const tasks = localData.tasks();
        const index = tasks.findIndex(t => t.id === taskId);
        if (index === -1) return { success: false, error: 'Task not found' };
        tasks[index] = { 
          ...tasks[index], 
          status,
          completedAt: status === TaskStatus.COMPLETED ? new Date().toISOString() : undefined
        };
        localSave.tasks(tasks);
        return { success: true, data: tasks[index] };
    }
  },

  deleteTask: async (taskId: string): Promise<ActionResponse<void>> => {
      if (isCloudMode && supabase) {
          await supabase.from('tasks').delete().eq('id', taskId);
          return { success: true };
      } else {
          const tasks = localData.tasks().filter(t => t.id !== taskId);
          localSave.tasks(tasks);
          return { success: true };
      }
  },

  // --- WRITES (ELDERLY) ---
  createElderlyProfile: async (profile: ElderlyProfile): Promise<ActionResponse<ElderlyProfile>> => {
      if (isCloudMode && supabase) {
          const { data, error } = await supabase.from('elderly_profiles').insert({
              name: profile.name,
              gender: profile.gender,
              avatar_url: profile.avatarUrl,
              conditions: profile.conditions,
              notes: profile.notes
          }).select().single();
          if (error) return { success: false, error: error.message };
          return { success: true, data: mapSupabaseElderly(data) };
      } else {
          const list = localData.elderly();
          localSave.elderly([...list, profile]);
          return { success: true, data: profile };
      }
  },

  deleteElderlyProfile: async (id: string): Promise<ActionResponse<void>> => {
      if (isCloudMode && supabase) {
          await supabase.from('elderly_profiles').delete().eq('id', id);
          return { success: true };
      } else {
          const list = localData.elderly().filter(e => e.id !== id);
          localSave.elderly(list);
          const tasks = localData.tasks().filter(t => t.elderlyId !== id);
          localSave.tasks(tasks);
          return { success: true };
      }
  },

  // --- WRITES (USERS) ---
  updateUserRole: async (userId: string, newRole: Role): Promise<ActionResponse<User>> => {
      if (isCloudMode && supabase) {
          const { data, error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId).select().single();
          if (error) return { success: false, error: error.message };
          return { success: true, data: mapSupabaseProfile(data) };
      } else {
        const users = localData.users();
        const index = users.findIndex(u => u.id === userId);
        if (index === -1) return { success: false, error: 'User not found' };
        const updatedUser = { ...users[index], role: newRole };
        const newUsers = [...users];
        newUsers[index] = updatedUser;
        localSave.users(newUsers);
        return { success: true, data: updatedUser };
      }
  },

  deleteUser: async (userId: string): Promise<ActionResponse<void>> => {
      if (isCloudMode && supabase) {
          // Note: In real Supabase, deleting a user from 'auth.users' requires Service Role Key (Admin backend).
          // Client-side 'delete' on 'auth.users' is restricted. 
          // For this demo, we will just delete from 'profiles' table to simulate removal from UI.
          // In a real app, you would call a Supabase Edge Function to delete the auth user.
          await supabase.from('profiles').delete().eq('id', userId);
          
          // Unassign tasks
          await supabase.from('tasks').update({ assigned_to_id: null }).eq('assigned_to_id', userId);
          return { success: true };
      } else {
        const users = localData.users().filter(u => u.id !== userId);
        localSave.users(users);
        const tasks = localData.tasks().map(t => 
            t.assignedToId === userId ? { ...t, assignedToId: null } : t
        );
        localSave.tasks(tasks);
        return { success: true };
      }
  }
};