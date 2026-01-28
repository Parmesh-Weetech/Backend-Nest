export interface CacheInterface {
    get(key: string): Promise<String | null>;
    set(key: string, value: any, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
    reset(): Promise<void>;
}
