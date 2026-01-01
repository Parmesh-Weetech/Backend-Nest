import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveRolePermissionUniqueKeyConstraint1767262787941 implements MigrationInterface {
    name = 'RemoveRolePermissionUniqueKeyConstraint1767262787941'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "UQ_017943867ed5ceef9c03edd9745"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "UQ_a87cf0659c3ac379b339acf36a2"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "UQ_a87cf0659c3ac379b339acf36a2" UNIQUE ("key")`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "UQ_017943867ed5ceef9c03edd9745" UNIQUE ("key")`);
    }

}
