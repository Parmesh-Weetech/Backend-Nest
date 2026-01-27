import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSoftDeleteFieldInFiles1769142732059 implements MigrationInterface {
    name = 'AddSoftDeleteFieldInFiles1769142732059'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "deleted_at"`);
    }

}
