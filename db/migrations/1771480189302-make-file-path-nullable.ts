import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeFilePathNullable1771480189302 implements MigrationInterface {
    name = 'MakeFilePathNullable1771480189302'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pdf" ALTER COLUMN "filePath" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pdf" ALTER COLUMN "filePath" SET NOT NULL`);
    }

}
