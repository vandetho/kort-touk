import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTransactionTable1640065759890 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'korttouk_transaction',
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
                        name: 'debit',
                        type: 'boolean',
                    },
                    {
                        name: 'amount',
                        type: 'numeric',
                        precision: 20,
                        scale: 2,
                    },
                    {
                        name: 'note',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'doneAt',
                        type: 'integer',
                    },
                    {
                        name: 'createdAt',
                        type: 'integer',
                    },
                    {
                        name: 'updatedAt',
                        type: 'integer',
                    },
                    {
                        name: 'categoryId',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'paymentMethodId',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'projectId',
                        type: 'uuid',
                    },
                ],
                foreignKeys: [
                    {
                        name: 'fk_transaction_category',
                        referencedTableName: 'korttouk_category',
                        referencedColumnNames: ['id'],
                        columnNames: ['categoryId'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    },
                    {
                        name: 'fk_transaction_payment_method',
                        referencedTableName: 'korttouk_payment_method',
                        referencedColumnNames: ['id'],
                        columnNames: ['paymentMethodId'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('korttouk_transaction');
    }
}
