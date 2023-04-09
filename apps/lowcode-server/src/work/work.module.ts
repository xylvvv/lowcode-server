import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WorkController } from './work.controller';
import { WorkService } from './work.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'WORK_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'work',
          protoPath: 'apps/work/src/proto/work.proto',
          url: 'localhost:5002',
        },
      },
    ]),
    UserModule,
  ],
  controllers: [WorkController],
  providers: [WorkService],
})
export class WorkModule {}
