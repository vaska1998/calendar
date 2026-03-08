import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshReqDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
