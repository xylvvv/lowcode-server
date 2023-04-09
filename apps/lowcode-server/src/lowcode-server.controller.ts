import { Controller, Get } from '@nestjs/common';
import { LowcodeServerService } from './lowcode-server.service';

@Controller()
export class LowcodeServerController {
  constructor(private readonly lowcodeServerService: LowcodeServerService) {}

  @Get()
  getHello(): string {
    return this.lowcodeServerService.getHello();
  }
}
