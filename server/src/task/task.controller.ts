import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
  ValidationPipe,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskResponseDto } from './dto/task.response.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { type CurrentUser } from '../auth/current-user.type';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('/')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() currentUser: CurrentUser,
  ): Promise<TaskResponseDto> {
    const task = await this.taskService.create(createTaskDto, currentUser.id);
    return TaskResponseDto.fromEntity(task);
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async findAll(
    @GetUser() currentUser: CurrentUser,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ): Promise<TaskResponseDto[]> {
    const tasks = await this.taskService.findAll(currentUser.id, from, to);
    return tasks.map((task) => TaskResponseDto.fromEntity(task));
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<TaskResponseDto> {
    const task = await this.taskService.findOne(id);
    return TaskResponseDto.fromEntity(task);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    const task = await this.taskService.update(id, updateTaskDto);
    return TaskResponseDto.fromEntity(task);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    return this.taskService.delete(id);
  }
}
