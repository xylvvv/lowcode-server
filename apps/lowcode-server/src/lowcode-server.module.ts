import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { WorkModule } from './work/work.module';

@Module({
  imports: [UserModule, AuthModule, WorkModule],
  controllers: [],
  providers: [],
})
export class LowcodeServerModule {}
