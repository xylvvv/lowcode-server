import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BusinessException } from '../exceptions/business.exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    // 处理业务异常
    if (exception instanceof BusinessException) {
      const error = exception.getResponse();
      response.status(HttpStatus.OK).json({
        errno: error['errno'],
        message: error['message'],
        timestamp: new Date().toISOString(),
        data: null,
        extra: {},
      });
      return;
    }

    response.status(status).json({
      errno: status,
      message: exception.message,
      data: exception.getResponse()['message'] || null,
      timestamp: new Date().toISOString(),
    });
  }
}
