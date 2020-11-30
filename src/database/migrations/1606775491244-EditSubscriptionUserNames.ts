import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class EditSubscriptionUserNames1606775491244 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {

		await queryRunner.dropColumn('subscriptions', 'user_id1');
		await queryRunner.dropColumn('subscriptions', 'user_id2');


		await queryRunner.addColumn('subscriptions', new TableColumn({
			name: "user_subscriber",
			type: 'varchar',
		}));
		await queryRunner.addColumn('subscriptions', new TableColumn({
			name: "user_target",
			type: 'varchar',
		}));


		await queryRunner.addColumn('users', new TableColumn({
			name: "avatar",
			type: 'varchar',
		}));

	}

	public async down(queryRunner: QueryRunner): Promise<void> {
	}

}
