import { Controller, Inject, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import * as OSS from 'ali-oss';
import { v4 as uuid } from 'uuid';
import * as dayjs from 'dayjs';

import { ERRNO_ENUM } from '@lib/common/enums/errno.enum';
import { MicroServiceType } from '@lib/common/types/micro-service.type';
import { BusinessException } from '@lib/common/exceptions/business.exception';

@Controller()
export class OssController {
  @Inject('OSS_CLIENT')
  private readonly client: OSS;

  private readonly logger = new Logger(OssController.name);

  @GrpcMethod('OssService', 'Upload')
  async upload({ file, filename }: { file: Buffer; filename?: string }) {
    try {
      const name =
        filename || `${dayjs().format('YYYY-MM-DD')}/${uuid().slice(0, 6)}`;
      const { url } = await this.client.put(name, file);
      return url;
    } catch (error) {
      this.logger.error(error);
      throw new BusinessException(ERRNO_ENUM.FILE_UPLOAD_FAILED, '上传失败');
    }
  }

  // @GrpcMethod('OssService', 'Publish')
  // async publish({ path, target }: { path: string; target: string }) {
  //   try {
  //     const tasks = glob
  //       .sync('**/*', {
  //         cwd: path,
  //         nodir: true,
  //       })
  //       .map((file) => {
  //         return this.client.put(join(target, file), resolve(path, file));
  //       });
  //     await Promise.all(tasks);
  //     return `${this.baseURL}/${target.replace('\\', '/')}`;
  //   } catch (error) {
  //     throw new BusinessException(ERRNO_ENUM.FILE_UPLOAD_FAILED, '上传失败');
  //   }
  // }

  // @GrpcMethod('OssService', 'Read')
  // async read({ file }: { file: string }) {
  //   try {
  //     const res = await this.request.get(file);
  //     return res.data;
  //   } catch (error) {
  //     throw new BusinessException(ERRNO_ENUM.FILE_READ_FAILED, '读取失败');
  //   }
  // }
}

export type IOssMicroService = MicroServiceType<typeof OssController>;
