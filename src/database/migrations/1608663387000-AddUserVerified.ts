import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddUserVerified1608233225731 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {

		await queryRunner.addColumn('users', new TableColumn({
			name: "verified",
			type: 'boolean',
			isNullable: true
		}));
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
	}

}
