import { Module } from '@nestjs/common';
import { ThirdPartyController } from './third-party.controller';
import { ThirdPartyService } from './third-party.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'THIRD_PARTY_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'third_party',
          protoPath: 'apps/third-party/src/proto/third-party.proto',
          url: 'localhost:5005',
        },
      },
    ]),
  ],
  controllers: [ThirdPartyController],
  providers: [ThirdPartyService],
  exports: [ThirdPartyService],
})
export class ThirdPartyModule {}
