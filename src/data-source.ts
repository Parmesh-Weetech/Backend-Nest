import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import "dotenv/config";
import { SeederOptions, runSeeders } from 'typeorm-extension';

const options: DataSourceOptions & SeederOptions = {
    type: "postgres",
    host: "localhost",
    port: 5440,
    username: "div",
    password: "divpassword",
    database: "divdata",
    synchronize: false, // sync the entities to db table. can update/create the table to match the entity. can be dangerous if it is in production. Development it is fine.
    // logging: ["query", "error", "schema", "info", "migration", "warn"], // log the error messages to the console. it is good for debugging.
    // Prefer compiled JS when running built code, but allow TS during development with ts-node
    entities: ["build/entity/**/*.js"],
    migrations: ["build/migration/**/*.js"],
    subscribers: ["build/subscriber/**/*.js"],
    seeds: ["build/seeds/**/*.js"],
    factories: ["build/factories/**/*.js"],
    migrationsRun: false, // tells whether migrations should be auto-run or not
    // ssl: !!process.env.POSTGRES_SSL, // require to connect to postgres by ssl it is require if it is in cloud or remote connection
    invalidWhereValuesBehavior: {
        null: "sql-null",
        undefined: "throw"
    },
    maxQueryExecutionTime: 10000, // log after this time exceed for any query.
    // cache: {
    //     alwaysEnabled: false
    // }, // enables caching

}

const AppDataSource = new DataSource(options);

(async () => {
    const options: DataSourceOptions = {
        type: 'postgres',
        database: 'divdata',
        port: 5440,
        host: "localhost",
        password: "divpassword",
        synchronize: false,
        username: "div",
        entities: ["build/entity/**/*.js"],
        migrations: ["build/migration/**/*.js"],
        subscribers: ["build/subscriber/**/*.js"],
    };

    const dataSource = new DataSource(options);
    await dataSource.initialize();

    runSeeders(dataSource, {
        seeds: ['build/seeds/**/*.js'],
        factories: ['build/factories/**/*.js']
    });
})();


export default AppDataSource;