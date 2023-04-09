import { Test, TestingModule } from '@nestjs/testing';
import { LowcodeServerController } from './lowcode-server.controller';
import { LowcodeServerService } from './lowcode-server.service';

describe('LowcodeServerController', () => {
  let lowcodeServerController: LowcodeServerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LowcodeServerController],
      providers: [LowcodeServerService],
    }).compile();

    lowcodeServerController = app.get<LowcodeServerController>(LowcodeServerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(lowcodeServerController.getHello()).toBe('Hello World!');
    });
  });
});
