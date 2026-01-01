import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';

import dbConfig from './seeder.config.js';
import { RoleFactory } from './factories/role.factory.js';
import { MainSeeder } from './seeders/main.seed.js';

const datasource = new DataSource({
    ...dbConfig(),
    factories: [RoleFactory],
    seeds: [MainSeeder],
} as any); // 👈 REQUIRED

async function seed() {
    await datasource.initialize();
    console.log('📦 DataSource initialized');

    await runSeeders(datasource);

    console.log('🌱 Seeding completed');
    await datasource.destroy();
    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Seeding failed', err);
    process.exit(1);
});
