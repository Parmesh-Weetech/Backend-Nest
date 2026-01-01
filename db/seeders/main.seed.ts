import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { RoleSeeder } from './role.seeder.js';
import { PermissionSeeder } from './permission.seeder.js';

export class MainSeeder implements Seeder {
    async run(dataSource: DataSource): Promise<void> {
        await new RoleSeeder().run(dataSource);

        await new PermissionSeeder().run(dataSource);
    }
}
