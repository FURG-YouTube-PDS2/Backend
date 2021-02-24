import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddVideoThumb1613745449653 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn(
			'videos',
			new TableColumn({
				name: 'thumb',
				type: 'varchar',
				isNullable: true,
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {}
}
