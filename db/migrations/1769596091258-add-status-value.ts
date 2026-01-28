import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusValue1769596091258 implements MigrationInterface {
    name = 'AddStatusValue1769596091258'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."messages_type_enum" RENAME TO "messages_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."messages_type_enum" AS ENUM('text', 'image', 'video', 'emoji', 'file')`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "type" TYPE "public"."messages_type_enum" USING "type"::"text"::"public"."messages_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."messages_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."messages_type_enum_old" AS ENUM('text', 'image', 'video', 'emoji')`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "type" TYPE "public"."messages_type_enum_old" USING "type"::"text"::"public"."messages_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."messages_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."messages_type_enum_old" RENAME TO "messages_type_enum"`);
    }

}
