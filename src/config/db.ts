import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
    process.env.DB_NAME || 'mydb',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'root',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
    }
);

export default async function dbConnect() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}