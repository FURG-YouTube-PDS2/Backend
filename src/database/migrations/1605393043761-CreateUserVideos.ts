import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateUserVideos1605393043761 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
          new Table({
              name: 'user_videos',
              columns: [
                  {
                    name: 'id',
                    type: 'varchar',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                  },
                  {
                    name: 'liked',
                    type: 'integer',
                    isNullable: false,
                  },
                  {
                    name: 'reported',
                    type: 'boolean',
                    isNullable: false,
                  },
                  {
                    name: 'report_text',
                    type: 'varchar',
                    isNullable: false,
                  },
                  {
                    name: 'report_option',
                    type: 'varchar',
                    isNullable: false,
                  },
                  {
                    name: 'watches',
                    type: 'integer',
                    isNullable: false,
                  },
                  {
                    name: 'is_owner',
                    type: 'boolean',
                    isNullable: false,
                  },
                  {
                    name: 'user_id',
                    type: 'varchar',
                    isNullable: false,
                  },
                  {
                    name: 'video_id',
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
  }

}
