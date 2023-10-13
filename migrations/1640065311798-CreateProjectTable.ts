import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProjectTable1640065311798 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'korttouk_project',
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
                    },
                    {
                        name: 'color',
                        type: 'text',
                    },
                    {
                        name: 'currency',
                        type: 'text',
                    },
                    {
                        name: 'archived',
                        type: 'boolean',
                    },
                    {
                        name: 'sort',
                        type: 'integer',
                    },
                    {
                        name: 'monthlyExpense',
                        type: 'boolean',
                    },
                    {
                        name: 'trackTransaction',
                        type: 'boolean',
                    },
                    {
                        name: 'balances',
                        type: 'numeric',
                        precision: 20,
                        scale: 2,
                    },
                    {
                        name: 'createdAt',
                        type: 'integer',
                    },
                    {
                        name: 'updatedAt',
                        type: 'integer',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('korttouk_project');
    }
}
