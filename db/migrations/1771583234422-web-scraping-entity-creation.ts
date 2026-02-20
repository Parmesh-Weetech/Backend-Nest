import { MigrationInterface, QueryRunner } from "typeorm";

export class WebScrapingEntityCreation1771583234422 implements MigrationInterface {
    name = 'WebScrapingEntityCreation1771583234422'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."scrape_jobs_status_enum" AS ENUM('PENDING', 'PROCESSING', 'DONE', 'FAILED')`);
        await queryRunner.query(`CREATE TABLE "scrape_jobs" ("id" SERIAL NOT NULL, "status" "public"."scrape_jobs_status_enum" NOT NULL DEFAULT 'PENDING', "mainUrl" character varying NOT NULL, "subUrl" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_715dc4010fbafb63b7b8893a98d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_b338645e07d8bfa5674529d059" ON "scrape_jobs" ("subUrl") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_b338645e07d8bfa5674529d059"`);
        await queryRunner.query(`DROP TABLE "scrape_jobs"`);
        await queryRunner.query(`DROP TYPE "public"."scrape_jobs_status_enum"`);
    }

}
