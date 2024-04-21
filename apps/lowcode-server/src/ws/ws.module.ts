import { Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';
import { AuthModule } from '../auth/auth.module';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [AuthModule, TaskModule],
  providers: [WsGateway],
})
export class WsModule {}
