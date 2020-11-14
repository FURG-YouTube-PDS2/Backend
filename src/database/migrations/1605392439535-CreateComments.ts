import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateComments1605392439535 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'comments',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'text',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp with time zone',
                        isNullable: false,
                    },
                    {
                        name: 'edited',
                        type: 'boolean',
                        isNullable: true,
                    },
                    {
                        name: 'video_id',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'reply_id',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'user_id',
                        type: 'varchar',
                        isNullable: false
                    }
                ],
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}

