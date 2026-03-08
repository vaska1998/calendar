import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@ApiTags('Request')
export class SigninReqDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'Email of user',
    default: 'john.miller@email.com',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'Plaintext password of user',
    default: 'Password!#',
  })
  password: string;
}
