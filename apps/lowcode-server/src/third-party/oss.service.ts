import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IOssMicroService } from 'apps/third-party/src/oss/oss.controller';
import { BusinessException } from '@lib/common/exceptions/business.exception';

@Injectable()
export class OssService implements OnModuleInit {
  private ossService: IOssMicroService;

  constructor(
    @Inject('OSS_PACKAGE')
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.ossService = this.client.getService<IOssMicroService>('OssService');
  }

  async upload(file: Buffer, filename?: string) {
    const res = await firstValueFrom(
      this.ossService.upload({ file, filename }),
    );
    if (res.errno) {
      throw new BusinessException(res.errno, res.message);
    }
    return res.data as string;
  }
}
