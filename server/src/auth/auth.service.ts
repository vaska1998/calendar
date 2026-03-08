import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SigninReqDto } from './dto/signin.req.dto';
import { SigninResDto } from './dto/signin.res.dto';
import { User } from '../user/user.model';
import bcrypt from 'bcryptjs';
import { JwtPayload } from './jwt-payload.interface';
import { AuthConstants } from './auth.constants';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInReqDto: SigninReqDto): Promise<SigninResDto> {
    this.logger.log(`Signing in with email: ${signInReqDto.email}`);
    const { email, password } = signInReqDto;
    const user = await this.validatePassword(email, password);
    return this.generateTokenPair(user);
  }

  async refresh(refreshToken: string): Promise<SigninResDto> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: AuthConstants.Jwt.refreshSecret,
      });
      this.logger.log(`Refreshing tokens for user: ${payload.id}`);
      const user = await this.userService.findOneById(payload.id);
      return this.generateTokenPair(user);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async validatePassword(email: string, password: string): Promise<User> {
    const foundUser = await this.userService.getByEmail(email);
    const passwordMatches = await bcrypt.compare(password, foundUser.password);
    if (!passwordMatches) {
      throw new BadRequestException();
    }
    return foundUser;
  }

  private generateTokenPair(user: User): SigninResDto {
    const { email, _id, firstName, lastName } = user;
    const payload: JwtPayload = {
      id: _id,
      email,
      firstName,
      lastName,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: AuthConstants.Jwt.secret,
      expiresIn: AuthConstants.Jwt.accessExpiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: AuthConstants.Jwt.refreshSecret,
      expiresIn: AuthConstants.Jwt.refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }
}
