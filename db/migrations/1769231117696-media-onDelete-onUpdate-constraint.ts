import { MigrationInterface, QueryRunner } from "typeorm";

export class MediaOnDeleteOnUpdateConstraint1769231117696 implements MigrationInterface {
    name = 'MediaOnDeleteOnUpdateConstraint1769231117696'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message_attachments" DROP CONSTRAINT "FK_b843c419da32202d103b60d5478"`);
        await queryRunner.query(`ALTER TABLE "message_attachments" ADD CONSTRAINT "FK_b843c419da32202d103b60d5478" FOREIGN KEY ("mediaId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message_attachments" DROP CONSTRAINT "FK_b843c419da32202d103b60d5478"`);
        await queryRunner.query(`ALTER TABLE "message_attachments" ADD CONSTRAINT "FK_b843c419da32202d103b60d5478" FOREIGN KEY ("mediaId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
