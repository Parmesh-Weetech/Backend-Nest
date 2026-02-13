import { MigrationInterface, QueryRunner } from "typeorm";

export class CartItemEntityCompositeKeyUniqueCostraint1770954008703 implements MigrationInterface {
    name = 'CartItemEntityCompositeKeyUniqueCostraint1770954008703'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_item" ADD CONSTRAINT "UQ_86ecfe066ef04fcf69bdbae722b" UNIQUE ("cartId", "productId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_item" DROP CONSTRAINT "UQ_86ecfe066ef04fcf69bdbae722b"`);
    }

}
