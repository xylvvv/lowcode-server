import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RESOURCE_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'resource',
          protoPath: 'apps/user-server/src/proto/resource.proto',
          url: 'localhost:5001',
        },
      },
    ]),
  ],
  controllers: [ResourceController],
  providers: [ResourceService],
})
export class ResourceModule {}
