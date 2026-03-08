export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  TODO: '#42a5f5',
  IN_PROGRESS: '#ffa726',
  DONE: '#66bb6a',
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  dayKey: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};
export type TasksByDay = Record<string, Task[]>;
