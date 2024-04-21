import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BullModule } from '@nestjs/bull';
import { TaskController } from './task.controller';
import { TaskConsumer } from './task.consumer';
import { JenkinsService } from './jenkins.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'task',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    ClientsModule.register([
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
  controllers: [TaskController],
  providers: [TaskConsumer, JenkinsService],
})
export class TaskModule {}
