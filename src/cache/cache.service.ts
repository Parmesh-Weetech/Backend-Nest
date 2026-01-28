// cache.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheInterface } from './cache.interface';
import type { Cache } from 'cache-manager';

@Injectable()
export class CacheService implements CacheInterface {
    constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) { }

    async get<T>(key: string): Promise<T | null> {
        const value = await this.cache.get<T>(key);
        return value ?? null;
    }

    async set<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
        const plainValue = JSON.parse(JSON.stringify(value));
        await this.cache.set(key, plainValue, ttlSeconds * 1000);
    }

    async del(key: string): Promise<void> {
        await this.cache.del(key);
    }

    async reset(): Promise<void> {
        await this.cache.clear();
    }
}
