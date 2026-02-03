import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMediaTypeInMessageAttachment1769664373080 implements MigrationInterface {
    name = 'AddMediaTypeInMessageAttachment1769664373080'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."message_attachment_media_type_enum" AS ENUM('image', 'video', 'audio', 'application')`);
        await queryRunner.query(`ALTER TABLE "message_attachments" ADD "mediaType" "public"."message_attachment_media_type_enum" NOT NULL DEFAULT 'image'`);
        await queryRunner.query(`CREATE TYPE "public"."messages_type_enum" AS ENUM('text', 'media')`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "type" "public"."messages_type_enum" NOT NULL DEFAULT 'text'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."messages_type_enum"`);
        await queryRunner.query(`ALTER TABLE "message_attachments" DROP COLUMN "mediaType"`);
        await queryRunner.query(`DROP TYPE "public"."message_attachment_media_type_enum"`);
    }

}
