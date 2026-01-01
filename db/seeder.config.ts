import { registerAs } from '@nestjs/config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export default registerAs('database', (): PostgresConnectionOptions => ({
    type: 'postgres',
    host: 'localhost',
    port: 5440,
    username: 'div',
    password: 'divpassword',
    database: 'divdata',
    synchronize: false,
    // logger: "simple-console",
    // logging: true,
    migrationsTableName: 'migrations',

    entities: [__dirname + '/../**/entities/*.entity.js'],
    migrations: [__dirname + '../../db/migrations/*.js'],
}));