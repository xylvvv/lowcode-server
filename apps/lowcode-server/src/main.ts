import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { LowcodeServerModule } from './lowcode-server.module';
import { AllExceptionsFilter } from '@lib/common/filters/all-exception.filter';
import { BusinessExceptionFilter } from '@lib/common/filters/business.filter';
import { TransformInterceptor } from '@lib/common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(LowcodeServerModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 去除属性上没有装饰器的字段
      transform: true, // 自动类型转换（普通js对象 -> DTO，基础类型转换）
      transformOptions: {
        enableImplicitConversion: true, // 根据ts反射的类型对属性类型进行隐式转换
      },
    }),
  );
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new BusinessExceptionFilter(),
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  app.setGlobalPrefix('/api');
  await app.listen(3000);
}
bootstrap();
