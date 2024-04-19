import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { WorkModule } from './work.module';
import { TransformInterceptor } from '@lib/common/interceptors/transform.interceptor';
import { RpcBusinessExceptionFilter } from '@lib/common/filters/rpc-exception.filter';

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
  app.useGlobalFilters(new RpcBusinessExceptionFilter());
  await app.listen();
}
bootstrap();
