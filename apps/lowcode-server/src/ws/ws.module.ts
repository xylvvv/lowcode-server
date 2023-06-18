import { Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';
import { AuthModule } from '../auth/auth.module';
import { ThirdPartyModule } from '../third-party/third-party.module';

@Module({
  imports: [AuthModule, ThirdPartyModule],
  providers: [WsGateway],
})
export class WsModule {}
