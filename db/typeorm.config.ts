import { DataSource } from 'typeorm';
import path from 'path';
const __dirname = path.resolve();

const datasource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5440,
    username: 'div',
    password: 'divpassword',
    database: 'divdata',
    synchronize: false,
    // logging: true,

    entities: [
        path.join(__dirname, 'dist/src/**/entities/*.entity.js'),
    ],

    migrations: [
        path.join(__dirname, '/dist/db/migrations/*.js'),
    ],

});

export default datasource;