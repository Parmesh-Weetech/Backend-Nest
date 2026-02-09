import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCartCascadingRule1770633085949 implements MigrationInterface {
    name = 'UpdateCartCascadingRule1770633085949'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_item" DROP CONSTRAINT "FK_29e590514f9941296f3a2440d39"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_756f53ab9466eb52a52619ee019"`);
        await queryRunner.query(`ALTER TABLE "cart_item" DROP COLUMN "cartId"`);
        await queryRunner.query(`ALTER TABLE "cart_item" ADD "cartId" uuid`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "cart" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "cart_item" ADD CONSTRAINT "FK_29e590514f9941296f3a2440d39" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_756f53ab9466eb52a52619ee019" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_756f53ab9466eb52a52619ee019"`);
        await queryRunner.query(`ALTER TABLE "cart_item" DROP CONSTRAINT "FK_29e590514f9941296f3a2440d39"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "cart" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "cart_item" DROP COLUMN "cartId"`);
        await queryRunner.query(`ALTER TABLE "cart_item" ADD "cartId" integer`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_756f53ab9466eb52a52619ee019" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "cart_item" ADD CONSTRAINT "FK_29e590514f9941296f3a2440d39" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
