import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { LowcodeServerModule } from './lowcode-server.module';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { AllExceptionsFilter } from './filter/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(LowcodeServerModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // 去除在类上不存在的字段
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.setGlobalPrefix('/api');
  await app.listen(3000);
}
bootstrap();
