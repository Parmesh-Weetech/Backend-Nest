import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeJobIdUnique1771482535297 implements MigrationInterface {
    name = 'MakeJobIdUnique1771482535297'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pdf" ADD CONSTRAINT "UQ_0ab0716471d287b0c8d3174a5c1" UNIQUE ("jobId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pdf" DROP CONSTRAINT "UQ_0ab0716471d287b0c8d3174a5c1"`);
    }

}
