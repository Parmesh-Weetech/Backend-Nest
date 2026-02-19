import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedColumnNameInPdfEntity1771479679368 implements MigrationInterface {
    name = 'UpdatedColumnNameInPdfEntity1771479679368'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."pdf_status_enum" AS ENUM('PENDING', 'GENERATED', 'PROCESSING', 'FAILED')`);
        await queryRunner.query(`CREATE TABLE "pdf" ("id" SERIAL NOT NULL, "status" "public"."pdf_status_enum" NOT NULL DEFAULT 'PENDING', "filePath" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_395fa8d4021d7d68d72378ce096" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "organization" ALTER COLUMN "config" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organization" ALTER COLUMN "config" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "cart_item" ADD CONSTRAINT "UQ_86ecfe066ef04fcf69bdbae722b" UNIQUE ("cartId", "productId")`);
        await queryRunner.query(`ALTER TABLE "pdf" ADD CONSTRAINT "FK_a13c69e3aa530a81c8074dc7677" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pdf" DROP CONSTRAINT "FK_a13c69e3aa530a81c8074dc7677"`);
        await queryRunner.query(`ALTER TABLE "cart_item" DROP CONSTRAINT "UQ_86ecfe066ef04fcf69bdbae722b"`);
        await queryRunner.query(`ALTER TABLE "organization" ALTER COLUMN "config" SET DEFAULT '{"postEnabled": true, "database_provider": "postgres"}'`);
        await queryRunner.query(`ALTER TABLE "organization" ALTER COLUMN "config" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`DROP TABLE "pdf"`);
        await queryRunner.query(`DROP TYPE "public"."pdf_status_enum"`);
    }

}
