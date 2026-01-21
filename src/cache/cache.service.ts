// cache.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheInterface } from './cache.interface';
import type { Cache } from 'cache-manager';

@Injectable()
export class CacheService implements CacheInterface {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    async get(key: string): Promise<any | null> {
        const value = await this.cacheManager.get(key);

        if (!value) {
            console.log("null")
            return null;
        }

        return value;
    }

    async set(key: string, value: any, ttl = 300): Promise<void> {
            await this.cacheManager.set(key, value, ttl * 1000);
    }

    async del(key: string): Promise<void> {
        await this.cacheManager.del(key);
    }

    async reset(): Promise<void> {
        await this.cacheManager.clear();
    }
}
