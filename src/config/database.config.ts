import { registerAs } from '@nestjs/config';
import dotenv from 'dotenv';

dotenv.config();

export default registerAs('database', () => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.NODE_ENV !== 'development',
    // logging: true,

    migrationsTableName: 'migrations',

    entities: [__dirname + '/../**/entities/*.entity.js'],

    migrations: [__dirname + '../../db/migrations/*.js'],
}));