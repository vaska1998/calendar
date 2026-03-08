import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user.response.dto';
import { CreateUpdateUserDto } from './dto/createUpdateUserDto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { type CurrentUser } from '../auth/current-user.type';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  async create(
    @Body() createUserDto: CreateUpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userService.create(createUserDto);
    return UserResponseDto.fromEntity(user);
  }

  @Post('/update')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async update(
    @GetUser() currentUser: CurrentUser,
    @Body() updateUserDto: CreateUpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userService.update(currentUser.id, updateUserDto);
    return UserResponseDto.fromEntity(user);
  }

  @Delete('/')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  delete(@GetUser() currentUser: CurrentUser) {
    return this.userService.delete(currentUser.id);
  }
}
