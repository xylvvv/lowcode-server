import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IOssMicroService } from 'apps/third-party/src/oss/oss.controller';

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
    return await firstValueFrom(this.ossService.upload({ file, filename }));
  }

  async publish(path: string, target: string) {
    return await firstValueFrom(this.ossService.publish({ path, target }));
  }

  async read(file: string) {
    return await firstValueFrom(this.ossService.read({ file }));
  }
}
