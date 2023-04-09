import { Test, TestingModule } from '@nestjs/testing';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';

describe('ChannelController', () => {
  let channelController: ChannelController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ChannelController],
      providers: [ChannelService],
    }).compile();

    channelController = app.get<ChannelController>(ChannelController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(channelController.getHello()).toBe('Hello World!');
    });
  });
});
