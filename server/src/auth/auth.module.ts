import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthConstants } from './auth.constants';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    UserModule,
    JwtModule.register({
      secret: AuthConstants.Jwt.secret,
      signOptions: { expiresIn: AuthConstants.Jwt.accessExpiresIn },
    }),
  ],
})
export class AuthModule {}
