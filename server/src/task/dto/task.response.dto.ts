import { Task, TaskStatus } from '../task.model';

export class TaskResponseDto {
  id: string;
  title: string;
  status: TaskStatus;
  dayKey: string;
  order: number;
  createdAt: string;
  updatedAt: string;

  public static fromEntity(entity: Task): TaskResponseDto {
    return {
      id: entity._id,
      title: entity.title,
      status: entity.status ?? TaskStatus.TODO,
      dayKey: entity.dayKey,
      order: entity.order,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
