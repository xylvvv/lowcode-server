import { NestFactory } from '@nestjs/core';
import { ThirdPartyModule } from './third-party.module';

async function bootstrap() {
  const app = await NestFactory.create(ThirdPartyModule);
  await app.listen(3000);
}
bootstrap();
