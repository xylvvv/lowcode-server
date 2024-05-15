import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { WorkModule } from './work.module';
import { AllExceptionsFilter } from '@lib/common/filters/all-exception.filter';
import { BusinessExceptionFilter } from '@lib/common/filters/business.filter';
import { TransformInterceptor } from '@lib/common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    WorkModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'work',
        protoPath: join(__dirname, 'proto/work.proto'),
        url: 'localhost:5002',
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
