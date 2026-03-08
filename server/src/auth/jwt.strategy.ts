import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy, type StrategyOptions } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthConstants } from './auth.constants';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AuthConstants.Jwt.secret,
    };
    super(options);
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
