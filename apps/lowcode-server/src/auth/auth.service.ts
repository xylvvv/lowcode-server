import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  sign(payload: any) {
    return this.jwtService.sign(payload);
  }

  verify(token = '') {
    try {
      return this.jwtService.verify(token.split(/\s+/)[1]);
    } catch (error) {
      return false;
    }
  }
}
