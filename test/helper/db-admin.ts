import { DataSource } from 'typeorm';

export const adminDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: 5440,
    username: 'div',
    password: 'divpassword',
    database: 'divdata',
});
