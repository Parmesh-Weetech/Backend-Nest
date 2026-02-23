import { MigrationInterface, QueryRunner } from "typeorm";

export class MarkPrimaryKeyColumnTypeAsUuid1771819562326 implements MigrationInterface {
    name = 'MarkPrimaryKeyColumnTypeAsUuid1771819562326'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scrape_jobs" DROP CONSTRAINT "PK_715dc4010fbafb63b7b8893a98d"`);
        await queryRunner.query(`ALTER TABLE "scrape_jobs" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "scrape_jobs" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "scrape_jobs" ADD CONSTRAINT "PK_715dc4010fbafb63b7b8893a98d" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scrape_jobs" DROP CONSTRAINT "PK_715dc4010fbafb63b7b8893a98d"`);
        await queryRunner.query(`ALTER TABLE "scrape_jobs" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "scrape_jobs" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "scrape_jobs" ADD CONSTRAINT "PK_715dc4010fbafb63b7b8893a98d" PRIMARY KEY ("id")`);
    }

}
