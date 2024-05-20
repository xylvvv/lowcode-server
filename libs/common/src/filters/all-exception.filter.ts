import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { of, map } from 'rxjs';
import { ERRNO_ENUM } from '../enums/errno.enum';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const contextType = host.getType();
    if (contextType === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();

      const message = exception['message'];
      let status;
      let extra = {};

      if (exception instanceof HttpException) {
        const res = exception.getResponse();
        status = exception.getStatus();
        extra = res['message'];
      } else {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
      }

      response.status(status).json({
        errno: status,
        message: message || 'Unknow Exception',
        data: null,
        timestamp: new Date().toISOString(),
        extra,
      });
    } else if (contextType === 'rpc') {
      return of(exception).pipe(
        map((data: any) => ({
          errno: ERRNO_ENUM.RPC_SERVER_ERROR,
          message: data.message,
          data: null,
          timestamp: new Date().toISOString(),
          extra: {},
        })),
      );
    }
  }
}
