import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, of, map } from 'rxjs';
import { RpcBusinessException } from '../exceptions/business.exception';

@Catch(RpcBusinessException)
export class RpcBusinessExceptionFilter
  implements RpcExceptionFilter<RpcBusinessException>
{
  catch(exception: RpcBusinessException, host: ArgumentsHost): Observable<any> {
    return of(exception.getError()).pipe(
      map((data: any) => ({
        errno: data.errno,
        message: data.message,
        timestamp: new Date().toISOString(),
        data: null,
        extra: {},
      })),
    );
  }
}
