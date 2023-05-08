import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'

@Controller('oss')
export class OssController {
  constructor(private configService: ConfigService) {}

  @Get()
  hello() {
    return this.configService.get('test') || 'hello'
  }
}
