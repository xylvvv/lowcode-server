import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { LowcodeServerModule } from './lowcode-server.module';
import { HttpExceptionFilter } from '@lib/common/filters/http-exception.filter';
import { AllExceptionsFilter } from '@lib/common/filters/all-exception.filter';
import { TransformInterceptor } from '@lib/common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(LowcodeServerModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // 去除在类上不存在的字段
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.setGlobalPrefix('/api');
  await app.listen(3000);
}
bootstrap();
