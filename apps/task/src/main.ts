import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { TaskModule } from './task.module';
import { AllExceptionsFilter } from '@lib/common/filters/all-exception.filter';
import { BusinessExceptionFilter } from '@lib/common/filters/business.filter';
import { TransformInterceptor } from '@lib/common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TaskModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'task',
        protoPath: join(__dirname, 'proto/task.proto'),
        url: 'localhost:5006',
      },
    },
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new BusinessExceptionFilter(),
  );
  await app.listen();
}
bootstrap();
