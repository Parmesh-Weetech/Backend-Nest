import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveDefaultAuthRole1766991368188 implements MigrationInterface {
    name = 'RemoveDefaultAuthRole1766991368188'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" ALTER COLUMN "roleId" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" ALTER COLUMN "roleId" SET DEFAULT '4adfc25d-e103-454d-8a84-7ff210d6ecab'`);
    }

}
