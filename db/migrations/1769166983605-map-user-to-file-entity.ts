import { MigrationInterface, QueryRunner } from "typeorm";

export class MapUserToFileEntity1769166983605 implements MigrationInterface {
    name = 'MapUserToFileEntity1769166983605'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "files" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "files" ADD CONSTRAINT "FK_a7435dbb7583938d5e7d1376041" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_a7435dbb7583938d5e7d1376041"`);
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "files" ADD "user_id" character varying NOT NULL`);
    }

}
