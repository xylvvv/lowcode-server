import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { ThirdPartyModule } from './third-party.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TransformInterceptor } from '@lib/common/interceptors/transform.interceptor';
import { RpcBusinessExceptionFilter } from '@lib/common/filters/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ThirdPartyModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'third_party',
        protoPath: join(__dirname, 'proto/third-party.proto'),
        url: 'localhost:5005',
      },
    },
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new RpcBusinessExceptionFilter());
  await app.listen();
}
bootstrap();
