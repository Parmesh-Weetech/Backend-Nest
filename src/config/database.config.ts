import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.NODE_ENV !== 'development',
    // logger: "simple-console",
    // logging: true,
    migrationsTableName: 'migrations',

    entities: [__dirname + '/../**/entities/*.entity.js'],
    migrations: [__dirname + '../../db/migrations/*.js'],
}));