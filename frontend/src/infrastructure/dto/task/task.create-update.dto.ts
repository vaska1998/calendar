import type { TaskStatus } from './task.ts';

export type TaskCreateUpdateDto = {
  title: string;
  dayKey: string;
  order: number;
  status?: TaskStatus;
};
