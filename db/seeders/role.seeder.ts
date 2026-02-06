import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Role } from '../../src/role/entities/role.entity';
import { ROLES } from '../Default_Values';

export class RoleSeeder implements Seeder {
    async run(dataSource: DataSource): Promise<Role[]> {
        const roleRepo = dataSource.getRepository(Role);
        const seededRoles: Role[] = [];

        for (const roleData of ROLES) {
            let exists = await roleRepo.findOne({
                where: { key: roleData.key },
            });

            if (!exists) {
                exists = await roleRepo.save(roleRepo.create(roleData));
                console.log(`✅ Role created: ${roleData.key}`);
            } else {
                console.log("Roles already exists! No action needed.")
            }

            seededRoles.push(exists);
        }

        return seededRoles;
    }
}
