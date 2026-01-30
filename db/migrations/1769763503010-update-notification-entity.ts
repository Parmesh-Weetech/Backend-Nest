import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateNotificationEntity1769763503010 implements MigrationInterface {
    name = 'UpdateNotificationEntity1769763503010'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "receiverId"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "conversationId" uuid`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "senderId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_ddb7981cf939fe620179bfea33a" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_cc7d3a957c3fe287fcdc289a12b" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_cc7d3a957c3fe287fcdc289a12b"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_ddb7981cf939fe620179bfea33a"`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "senderId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "conversationId"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "receiverId" uuid NOT NULL`);
    }

}
