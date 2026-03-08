import { User } from '../user.model';

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;

  public static fromEntity(entity: User): UserResponseDto {
    return {
      id: entity._id,
      name: entity.firstName + ' ' + entity.lastName,
      email: entity.email,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
