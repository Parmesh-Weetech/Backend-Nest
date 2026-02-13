import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveSoftDeleteOfCart1770959032137 implements MigrationInterface {
    name = 'RemoveSoftDeleteOfCart1770959032137'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "deleted_at"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
    }

}
