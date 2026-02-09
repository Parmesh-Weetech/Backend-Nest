import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldInProductTable1770614190511 implements MigrationInterface {
    name = 'AddFieldInProductTable1770614190511'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "prepTimeMinutes" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "product" ADD "cookTimeMinutes" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`CREATE TYPE "public"."product_difficulty_enum" AS ENUM('Easy', 'Medium', 'Hard')`);
        await queryRunner.query(`ALTER TABLE "product" ADD "difficulty" "public"."product_difficulty_enum" NOT NULL DEFAULT 'Easy'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "difficulty"`);
        await queryRunner.query(`DROP TYPE "public"."product_difficulty_enum"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "cookTimeMinutes"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "prepTimeMinutes"`);
    }

}
