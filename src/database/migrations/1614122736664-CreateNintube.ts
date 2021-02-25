import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateNintube1614122736664 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
		await queryRunner.createTable(
			new Table({
				name: 'nintubes',
				columns: [
					{
						name: 'id',
						type: 'varchar',
						isPrimary: true,
						generationStrategy: 'uuid',
						default: 'uuid_generate_v4()',
					},
					{
						name: 'nickname',
						type: 'varchar',
						isNullable: false,
					},
					{
						name: 'file',
						type: 'varchar',
						isNullable: false,
					},
				],
			}),
		);
	}
	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('nintubes');
	}
}
