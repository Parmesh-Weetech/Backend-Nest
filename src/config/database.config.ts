import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
    type: 'postgres',
    host: 'localhost',
    port: 5440,
    username: 'div',
    password: 'divpassword',
    database: 'divdata',
    synchronize: false,
    // logging: true,
    abortOnError: false,

    migrationsTableName: 'migrations',

    entities: [__dirname + '/../**/entities/*.entity.js'],

    migrations: [__dirname + '../../db/migrations/*.js'],
}));