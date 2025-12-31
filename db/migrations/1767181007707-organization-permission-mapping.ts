import { MigrationInterface, QueryRunner } from "typeorm";

export class OrganizationPermissionMapping1767181007707 implements MigrationInterface {
    name = 'OrganizationPermissionMapping1767181007707'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" ADD "organizationId" uuid`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "FK_993b02c38468ae34fbf896928cd" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_993b02c38468ae34fbf896928cd"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "organizationId"`);
    }

}
