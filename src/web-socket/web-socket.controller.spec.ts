import { Test, TestingModule } from '@nestjs/testing';
import { WebSocketController } from './web-socket.controller';

describe('WebSocketController', () => {
  let controller: WebSocketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebSocketController],
    }).compile();

    controller = module.get<WebSocketController>(WebSocketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
