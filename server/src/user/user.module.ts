import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserMongooseModule } from './user.model';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [UserMongooseModule, TaskModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
