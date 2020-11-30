import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateSubscription1605392876148 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'subscriptions',
				columns: [
					{
						name: 'id',
						type: 'varchar',
						isPrimary: true,
						generationStrategy: 'uuid',
						default: 'uuid_generate_v4()',
					},
					{
						name: 'user_id1',
						type: 'varchar',
						isNullable: false,
					},
					{
						name: 'user_id2',
						type: 'varchar',
						isNullable: false,
					},
					{
						name: 'created_at',
						type: 'timestamp with time zone',
						isNullable: false
					}
				],
			})
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("subscriptions");
	}

}

