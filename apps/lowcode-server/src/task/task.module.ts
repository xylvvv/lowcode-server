import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TaskService } from './task.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TASK_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'task',
          protoPath: 'apps/task/src/proto/task.proto',
          url: 'localhost:5006',
        },
      },
    ]),
  ],
  controllers: [],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
