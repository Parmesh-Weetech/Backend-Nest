import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { RoleSeeder } from './role.seeder';
import { PermissionSeeder } from './permission.seeder';
import { Role } from '../../src/role/entities/role.entity';

export class MainSeeder implements Seeder {
    seededRoles: Role[] = [];
    async run(dataSource: DataSource): Promise<void> {
        this.seededRoles = await new RoleSeeder().run(dataSource);

        await new PermissionSeeder().run(dataSource);
    }
}
