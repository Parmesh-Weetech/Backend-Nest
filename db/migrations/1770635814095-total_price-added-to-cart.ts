import { MigrationInterface, QueryRunner } from "typeorm";

export class TotalPriceAddedToCart1770635814095 implements MigrationInterface {
    name = 'TotalPriceAddedToCart1770635814095'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_item" ADD "total_price" numeric(10,2) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_item" DROP COLUMN "total_price"`);
    }

}
