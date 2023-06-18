import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IThirdPartyMicroService } from 'apps/third-party/src/oss/oss.controller';

@Injectable()
export class ThirdPartyService implements OnModuleInit {
  private thirdPartyService: IThirdPartyMicroService;

  constructor(
    @Inject('THIRD_PARTY_PACKAGE')
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.thirdPartyService =
      this.client.getService<IThirdPartyMicroService>('ThirdPartyService');
  }

  async upload(file: Buffer, filename?: string) {
    return await firstValueFrom(
      this.thirdPartyService.upload({ file, filename }),
    );
  }

  async publish(path: string, target: string) {
    return await firstValueFrom(
      this.thirdPartyService.publish({ path, target }),
    );
  }

  async read(file: string) {
    return await firstValueFrom(this.thirdPartyService.read({ file }));
  }
}
