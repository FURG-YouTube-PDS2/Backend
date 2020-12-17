import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddUserPhoneGender1608233225731 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {

		await queryRunner.addColumn('users', new TableColumn({
			name: "phone",
			type: 'varchar',
			isNullable: false
		}));

		await queryRunner.addColumn('users', new TableColumn({
			name: "gender",
			type: 'varchar',
			isNullable: false
		}));

	}

	public async down(queryRunner: QueryRunner): Promise<void> {
	}

}
