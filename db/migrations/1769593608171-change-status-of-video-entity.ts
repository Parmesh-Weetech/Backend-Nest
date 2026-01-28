import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeStatusOfVideoEntity1769593608171 implements MigrationInterface {
    name = 'ChangeStatusOfVideoEntity1769593608171'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "videos" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "videos" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`);
    }

}
