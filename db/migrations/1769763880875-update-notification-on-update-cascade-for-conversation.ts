import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateNotificationOnUpdateCascadeForConversation1769763880875 implements MigrationInterface {
    name = 'UpdateNotificationOnUpdateCascadeForConversation1769763880875'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_cc7d3a957c3fe287fcdc289a12b"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_cc7d3a957c3fe287fcdc289a12b" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_cc7d3a957c3fe287fcdc289a12b"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_cc7d3a957c3fe287fcdc289a12b" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
