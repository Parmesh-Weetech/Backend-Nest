import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedAuthRoleMapping1766993813352 implements MigrationInterface {
    name = 'AddedAuthRoleMapping1766993813352'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" ADD "roleId" uuid`);
        await queryRunner.query(`ALTER TABLE "auth" ADD CONSTRAINT "FK_b368cb67ee97687c9fdc9a04153" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" DROP CONSTRAINT "FK_b368cb67ee97687c9fdc9a04153"`);
        await queryRunner.query(`ALTER TABLE "auth" DROP COLUMN "roleId"`);
    }

}
