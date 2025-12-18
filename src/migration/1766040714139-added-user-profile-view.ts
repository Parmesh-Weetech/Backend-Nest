import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedUserProfileView1766040714139 implements MigrationInterface {
    name = 'AddedUserProfileView1766040714139'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE VIEW "user_profile_view" AS 
    SELECT
      u.id   AS "userId",
      u.name AS "userName",
      p.id   AS "profileId",
      p.bio  AS "profileBio"
    FROM "user" u
    LEFT JOIN profile p
      ON u."profileId" = p.id
  `);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`, ["public","VIEW","user_profile_view","SELECT\n      u.id   AS \"userId\",\n      u.name AS \"userName\",\n      p.id   AS \"profileId\",\n      p.bio  AS \"profileBio\"\n    FROM \"user\" u\n    LEFT JOIN profile p\n      ON u.\"profileId\" = p.id"]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`, ["VIEW","user_profile_view","public"]);
        await queryRunner.query(`DROP VIEW "user_profile_view"`);
    }

}
