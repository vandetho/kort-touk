import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProjectCategoryTable1640072642578 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'korttouk_project_categories',
                columns: [
                    {
                        name: 'categoryId',
                        type: 'uuid',
                        isPrimary: true,
                    },
                    {
                        name: 'projectId',
                        type: 'uuid',
                        isPrimary: true,
                    },
                ],
                foreignKeys: [
                    {
                        name: 'fk_project_category_categories',
                        referencedTableName: 'korttouk_category',
                        referencedColumnNames: ['id'],
                        columnNames: ['categoryId'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    },
                    {
                        name: 'fk_project_category_projects',
                        referencedTableName: 'korttouk_project',
                        referencedColumnNames: ['id'],
                        columnNames: ['projectId'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('korttouk_project_categories');
    }
}
