import "reflect-metadata";
import { DataSource } from "typeorm";
import "dotenv/config";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: !!process.env.POSTGRES_SYNC, // sync the entities to db table. can update/create the table to match the entity. can be dangerous if it is in production. Development it is fine.
    // logging: ["query", "error", "schema", "info", "migration", "warn"], // log the error messages to the console. it is good for debugging.
    entities: ["build/entity/*.js", "build/entity/**/*.js"],
    migrations: ["build/migrations/*.js"],
    subscribers: ["build/subscriber/**/*.js"],
    ssl: !!process.env.POSTGRES_SSL, // require to connect to postgres by ssl it is require if it is in cloud or remote connection
    invalidWhereValuesBehavior: {
        null: "sql-null",
        undefined: "throw"
    }
});