import { Injectable } from '@nestjs/common';

@Injectable()
export class LowcodeServerService {
  getHello(): string {
    return 'Hello World!';
  }
}
