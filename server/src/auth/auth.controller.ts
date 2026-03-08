import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninReqDto } from './dto/signin.req.dto';
import { RefreshReqDto } from './dto/refresh.req.dto';
import { SigninResDto } from './dto/signin.res.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInReqDto: SigninReqDto): Promise<SigninResDto> {
    return this.authService.signIn(signInReqDto);
  }

  @Post('/refresh')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshReqDto: RefreshReqDto): Promise<SigninResDto> {
    return this.authService.refresh(refreshReqDto.refreshToken);
  }
}
