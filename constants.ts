import { ElderlyProfile, Task, TaskPriority, TaskStatus, TaskType, User } from './types';
import { addHours, startOfDay } from 'date-fns';

export const MOCK_USERS: User[] = [
  {
    id: 'admin_user',
    name: 'Administrador',
    email: 'admin', 
    password: 'admin052905', 
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=b6e3f4',
    role: 'ADMIN',
    color: 'bg-slate-800 text-white'
  },
  {
    id: 'u1',
    name: 'Ana Silva',
    email: 'ana@example.com',
    password: '123',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana&backgroundColor=c0aede',
    role: 'ADMIN',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'u2',
    name: 'Carlos Santos',
    email: 'carlos@example.com',
    password: '123',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos&backgroundColor=d1d4f9',
    role: 'MEMBER',
    color: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 'u3',
    name: 'Beatriz Costa',
    email: 'bia@example.com',
    password: '123',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bia&backgroundColor=ffdfbf',
    role: 'MEMBER',
    color: 'bg-purple-100 text-purple-800'
  }
];

export const MOCK_ELDERLY: ElderlyProfile[] = [
  {
    id: 'e1',
    name: 'Vô Roberto',
    gender: 'MALE',
    // Random simple URL
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto&backgroundColor=b6e3f4',
    conditions: ['Hipertensão', 'Diabetes Tipo 2'],
    notes: 'Precisa de ajuda para caminhar longas distâncias.'
  },
  {
    id: 'e2',
    name: 'Vó Maria',
    gender: 'FEMALE',
    // Random simple URL
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria&backgroundColor=b6e3f4',
    conditions: ['Alzheimer (Leve)'],
    notes: 'Gosta de ouvir música antiga durante o almoço.'
  }
];

// Generate dynamic tasks relative to "Today" to make the demo feel alive
const today = startOfDay(new Date());

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Remédio da Pressão',
    description: 'Losartana 50mg - Checar se tomou com água.',
    elderlyId: 'e1',
    assignedToId: 'u1',
    createdBy: 'u1',
    scheduledAt: addHours(today, 8).toISOString(),
    status: TaskStatus.COMPLETED,
    priority: TaskPriority.HIGH,
    type: TaskType.MEDICATION
  },
  {
    id: 't2',
    title: 'Café da Manhã',
    description: 'Evitar muito açúcar. Frutas e aveia.',
    elderlyId: 'e2',
    assignedToId: null, // Unassigned
    createdBy: 'u1',
    scheduledAt: addHours(today, 9).toISOString(),
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM,
    type: TaskType.MEAL
  },
  {
    id: 't3',
    title: 'Banho Assistido',
    description: 'Cuidado com o piso molhado. Usar cadeira de banho.',
    elderlyId: 'e2',
    assignedToId: null, // Unassigned
    createdBy: 'u1',
    scheduledAt: addHours(today, 10).toISOString(),
    status: TaskStatus.PENDING,
    priority: TaskPriority.HIGH,
    type: TaskType.HYGIENE
  },
  {
    id: 't4',
    title: 'Caminhada no Parque',
    description: '15 minutos apenas se estiver sol.',
    elderlyId: 'e1',
    assignedToId: 'u2',
    createdBy: 'u1',
    scheduledAt: addHours(today, 16).toISOString(),
    status: TaskStatus.PENDING,
    priority: TaskPriority.LOW,
    type: TaskType.ACTIVITY
  },
  {
    id: 't5',
    title: 'Insulina',
    description: 'Verificar glicemia antes.',
    elderlyId: 'e1',
    assignedToId: null,
    createdBy: 'u1',
    scheduledAt: addHours(today, 20).toISOString(),
    status: TaskStatus.PENDING,
    priority: TaskPriority.CRITICAL,
    type: TaskType.MEDICATION
  }
];