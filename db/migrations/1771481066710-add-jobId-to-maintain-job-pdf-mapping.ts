import { MigrationInterface, QueryRunner } from "typeorm";

export class AddJobIdToMaintainJobPdfMapping1771481066710 implements MigrationInterface {
    name = 'AddJobIdToMaintainJobPdfMapping1771481066710'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pdf" ADD "jobId" character varying NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pdf" DROP COLUMN "jobId"`);
    }

}
