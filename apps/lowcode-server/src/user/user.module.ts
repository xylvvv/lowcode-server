import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { UserController } from './controllers/user.controller';
import { UserService } from './user.service';
import { ProfileController } from './controllers/profile.controller';

// 全局模块（所有模块不需要导入UserModule均可以注入其exports的service）
// 权限守卫依赖UserService，不设置为全局，则所有使用了权限守卫的模块均需要导入UserModule
@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: 'apps/user-server/src/proto/user.proto',
          url: 'localhost:5001',
        },
      },
    ]),
  ],
  controllers: [UserController, ProfileController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
