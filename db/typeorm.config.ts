import { DataSource } from 'typeorm';
import path from 'path';
import dotenv from 'dotenv';

const __dirname = path.resolve();
dotenv.config();

const datasource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.NODE_ENV !== 'development',
    // logging: true,

    entities: [
        path.join(__dirname, 'dist/src/**/entities/*.entity.js'),
    ],

    migrations: [
        path.join(__dirname, '/dist/db/migrations/*.js'),
    ],

});

export default datasource;