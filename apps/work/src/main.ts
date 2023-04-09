import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { WorkModule } from './work.module';

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
  await app.listen();
}
bootstrap();
