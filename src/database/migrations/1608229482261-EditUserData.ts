import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class EditUserData1608229482261 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {

		await queryRunner.dropColumn('users', 'first_name');
		await queryRunner.dropColumn('users', 'last_name');


		await queryRunner.addColumn('users', new TableColumn({
			name: "username",
			type: 'varchar',
			isNullable: false
		}));
		await queryRunner.addColumn('users', new TableColumn({
			name: "birthdate",
			type: 'timestamp with time zone',
			isNullable: false
		}));

	}

	public async down(queryRunner: QueryRunner): Promise<void> {
	}

}
