import { MigrationInterface, QueryRunner } from "typeorm";

export class RolePermissionTableCompositeUniqueKey1767265467213 implements MigrationInterface {
    name = 'RolePermissionTableCompositeUniqueKey1767265467213'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_337088ff813c697c964f49f58f" ON "permissions" ("created_at") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e5a52fc6f7a8dae64f645b0914" ON "roles" ("created_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_e5a52fc6f7a8dae64f645b0914"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_337088ff813c697c964f49f58f"`);
    }

}
