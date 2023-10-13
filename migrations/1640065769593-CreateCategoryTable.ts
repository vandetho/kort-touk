import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCategoryTable1640065769593 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'korttouk_category',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'name',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'color',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'icon',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'sort',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'createdAt',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'updatedAt',
                        type: 'integer',
                        isNullable: false,
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('korttouk_category');
    }
}
