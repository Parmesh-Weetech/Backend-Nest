import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSkippedStatusInScrapingEntity1771589987723 implements MigrationInterface {
    name = 'AddSkippedStatusInScrapingEntity1771589987723'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."scrape_jobs_status_enum" RENAME TO "scrape_jobs_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."scrape_jobs_status_enum" AS ENUM('PENDING', 'PROCESSING', 'DONE', 'FAILED', 'SKIPPED')`);
        await queryRunner.query(`ALTER TABLE "scrape_jobs" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "scrape_jobs" ALTER COLUMN "status" TYPE "public"."scrape_jobs_status_enum" USING "status"::"text"::"public"."scrape_jobs_status_enum"`);
        await queryRunner.query(`ALTER TABLE "scrape_jobs" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
        await queryRunner.query(`DROP TYPE "public"."scrape_jobs_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."scrape_jobs_status_enum_old" AS ENUM('PENDING', 'PROCESSING', 'DONE', 'FAILED')`);
        await queryRunner.query(`ALTER TABLE "scrape_jobs" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "scrape_jobs" ALTER COLUMN "status" TYPE "public"."scrape_jobs_status_enum_old" USING "status"::"text"::"public"."scrape_jobs_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "scrape_jobs" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
        await queryRunner.query(`DROP TYPE "public"."scrape_jobs_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."scrape_jobs_status_enum_old" RENAME TO "scrape_jobs_status_enum"`);
    }

}
