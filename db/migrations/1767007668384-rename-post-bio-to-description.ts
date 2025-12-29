import { MigrationInterface, QueryRunner } from "typeorm";

export class RenamePostBioToDescription1767007668384 implements MigrationInterface {
    name = 'RenamePostBioToDescription1767007668384'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" RENAME COLUMN "bio" TO "description"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" RENAME COLUMN "description" TO "bio"`);
    }

}
