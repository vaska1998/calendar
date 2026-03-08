import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskMongooseModule } from './task.model';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [TaskMongooseModule],
  exports: [TaskService],
})
export class TaskModule {}
