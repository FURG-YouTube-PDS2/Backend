import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateNotification1617040976200 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'notifications',
				columns: [
					{
						name: 'id',
						type: 'varchar',
						isPrimary: true,
						generationStrategy: 'uuid',
						default: 'uuid_generate_v4()',
					},
					{
						name: 'type',
						type: 'varchar',
						isNullable: false,
					},
					{
						name: 'readed',
						type: 'boolean',
						isNullable: true,
					},
					{
						name: 'user_id',
						type: 'varchar',
						isNullable: false,
					},
					{
						name: 'action_id',
						type: 'varchar',
						isNullable: true,
					},
					{
						name: 'target_id',
						type: 'varchar',
						isNullable: false,
					},
					{
						name: 'created_at',
						type: 'timestamp with time zone',
						isNullable: false,
					},
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('notifications');
	}
}
