import { ERRNO_ENUM } from '../enums/errno.enum';

export class BusinessException extends Error {
  errno: ERRNO_ENUM = ERRNO_ENUM.COMMON;
  message: string;

  constructor(error: string);
  constructor(errno: ERRNO_ENUM, message: string);

  constructor(error: string | ERRNO_ENUM, message?: string) {
    super();
    if (error in ERRNO_ENUM) {
      this.errno = error as ERRNO_ENUM;
      this.message = message;
    } else {
      this.message = error as string;
    }
  }
}
