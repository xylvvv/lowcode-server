import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AuthModule } from '../auth/auth.module';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ROLE_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'role',
          protoPath: 'apps/user-server/src/proto/role.proto',
          url: 'localhost:5001',
        },
      },
    ]),
    AuthModule,
  ],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
