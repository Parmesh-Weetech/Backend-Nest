// cache.module.ts
import { Module, Global } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import redisStore from 'cache-manager-ioredis';

@Global()
@Module({
  imports: [
    ConfigModule,
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = {
          store: redisStore,
          host: configService.get<string>('REDIS_HOST', '127.0.0.1'),
          port: configService.get<number>('REDIS_PORT', 6379),
          ttl: configService.get<number>('CACHE_TTL', 60),
        };
        console.log('Cache config:', config);
        return config;
      },
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule { }
