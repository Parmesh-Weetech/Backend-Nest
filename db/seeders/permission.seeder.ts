import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Permission } from '../../src/permission/entities/permission.entity';
import { Role } from '../../src/role/entities/role.entity';
import { PERMISSIONS } from '../Default_Values';

export class PermissionSeeder implements Seeder {
    async run(dataSource: DataSource): Promise<void> {
        const permissionRepo = dataSource.getRepository(Permission);
        const roleRepo = dataSource.getRepository(Role);

        for (const perm of PERMISSIONS) {
            let permission = await permissionRepo.findOne({
                where: { key: perm.key, entity: perm.entity },
                relations: ['roles'],
            });

            if (!permission) {
                permission = permissionRepo.create({
                    key: perm.key,
                    label: perm.label,
                    entity: perm.entity,
                    action: perm.action,
                    description: perm.description
                });
            }

            const roles = await roleRepo.findBy(
                perm.roles.map((key) => ({ key })),
            );

            permission.roles = roles;

            await permissionRepo.save(permission);
            console.log(`🔐 Permission seeded: ${perm.key}`);
        }
    }
}
