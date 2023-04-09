/**
 * 基础模型，包括 errno data 和 message
 */
export class BaseRes<T = any> {
  errno: number;
  data?: T;
  message?: string;
  constructor({
    errno,
    data,
    message,
  }: {
    errno: number;
    data?: any;
    message?: string;
  }) {
    this.errno = errno;
    if (data) {
      this.data = data;
    }
    if (message) {
      this.message = message;
    }
  }
}

/**
 * 执行失败的数据模型
 */
export class ErrorRes extends BaseRes {
  constructor({ errno = -1, message = '', data = null }, addMessage = '') {
    super({
      errno,
      message: addMessage
        ? `${message} - ${addMessage}` // 有追加信息
        : message,
      data,
    });
  }
}

/**
 * 执行成功的数据模型
 */
export class SuccessRes extends BaseRes {
  constructor(data = {}) {
    super({
      errno: 0,
      data,
    });
  }
}
