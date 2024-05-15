import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { LibraryModule } from './library.module';
import { AllExceptionsFilter } from '@lib/common/filters/all-exception.filter';
import { BusinessExceptionFilter } from '@lib/common/filters/business.filter';
import { TransformInterceptor } from '@lib/common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    LibraryModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'library',
        protoPath: join(__dirname, 'proto/library.proto'),
        url: 'localhost:5004',
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
