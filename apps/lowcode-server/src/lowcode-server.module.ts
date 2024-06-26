import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { WorkModule } from './work/work.module';
import { LibraryModule } from './library/library.module';
import { ThirdPartyModule } from './third-party/third-party.module';
import { WsModule } from './ws/ws.module';
import { TaskModule } from './task/task.module';
import { ResourceModule } from './resource/resource.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    WorkModule,
    LibraryModule,
    ThirdPartyModule,
    WsModule,
    TaskModule,
    ResourceModule,
    RoleModule,
  ],
  controllers: [],
  providers: [],
})
export class LowcodeServerModule {}
