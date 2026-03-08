import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.model';
import { Model } from 'mongoose';
import { CreateUpdateUserDto } from './dto/createUpdateUserDto';
import { TaskService } from '../task/task.service';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private taskService: TaskService,
  ) {}

  async create(createUserDto: CreateUpdateUserDto): Promise<UserDocument> {
    this.logger.log(`Creating user with email: ${createUserDto.email}`);
    const { email, firstName, lastName, confirmPassword, password } =
      createUserDto;
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already in use.');
    }

    if (password !== confirmPassword) {
      throw new ConflictException('Passwords do not match.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.userModel.create({
      email,
      firstName,
      lastName,
      password: hashedPassword,
    });

    await user.save();
    this.logger.log(`User created with ID: ${user._id}`);
    return user;
  }

  async findOneById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException(`User ${email} not found.`);
    }
    return user;
  }

  async update(
    id: string,
    updateUserDto: Partial<CreateUpdateUserDto>,
  ): Promise<UserDocument> {
    this.logger.log(`Updating user with ID: ${id}`);
    const { email, firstName, lastName, password, confirmPassword } =
      updateUserDto;

    const updateData: Partial<User> = {
      ...(email !== undefined ? { email } : {}),
      ...(firstName !== undefined ? { firstName } : {}),
      ...(lastName !== undefined ? { lastName } : {}),
    };

    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        throw new ConflictException('Passwords do not match.');
      }

      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const user = await this.userModel.findByIdAndUpdate(id, updateData, {
      returnDocument: 'after',
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    this.logger.log(`User updated with ID: ${user._id}`);
    return user;
  }

  async delete(id: string): Promise<void> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    this.logger.log(`Deleting user with ID: ${id}`);
    await this.taskService.deleteByUserId(id);
    await user.deleteOne();
  }
}
