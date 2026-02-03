import { MigrationInterface, QueryRunner } from "typeorm";

export class NotificationEntityChange1770110383581 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" ADD "scheduledAt" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "timezone" character varying NOT NULL DEFAULT 'UTC'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "timezone"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "scheduledAt"`);
    }

}
