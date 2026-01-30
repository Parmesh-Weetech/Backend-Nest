import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOriginalVideoNameColumnFieldInVideoEntity1769748344099 implements MigrationInterface {
    name = 'AddOriginalVideoNameColumnFieldInVideoEntity1769748344099'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message_attachments" DROP CONSTRAINT "FK_dfa76691c8439a6b6e7ed142366"`);
        await queryRunner.query(`ALTER TABLE "message_attachments" DROP COLUMN "videoId"`);
        await queryRunner.query(`ALTER TABLE "videos" ADD "originalVideoName" character varying NOT NULL DEFAULT 'default.mp4'`);
        await queryRunner.query(`ALTER TABLE "videos" ADD "mimeType" character varying NOT NULL DEFAULT 'video/mp4'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "videos" DROP COLUMN "mimeType"`);
        await queryRunner.query(`ALTER TABLE "videos" DROP COLUMN "originalVideoName"`);
        await queryRunner.query(`ALTER TABLE "message_attachments" ADD "videoId" uuid`);
        await queryRunner.query(`ALTER TABLE "message_attachments" ADD CONSTRAINT "FK_dfa76691c8439a6b6e7ed142366" FOREIGN KEY ("videoId") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
