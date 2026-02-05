import { Client } from 'pg';
import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';

export async function createTestDatabase() {
    const dbName = `test_${randomUUID().replace(/-/g, '')}`;

    const admin = new Client({
        host: 'localhost',
        port: 5440,
        user: 'div',
        password: 'divpassword',
        database: 'divdata',
    });

    await admin.connect();
    await admin.query(`CREATE DATABASE "${dbName}"`);
    await admin.end();

    const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5440,
        username: 'div',
        password: 'divpassword',
        database: dbName,
        entities: [__dirname + '/../../dist/src/**/*.entity.ts'],
        synchronize: true,
    });

    await dataSource.initialize();

    return { dataSource, dbName };
}

export async function dropTestDatabase(dbName: string) {
    const admin = new Client({
        host: 'localhost',
        port: 5440,
        user: 'div',
        password: 'divpassword',
        database: 'divdata',
    });

    await admin.connect();
    await admin.query(`DROP DATABASE IF EXISTS "${dbName}"`);
    await admin.end();
}
