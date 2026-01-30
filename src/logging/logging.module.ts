import { Module } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { LoggingController } from './logging.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './entities/log.entity';

@Module({
  providers: [LoggingService],
  controllers: [LoggingController],
  imports: [TypeOrmModule.forFeature([Log])]
})
export class LoggingModule {}
