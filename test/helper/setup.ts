import { CacheModule } from '@nestjs/cache-manager';
import { Client } from 'pg';

const workerId = process.env.JEST_WORKER_ID || '0';
const schema = `test_${workerId}`;

export default async () => {
    const client = new Client({
        host: 'localhost',
        port: 5441,
        user: 'div',
        password: 'divpassword',
        database: 'divdata',
    });

    await client.connect();
    await client.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
    await client.end();
};


export const redis_namespace = async () => {
    CacheModule.register({ prefix: `test_${workerId}:` });
};