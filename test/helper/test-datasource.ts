import { DataSource } from 'typeorm';

export function createTestDataSource(dbName: string) {
    return new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: 5440,
        username: 'div',
        password: 'divpassword',
        database: dbName,
        entities: ['dist/src/**/entities/*.entity.js'],
        synchronize: true
    });
}