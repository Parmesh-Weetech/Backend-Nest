// cache.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheInterface } from './cache.interface';
import type { Cache } from 'cache-manager';

@Injectable()
export class CacheService implements CacheInterface {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    async get<T>(key: string): Promise<T | null> {
        console.log("getting", key)
        const value = await this.cacheManager.get<T>(key);

        console.log(value)
        if(!value) return null;
        return value;
    }

    async set<T>(key: string, value: T, ttl = 300): Promise<void> {
        console.log("setting", key, "value", value)
        await this.cacheManager.set(key, value, ttl);
    }

    async del(key: string): Promise<void> {
        await this.cacheManager.del(key);
    }

    async reset(): Promise<void> {
        await this.cacheManager.clear();
    }
}
