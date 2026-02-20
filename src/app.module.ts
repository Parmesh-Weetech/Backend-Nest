import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PdfModule } from './pdf/pdf.module';
import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from './cache/cache.module';
import { QueueModule } from './queue/queue.module';
import { VideoModule } from './video/video.module';
import { FfmpegModule } from './ffmpeg/ffmpeg.module';
import { GeoLocationModule } from './geo_location/geo_location.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [PdfModule, CacheModule, QueueModule, ConfigModule.forRoot({
    isGlobal: true,
    cache: true,
  }),
    ScheduleModule.forRoot(),
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
    VideoModule,
    FfmpegModule,
    GeoLocationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
