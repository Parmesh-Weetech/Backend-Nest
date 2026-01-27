import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUrlFieldFromFiles1769081487590 implements MigrationInterface {
    name = 'RemoveUrlFieldFromFiles1769081487590'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "url"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" ADD "url" character varying NOT NULL`);
    }

}
