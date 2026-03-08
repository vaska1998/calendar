import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './task.model';
import { Model } from 'mongoose';

@Injectable()
export class TaskService {
  private logger = new Logger(TaskService.name);

  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<TaskDocument> {
    this.logger.log(`Creating task: ${JSON.stringify(createTaskDto)}`);
    const task = await this.taskModel.create({
      ...createTaskDto,
      userId,
    });

    await task.save();
    this.logger.log(`Task created: ${JSON.stringify(task)}`);
    return task;
  }

  async findAll(
    userId: string,
    from?: string,
    to?: string,
  ): Promise<TaskDocument[]> {
    const filter: Record<string, unknown> = { userId };
    if (from && to) {
      filter.dayKey = { $gte: from, $lte: to };
    }
    return this.taskModel.find(filter).exec();
  }

  async findOne(id: string): Promise<TaskDocument> {
    const task: TaskDocument | null = await this.taskModel.findById(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskDocument> {
    const task = await this.taskModel.findByIdAndUpdate(id, updateTaskDto, {
      returnDocument: 'after',
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    this.logger.log(`Updated task: ${JSON.stringify(task)}`);
    return task;
  }

  async delete(id: string): Promise<void> {
    const task = await this.findOne(id);
    this.logger.log(`Deleting task: ${JSON.stringify(task)}`);
    await task.deleteOne();
  }

  async deleteByUserId(userId: string): Promise<void> {
    this.logger.log(`Deleting all tasks for user: ${userId}`);
    const result = await this.taskModel.deleteMany({ userId }).exec();
    this.logger.log(`Deleted ${result.deletedCount} tasks for user: ${userId}`);
  }
}
