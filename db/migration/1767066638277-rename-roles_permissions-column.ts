import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameRolesPermissionsColumn1767066638277 implements MigrationInterface {
    name = 'RenameRolesPermissionsColumn1767066638277'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles_permissions" DROP CONSTRAINT "FK_dc2b9d46195bb3ed28abbf7c9e3"`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" DROP CONSTRAINT "FK_fd4d5d4c7f7ff16c57549b72c6f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dc2b9d46195bb3ed28abbf7c9e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fd4d5d4c7f7ff16c57549b72c6"`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" DROP CONSTRAINT "PK_b2f4e3f7fbeb7e5b495dd819842"`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" ADD CONSTRAINT "PK_b2f4e3f7fbeb7e5b495dd819842" PRIMARY KEY ("permissionsId")`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" DROP COLUMN "rolesId"`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" DROP CONSTRAINT "PK_b2f4e3f7fbeb7e5b495dd819842"`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" DROP COLUMN "permissionsId"`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" ADD "roleId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" ADD CONSTRAINT "PK_28bf280551eb9aa82daf1e156d9" PRIMARY KEY ("roleId")`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" ADD "permissionId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" DROP CONSTRAINT "PK_28bf280551eb9aa82daf1e156d9"`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" ADD CONSTRAINT "PK_5829481fc2a13d85b9b6bf3bd53" PRIMARY KEY ("roleId", "permissionId")`);
        await queryRunner.query(`CREATE INDEX "IDX_28bf280551eb9aa82daf1e156d" ON "roles_permissions" ("roleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_31cf5c31d0096f706e3ba3b1e8" ON "roles_permissions" ("permissionId") `);
        await queryRunner.query(`ALTER TABLE "roles_permissions" ADD CONSTRAINT "FK_28bf280551eb9aa82daf1e156d9" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" ADD CONSTRAINT "FK_31cf5c31d0096f706e3ba3b1e82" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles_permissions" DROP CONSTRAINT "FK_31cf5c31d0096f706e3ba3b1e82"`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" DROP CONSTRAINT "FK_28bf280551eb9aa82daf1e156d9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_31cf5c31d0096f706e3ba3b1e8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_28bf280551eb9aa82daf1e156d"`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" DROP CONSTRAINT "PK_5829481fc2a13d85b9b6bf3bd53"`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" ADD CONSTRAINT "PK_28bf280551eb9aa82daf1e156d9" PRIMARY KEY ("roleId")`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" DROP COLUMN "permissionId"`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" DROP CONSTRAINT "PK_28bf280551eb9aa82daf1e156d9"`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" DROP COLUMN "roleId"`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" ADD "permissionsId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" ADD CONSTRAINT "PK_b2f4e3f7fbeb7e5b495dd819842" PRIMARY KEY ("permissionsId")`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" ADD "rolesId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" DROP CONSTRAINT "PK_b2f4e3f7fbeb7e5b495dd819842"`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" ADD CONSTRAINT "PK_b2f4e3f7fbeb7e5b495dd819842" PRIMARY KEY ("rolesId", "permissionsId")`);
        await queryRunner.query(`CREATE INDEX "IDX_fd4d5d4c7f7ff16c57549b72c6" ON "roles_permissions" ("permissionsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_dc2b9d46195bb3ed28abbf7c9e" ON "roles_permissions" ("rolesId") `);
        await queryRunner.query(`ALTER TABLE "roles_permissions" ADD CONSTRAINT "FK_fd4d5d4c7f7ff16c57549b72c6f" FOREIGN KEY ("permissionsId") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" ADD CONSTRAINT "FK_dc2b9d46195bb3ed28abbf7c9e3" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
