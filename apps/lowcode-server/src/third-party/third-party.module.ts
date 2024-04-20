import { Module } from '@nestjs/common';
import { OssController } from './oss.controller';
import { OssService } from './oss.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
      {
        name: 'JENKINS_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'jenkins',
          protoPath: 'apps/third-party/src/proto/jenkins.proto',
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
