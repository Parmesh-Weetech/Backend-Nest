import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeProductCartEntityPriceFieldType1770812704283 implements MigrationInterface {
    name = 'ChangeProductCartEntityPriceFieldType1770812704283'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "rating" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "cart_item" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "cart_item" ALTER COLUMN "total_price" TYPE numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_item" ALTER COLUMN "total_price" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "cart_item" ALTER COLUMN "price" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "rating" TYPE numeric(2,1)`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "price" TYPE numeric(10,2)`);
    }

}
