import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

import { UserServerModule } from './user-server.module';
import { AllExceptionsFilter } from '@lib/common/filters/all-exception.filter';
import { BusinessExceptionFilter } from '@lib/common/filters/business.filter';
import { TransformInterceptor } from '@lib/common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserServerModule,
    {
      transport: Transport.GRPC,
      options: {
        package: ['user', 'resource', 'role'],
        protoPath: [
          join(__dirname, 'proto/user.proto'),
          join(__dirname, 'proto/resource.proto'),
          join(__dirname, 'proto/role.proto'),
        ],
        url: 'localhost:5001',
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
