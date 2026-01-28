import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldsToFileEntity1769487198873 implements MigrationInterface {
    name = 'AddFieldsToFileEntity1769487198873'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "videos" DROP CONSTRAINT "FK_0c06b8d2494611b35c67296356c"`);
        await queryRunner.query(`ALTER TABLE "files" ADD "originalFileName" character varying NOT NULL DEFAULT 'default.png'`);
        await queryRunner.query(`ALTER TABLE "files" ADD "mimeType" character varying NOT NULL DEFAULT 'image/png'`);
        await queryRunner.query(`ALTER TABLE "files" ADD "status" character varying NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE "videos" ADD CONSTRAINT "FK_900733992fb36a6d855308c0039" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "videos" DROP CONSTRAINT "FK_900733992fb36a6d855308c0039"`);
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "mimeType"`);
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "originalFileName"`);
        await queryRunner.query(`ALTER TABLE "videos" ADD CONSTRAINT "FK_0c06b8d2494611b35c67296356c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
