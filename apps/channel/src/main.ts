import { NestFactory } from '@nestjs/core';
import { ChannelModule } from './channel.module';

async function bootstrap() {
  const app = await NestFactory.create(ChannelModule);
  await app.listen(3000);
}
bootstrap();
