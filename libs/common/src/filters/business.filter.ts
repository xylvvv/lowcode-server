import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { of, map } from 'rxjs';

import { BusinessException } from '../exceptions/business.exception';

@Catch(BusinessException)
export class BusinessExceptionFilter implements ExceptionFilter {
  catch(exception: BusinessException, host: ArgumentsHost) {
    const contextType = host.getType();
    if (contextType === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();

      response.status(HttpStatus.OK).json({
        errno: exception.errno,
        message: exception.message,
        data: null,
        timestamp: new Date().toISOString(),
        extra: {},
      });
    } else if (contextType === 'rpc') {
      return of(exception).pipe(
        map((data: any) => ({
          errno: data.errno,
          message: data.message,
          data: null,
          timestamp: new Date().toISOString(),
          extra: {},
        })),
      );
    }
  }
}
