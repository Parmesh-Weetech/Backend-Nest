import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { RoleSeeder } from './role.seeder';
import { PermissionSeeder } from './permission.seeder';

export class MainSeeder implements Seeder {
    async run(dataSource: DataSource): Promise<void> {
        await new RoleSeeder().run(dataSource);

        await new PermissionSeeder().run(dataSource);
    }
}
