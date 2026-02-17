import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedUpdatedDeletedAtTimestampInPostEntity1771331415420 implements MigrationInterface {
    name = 'AddCreatedUpdatedDeletedAtTimestampInPostEntity1771331415420'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_item" DROP CONSTRAINT "UQ_86ecfe066ef04fcf69bdbae722b"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "organization" ALTER COLUMN "config" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organization" ALTER COLUMN "config" SET DEFAULT '{"database_provider":"postgres","postEnabled":true}'::jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" ALTER COLUMN "config" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "organization" ALTER COLUMN "config" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "cart_item" ADD CONSTRAINT "UQ_86ecfe066ef04fcf69bdbae722b" UNIQUE ("productId", "cartId")`);
    }

}
