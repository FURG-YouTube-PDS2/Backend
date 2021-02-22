import {MigrationInterface, QueryRunner} from "typeorm";

export class EditVideoPrivateFieldName1614026406190 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "videos" RENAME COLUMN "private" TO "privacy"`);
		await queryRunner.query(`ALTER TABLE "videos" ALTER COLUMN "privacy" SET DEFAULT FALSE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
