import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { UserController } from './controllers/user.controller';
import { UserService } from './user.service';
import { ProfileController } from './controllers/profile.controller';

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
