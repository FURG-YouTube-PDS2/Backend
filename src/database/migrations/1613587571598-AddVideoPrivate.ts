import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddVideoPrivate1613587571598 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn(
			'videos',
			new TableColumn({
				name: 'private',
				type: 'boolean',
				isNullable: true,
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {}
}
