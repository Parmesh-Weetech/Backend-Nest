import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedConfigFieldInOrganization1767181733996 implements MigrationInterface {
    name = 'AddedConfigFieldInOrganization1767181733996'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" ADD "config" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "config"`);
    }

}
