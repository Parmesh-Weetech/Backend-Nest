import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeIdTypeAsUuid1771480294259 implements MigrationInterface {
    name = 'MakeIdTypeAsUuid1771480294259'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pdf" DROP CONSTRAINT "PK_395fa8d4021d7d68d72378ce096"`);
        await queryRunner.query(`ALTER TABLE "pdf" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "pdf" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "pdf" ADD CONSTRAINT "PK_395fa8d4021d7d68d72378ce096" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pdf" DROP CONSTRAINT "PK_395fa8d4021d7d68d72378ce096"`);
        await queryRunner.query(`ALTER TABLE "pdf" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "pdf" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pdf" ADD CONSTRAINT "PK_395fa8d4021d7d68d72378ce096" PRIMARY KEY ("id")`);
    }

}
