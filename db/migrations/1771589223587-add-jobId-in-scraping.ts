import { MigrationInterface, QueryRunner } from "typeorm";

export class AddJobIdInScraping1771589223587 implements MigrationInterface {
    name = 'AddJobIdInScraping1771589223587'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scrape_jobs" ADD "jobId" character varying NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "scrape_jobs" ADD CONSTRAINT "UQ_d15b3b6efc5f3a38cd627e24241" UNIQUE ("jobId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scrape_jobs" DROP CONSTRAINT "UQ_d15b3b6efc5f3a38cd627e24241"`);
        await queryRunner.query(`ALTER TABLE "scrape_jobs" DROP COLUMN "jobId"`);
    }

}
