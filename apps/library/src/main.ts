import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { LibraryModule } from './library.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TransformInterceptor } from '@lib/common/interceptors/transform.interceptor';
import { RpcBusinessExceptionFilter } from '@lib/common/filters/rpc-exception.filter';

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
  app.useGlobalFilters(new RpcBusinessExceptionFilter());
  await app.listen();
}
bootstrap();
