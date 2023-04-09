import { Module } from '@nestjs/common';
import { LowcodeServerController } from './lowcode-server.controller';
import { LowcodeServerService } from './lowcode-server.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { WorkModule } from './work/work.module';

@Module({
  imports: [UserModule, AuthModule, WorkModule],
  controllers: [LowcodeServerController],
  providers: [LowcodeServerService],
})
export class LowcodeServerModule {}
