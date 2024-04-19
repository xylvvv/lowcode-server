import { HttpException, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ERRNO_ENUM } from '../enums/errno.enum';

export class BusinessException extends HttpException {
  constructor(error: string);
  constructor(errno: ERRNO_ENUM, message: string);

  constructor(error: string | ERRNO_ENUM, message?: string) {
    if (error in ERRNO_ENUM) {
      super(
        {
          errno: error,
          message,
        },
        HttpStatus.OK,
      );
    } else {
      super(
        {
          errno: ERRNO_ENUM.COMMON,
          message: error,
        },
        HttpStatus.OK,
      );
    }
  }
}

export class RpcBusinessException extends RpcException {
  constructor(error: string);
  constructor(errno: ERRNO_ENUM, message: string);

  constructor(error: string | ERRNO_ENUM, message?: string) {
    if (error in ERRNO_ENUM) {
      super({
        errno: error,
        message,
      });
    } else {
      super({
        errno: ERRNO_ENUM.COMMON,
        message: error,
      });
    }
  }
}
