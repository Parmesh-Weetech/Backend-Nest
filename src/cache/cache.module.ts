import { Module, Global } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import KeyvRedis from '@keyv/redis';
import Keyv from 'keyv';

import { CacheService } from './cache.service';
import Redis from 'ioredis';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NestCacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisURL = configService.get<string>('REDIS_URL');
        const redisStore = new KeyvRedis(redisURL);

        const keyv = new Keyv({
          store: redisStore,
          namespace: 'nest-cache',
        });

        return {
          store: keyv,
          ttl: 300_000,
        };
      },
    }),
  ],
  providers: [
    CacheService,
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new Redis(configService.get<string>('REDIS_URL')!);
      },
    },
  ],
  exports: [CacheService, 'REDIS_CLIENT'],
})
export class CacheModule { }
