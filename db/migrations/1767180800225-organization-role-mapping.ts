import { MigrationInterface, QueryRunner } from "typeorm";

export class OrganizationRoleMapping1767180800225 implements MigrationInterface {
    name = 'OrganizationRoleMapping1767180800225'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" ADD "organizationId" uuid`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "FK_0933e1dfb2993d672af1a98f08e" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "FK_0933e1dfb2993d672af1a98f08e"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "organizationId"`);
    }

}
