import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { JWT_SECRET } from './auth.const';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET, // Passport执行验证阶段使用的密钥
    });
  }

  // 接受验证并解码后的JSON（合法且未过期），返回为请求对象添加的用户对象
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
