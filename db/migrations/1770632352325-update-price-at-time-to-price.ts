import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePriceAtTimeToPrice1770632352325 implements MigrationInterface {
    name = 'UpdatePriceAtTimeToPrice1770632352325'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_item" RENAME COLUMN "price_at_time" TO "price"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_item" RENAME COLUMN "price" TO "price_at_time"`);
    }

}
