import { resolve, join } from 'path';
import { Controller, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as OSS from 'ali-oss';
import { v4 as uuid } from 'uuid';
import * as dayjs from 'dayjs';
import * as glob from 'glob';
import axios from 'axios';
import { ErrorRes, SuccessRes } from '@lib/common/dto/res.dto';
import { ERRNO_ENUM } from '@lib/common/enums/errno.enum';
import { GrpcMethod } from '@nestjs/microservices';
import { MicroServiceType } from '@lib/common/types/micro-service.type';

@Controller()
export class OssController {
  constructor(private configService: ConfigService) {}
  private logger = new Logger(OssController.name);

  private client = new OSS({
    bucket: this.configService.get('OSS_BUCKET'),
    endpoint: this.configService.get('OSS_ENDPOINT'),
    accessKeyId: this.configService.get('OSS_ACCESS_KEY'),
    accessKeySecret: this.configService.get('OSS_SECRET_KEY'),
  });

  private baseURL = `https://${this.configService.get(
    'OSS_BUCKET',
  )}.${this.configService.get('OSS_ENDPOINT')}`;

  private request = axios.create({
    baseURL: this.baseURL,
  });

  @GrpcMethod('ThirdPartyService', 'Upload')
  async upload({ file, filename }: { file: Buffer; filename?: string }) {
    try {
      const name =
        filename || `${dayjs().format('YYYY-MM-DD')}/${uuid().slice(0, 6)}`;
      const { url } = await this.client.put(name, file);
      return new SuccessRes(url);
    } catch (error) {
      this.logger.error(error);
      return new ErrorRes({
        errno: ERRNO_ENUM.FILE_UPLOAD_FAILED,
        message: '上传失败',
      });
    }
  }

  @GrpcMethod('ThirdPartyService', 'Publish')
  async publish({ path, target }: { path: string; target: string }) {
    try {
      const tasks = glob
        .sync('**/*', {
          cwd: path,
          nodir: true,
        })
        .map((file) => {
          return this.client.put(join(target, file), resolve(path, file));
        });
      await Promise.all(tasks);
      return new SuccessRes(`${this.baseURL}/${target.replace('\\', '/')}`);
    } catch (error) {
      return new ErrorRes({
        errno: ERRNO_ENUM.FILE_UPLOAD_FAILED,
        message: '上传失败',
      });
    }
  }

  @GrpcMethod('ThirdPartyService', 'Read')
  async read({ file }: { file: string }) {
    try {
      const res = await this.request.get(file);
      return new SuccessRes(res.data);
    } catch (error) {
      return new ErrorRes({
        errno: ERRNO_ENUM.FILE_READ_FAILED,
        message: '读取失败',
      });
    }
  }
}

export type IThirdPartyMicroService = MicroServiceType<typeof OssController>;
