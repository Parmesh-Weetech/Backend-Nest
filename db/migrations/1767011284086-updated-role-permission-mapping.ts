import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedRolePermissionMapping1767011284086 implements MigrationInterface {
    name = 'UpdatedRolePermissionMapping1767011284086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_36d7b8e1a331102ec9161e879ce"`);
        await queryRunner.query(`CREATE TABLE "roles_permissions" ("rolesId" uuid NOT NULL, "permissionsId" uuid NOT NULL, CONSTRAINT "PK_b2f4e3f7fbeb7e5b495dd819842" PRIMARY KEY ("rolesId", "permissionsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_dc2b9d46195bb3ed28abbf7c9e" ON "roles_permissions" ("rolesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_fd4d5d4c7f7ff16c57549b72c6" ON "roles_permissions" ("permissionsId") `);
        await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "roleId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "authId"`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" ADD CONSTRAINT "FK_dc2b9d46195bb3ed28abbf7c9e3" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" ADD CONSTRAINT "FK_fd4d5d4c7f7ff16c57549b72c6f" FOREIGN KEY ("permissionsId") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles_permissions" DROP CONSTRAINT "FK_fd4d5d4c7f7ff16c57549b72c6f"`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" DROP CONSTRAINT "FK_dc2b9d46195bb3ed28abbf7c9e3"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "authId" uuid`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD "roleId" uuid`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fd4d5d4c7f7ff16c57549b72c6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dc2b9d46195bb3ed28abbf7c9e"`);
        await queryRunner.query(`DROP TABLE "roles_permissions"`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "FK_36d7b8e1a331102ec9161e879ce" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
