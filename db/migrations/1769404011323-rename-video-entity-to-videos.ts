import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameVideoEntityToVideos1769404011323 implements MigrationInterface {
    name = 'RenameVideoEntityToVideos1769404011323'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE video RENAME TO videos;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "videos" DROP CONSTRAINT "FK_900733992fb36a6d855308c0039"`);
        await queryRunner.query(`DROP TABLE "videos"`);
    }

}
