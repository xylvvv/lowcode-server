import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { ThirdPartyModule } from './third-party.module';
import { AllExceptionsFilter } from '@lib/common/filters/all-exception.filter';
import { BusinessExceptionFilter } from '@lib/common/filters/business.filter';
import { TransformInterceptor } from '@lib/common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ThirdPartyModule,
    {
      transport: Transport.GRPC,
      options: {
        package: ['oss', 'jenkins'],
        protoPath: [
          join(__dirname, 'proto/oss.proto'),
          join(__dirname, 'proto/jenkins.proto'),
        ],
        url: 'localhost:5005',
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
