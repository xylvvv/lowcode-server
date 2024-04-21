import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OssController } from './oss.controller';
import { OssService } from './oss.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'OSS_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'oss',
          protoPath: 'apps/third-party/src/proto/oss.proto',
          url: 'localhost:5005',
        },
      },
    ]),
  ],
  controllers: [OssController],
  providers: [OssService],
  exports: [OssService],
})
export class ThirdPartyModule {}
