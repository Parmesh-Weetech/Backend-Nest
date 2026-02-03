import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedTypeOfPriceRatingFromIntegerToFloat1768465872667 implements MigrationInterface {
    name = 'ChangedTypeOfPriceRatingFromIntegerToFloat1768465872667'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "price" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "rating"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "rating" numeric(2,1) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "rating"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "rating" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "price" integer NOT NULL`);
    }

}
