import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Role } from '../../src/role/entities/role.entity.js';


export class RoleSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<any> {

        const roleRepo = dataSource.getRepository(Role);
        const roleFactory = factoryManager.get(Role);

        const existingRole = await roleRepo.findOne({
            where: { key: 'abcd' },
        });

        if (!existingRole) {
            const newRole = await roleRepo.create({
                key: 'abcd',
                label: 'abcd',
                description: 'abcd role',
            });

            await roleFactory.save(newRole);
        }
    }
}
