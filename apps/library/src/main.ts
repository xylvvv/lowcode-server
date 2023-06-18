import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { LibraryModule } from './library.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

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
  await app.listen();
}
bootstrap();
