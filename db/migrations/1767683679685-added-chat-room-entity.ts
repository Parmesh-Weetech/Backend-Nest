import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedChatRoomEntity1767683679685 implements MigrationInterface {
    name = 'AddedChatRoomEntity1767683679685'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chat_rooms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_c69082bd83bffeb71b0f455bd59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_rooms_members_user" ("chatRoomsId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_419f2cb398dd328c896230ca6d0" PRIMARY KEY ("chatRoomsId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2b14083200fb9697f0705ddd5f" ON "chat_rooms_members_user" ("chatRoomsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2c6b35ef0f116166c3420d5842" ON "chat_rooms_members_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "chat_rooms_members_user" ADD CONSTRAINT "FK_2b14083200fb9697f0705ddd5f8" FOREIGN KEY ("chatRoomsId") REFERENCES "chat_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "chat_rooms_members_user" ADD CONSTRAINT "FK_2c6b35ef0f116166c3420d58426" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_rooms_members_user" DROP CONSTRAINT "FK_2c6b35ef0f116166c3420d58426"`);
        await queryRunner.query(`ALTER TABLE "chat_rooms_members_user" DROP CONSTRAINT "FK_2b14083200fb9697f0705ddd5f8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2c6b35ef0f116166c3420d5842"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2b14083200fb9697f0705ddd5f"`);
        await queryRunner.query(`DROP TABLE "chat_rooms_members_user"`);
        await queryRunner.query(`DROP TABLE "chat_rooms"`);
    }

}
