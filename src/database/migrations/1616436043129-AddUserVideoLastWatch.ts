import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class EditUserVideo1616435699136 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn(
			'user_videos',
			new TableColumn({
				name: 'last_watch',
				type: 'timestamp with time zone',
				isNullable: false,
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {}
}
