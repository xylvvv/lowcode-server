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
import { TaskService } from '../task/task.service';
import CloudBuildTask from './models/CloudBuildTask';

@WebSocketGateway(80, { namespace: 'cloudbuild' })
@UseGuards(WsGuard)
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger(WsGateway.name);

  @Inject(TaskService)
  private taskService: TaskService;

  @SubscribeMessage('build')
  async build(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    try {
      const task = new CloudBuildTask(client.handshake.query, {
        logger: (msg: string) => {
          client.emit('building', msg);
          this.logger.log(msg);
        },
        taskService: this.taskService,
      });
      await task.run();
      client.emit('complete');
    } catch (error) {
      this.logger.error(error);
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
