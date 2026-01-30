import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeMediaTypeAcceptVideoEntity1769687492774 implements MigrationInterface {
    name = 'ChangeMediaTypeAcceptVideoEntity1769687492774'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message_attachments" ADD "videoId" uuid`);
        await queryRunner.query(`ALTER TABLE "message_attachments" DROP CONSTRAINT "FK_b843c419da32202d103b60d5478"`);
        await queryRunner.query(`ALTER TABLE "message_attachments" ALTER COLUMN "mediaId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message_attachments" ADD CONSTRAINT "FK_b843c419da32202d103b60d5478" FOREIGN KEY ("mediaId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "message_attachments" ADD CONSTRAINT "FK_dfa76691c8439a6b6e7ed142366" FOREIGN KEY ("videoId") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message_attachments" DROP CONSTRAINT "FK_dfa76691c8439a6b6e7ed142366"`);
        await queryRunner.query(`ALTER TABLE "message_attachments" DROP CONSTRAINT "FK_b843c419da32202d103b60d5478"`);
        await queryRunner.query(`ALTER TABLE "message_attachments" ALTER COLUMN "mediaId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message_attachments" ADD CONSTRAINT "FK_b843c419da32202d103b60d5478" FOREIGN KEY ("mediaId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "message_attachments" DROP COLUMN "videoId"`);
    }

}
