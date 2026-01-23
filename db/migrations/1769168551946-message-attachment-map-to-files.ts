import { MigrationInterface, QueryRunner } from "typeorm";

export class MessageAttachmentMapToFiles1769168551946 implements MigrationInterface {
    name = 'MessageAttachmentMapToFiles1769168551946'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_a7435dbb7583938d5e7d1376041"`);
        await queryRunner.query(`ALTER TABLE "message_attachments" DROP COLUMN "mediaId"`);
        await queryRunner.query(`ALTER TABLE "message_attachments" ADD "mediaId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "files" ADD CONSTRAINT "FK_a7435dbb7583938d5e7d1376041" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "message_attachments" ADD CONSTRAINT "FK_b843c419da32202d103b60d5478" FOREIGN KEY ("mediaId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message_attachments" DROP CONSTRAINT "FK_b843c419da32202d103b60d5478"`);
        await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_a7435dbb7583938d5e7d1376041"`);
        await queryRunner.query(`ALTER TABLE "message_attachments" DROP COLUMN "mediaId"`);
        await queryRunner.query(`ALTER TABLE "message_attachments" ADD "mediaId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "files" ADD CONSTRAINT "FK_a7435dbb7583938d5e7d1376041" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
