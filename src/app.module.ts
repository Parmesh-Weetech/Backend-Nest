import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PdfModule } from './pdf/pdf.module';
import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from './cache/cache.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [PdfModule, CacheModule, QueueModule, ConfigModule.forRoot({
    isGlobal: true,
    cache: true,
  }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');
        const redisHost = configService.get<string>('REDIS_HOST', 'localhost');
        const redisPort = configService.get<number>('REDIS_PORT', 6379);

        return {
          connection: redisUrl
            ? { url: redisUrl }
            : { host: redisHost, port: redisPort }
        };
      }
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
