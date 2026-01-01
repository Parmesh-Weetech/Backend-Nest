import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const datasource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.NODE_ENV !== 'development',
    // logging: true,
    // logger: 'simple-console'
    entities: ['dist/src/**/entities/*.entity.js'],
    migrations: ['dist/db/migrations/*.js']
});