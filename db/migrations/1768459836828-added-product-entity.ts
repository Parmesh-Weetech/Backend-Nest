import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedProductEntity1768459836828 implements MigrationInterface {
    name = 'AddedProductEntity1768459836828'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "image" character varying NOT NULL, "price" integer NOT NULL, "rating" integer NOT NULL, "mealType" text array NOT NULL, "cuisine" character varying NOT NULL, "ingredients" text array NOT NULL, "instructions" text array NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "userId" uuid NOT NULL, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_329b8ae12068b23da547d3b4798" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_329b8ae12068b23da547d3b4798"`);
        await queryRunner.query(`DROP TABLE "product"`);
    }

}
