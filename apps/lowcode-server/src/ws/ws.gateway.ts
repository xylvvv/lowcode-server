import { Inject, Logger, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { WsGuard } from '../auth/ws-auth.guard';
import CloudBuildTask from './models/CloudBuildTask';
import { OssService } from '../third-party/oss.service';

const REDIS_PREFIX = 'cloudbuild';

@WebSocketGateway(80, { namespace: 'cloudbuild' })
@UseGuards(WsGuard)
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger(WsGateway.name);

  @Inject(OssService)
  private ossService: OssService;

  @SubscribeMessage('build')
  async build(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    try {
      const task = new CloudBuildTask(client.handshake.query, {
        client,
        logger: this.logger,
        ossService: this.ossService,
      });
      await task.run();
      client.emit('complete');
    } catch (error) {
      client.emit('error', error?.message || error);
    }
  }

  handleConnection(client: Socket) {
    this.logger.log(`client ${client.id} connect...`);
    // const hasTask = await RedisContext.get(`${REDIS_PREFIX}:${id}`)
    // if (!hasTask) {
    //   await redis.set(`${REDIS_PREFIX}:${id}`, JSON.stringify(client.handshake.query))
    // }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`client ${client.id} disconnect...`);
  }
}
