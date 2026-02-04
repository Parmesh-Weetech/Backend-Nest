import { Module, Global } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import KeyvRedis from '@keyv/redis';
import Keyv from 'keyv';

import { CacheService } from './cache.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    NestCacheModule.registerAsync({
      useFactory: async () => {
        const redisStore = new KeyvRedis('redis://localhost:6379');

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
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule { }
