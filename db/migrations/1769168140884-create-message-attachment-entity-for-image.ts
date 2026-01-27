import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMessageAttachmentEntityForImage1769168140884 implements MigrationInterface {
    name = 'CreateMessageAttachmentEntityForImage1769168140884'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_acf951a58e3b9611dd96ce89042"`);
        await queryRunner.query(`CREATE TABLE "message_attachments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mediaId" character varying NOT NULL, "mimeType" character varying NOT NULL, "order" integer, "messageId" uuid, CONSTRAINT "PK_e5085d973567c61e9306f10f95b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "receiverId"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "content" text`);
        await queryRunner.query(`ALTER TABLE "message_attachments" ADD CONSTRAINT "FK_5b4f24737fcb6b35ffdd4d16e13" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message_attachments" DROP CONSTRAINT "FK_5b4f24737fcb6b35ffdd4d16e13"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "content" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "receiverId" uuid`);
        await queryRunner.query(`DROP TABLE "message_attachments"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_acf951a58e3b9611dd96ce89042" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
