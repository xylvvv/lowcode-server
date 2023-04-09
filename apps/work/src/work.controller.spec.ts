import { Test, TestingModule } from '@nestjs/testing';
import { WorkController } from './work.controller';
import { WorkService } from './work.service';

describe('WorkController', () => {
  let workController: WorkController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WorkController],
      providers: [WorkService],
    }).compile();

    workController = app.get<WorkController>(WorkController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(workController.getHello()).toBe('Hello World!');
    });
  });
});
