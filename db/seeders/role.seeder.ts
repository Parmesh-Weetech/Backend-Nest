import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Role } from '../../src/role/entities/role.entity.js';
import { ROLES } from '../Default_Values.js';

export class RoleSeeder implements Seeder {
    async run(dataSource: DataSource): Promise<void> {
        const roleRepo = dataSource.getRepository(Role);

        for (const roleData of ROLES) {
            const exists = await roleRepo.findOne({
                where: { key: roleData.key },
            });

            if (!exists) {
                await roleRepo.save(roleRepo.create(roleData));
                console.log(`✅ Role created: ${roleData.key}`);
            } else {
                console.log("Roles already exists! No action needed.")
            }
        }
    }
}
