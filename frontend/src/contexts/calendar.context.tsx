import { createContext, useContext } from 'react';
import type { Task, TasksByDay, TaskStatus } from '../infrastructure/dto/task/task.ts';

export interface CalendarContextValue {
  tasks: Task[];
  isLoading: boolean;
  searchQuery: string;
  tasksByDay: TasksByDay;
  filteredTasksByDay: TasksByDay;
  addTask: (dayKey: string, title: string) => void;
  updateTask: (taskId: string, fields: { title?: string; status?: TaskStatus }) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, toDayKey: string, toIndex: number) => void;
  reorderTasks: (dayKey: string, taskIds: string[]) => void;
  setSearch: (query: string) => void;
}

export const CalendarContext = createContext<CalendarContextValue | null>(null);

export const useCalendar = () => {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error('useCalendar must be inside CalendarProvider');
  return ctx;
};
