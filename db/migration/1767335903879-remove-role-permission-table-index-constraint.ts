import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveRolePermissionTableIndexConstraint1767335903879 implements MigrationInterface {
    name = 'RemoveRolePermissionTableIndexConstraint1767335903879'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_337088ff813c697c964f49f58f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e5a52fc6f7a8dae64f645b0914"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e5a52fc6f7a8dae64f645b0914" ON "roles" ("created_at") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_337088ff813c697c964f49f58f" ON "permissions" ("created_at") `);
    }

}
