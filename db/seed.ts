import 'reflect-metadata';
import { runSeeders, SeederOptions } from 'typeorm-extension';

import dbConfig from './seeder.config.js';
import { RoleFactory } from './factories/role.factory.js';
import { RoleSeeder } from './seeders/role.seeder.js';
import { DataSourceOptions } from 'typeorm';
import { DataSource } from 'typeorm';

const options: DataSourceOptions & SeederOptions = {
    ...dbConfig(),
    factories: [RoleFactory],
    seeds: [RoleSeeder],
};

const datasource = new DataSource(options);

const seed = async () => {
    await datasource.initialize()
    await runSeeders(datasource, {
        seeds: ['dist/db/seeders/*.seeder.js'],
        factories: ['dist/db/factories/*.factory.js'],
    });
}

seed()