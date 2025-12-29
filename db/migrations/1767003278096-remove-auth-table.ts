import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveAuthTable1767003278096 implements MigrationInterface {
    name ="RemoveAuthTable1767003278096";

    public async up(queryRunner: QueryRunner): Promise<void> {
        // drop foreign keys first if any
        await queryRunner.query(`DROP TABLE IF EXISTS "auth" CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // optional: recreate auth table if rollback needed
        await queryRunner.query(`
            CREATE TABLE "auth" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_auth_id" PRIMARY KEY ("id")
            )
        `);
    }
}
