import { Test, TestingModule } from '@nestjs/testing';
import { MongodbController } from './mongodb.controller';

describe('MongodbController', () => {
  let controller: MongodbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MongodbController],
    }).compile();

    controller = module.get<MongodbController>(MongodbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
