import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { UserModule } from './user.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'user',
        protoPath: join(__dirname, 'proto/user.proto'),
        url: 'localhost:5001',
      },
    },
  );
  await app.listen();
}
bootstrap();
