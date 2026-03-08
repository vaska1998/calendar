import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TaskStatus } from '../task.model';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  dayKey: string;

  @IsNumber()
  order: number;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
