import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateVideos1605392887633 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'videos',
				columns: [
					{
						name: 'id',
						type: 'varchar',
						isPrimary: true,
						generationStrategy: 'uuid',
						default: 'uuid_generate_v4()',
					},
					{
						name: 'title',
						type: 'varchar',
						isNullable: false,
					},
					{
						name: 'description',
						type: 'varchar',
						isNullable: false,
					},
					{
						name: 'file',
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
		await queryRunner.dropTable("videos");
	}

}
