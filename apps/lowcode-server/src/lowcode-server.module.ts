import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { WorkModule } from './work/work.module';
import { LibraryModule } from './library/library.module';
import { ThirdPartyModule } from './third-party/third-party.module';
import { WsModule } from './ws/ws.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    WorkModule,
    LibraryModule,
    ThirdPartyModule,
    WsModule,
  ],
  controllers: [],
  providers: [],
})
export class LowcodeServerModule {}
