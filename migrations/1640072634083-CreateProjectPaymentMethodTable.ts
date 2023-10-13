import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProjectPaymentMethodTable1640072634083 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'korttouk_project_payment_methods',
                columns: [
                    {
                        name: 'paymentMethodId',
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
                        name: 'fk_project_payment_method_payment_methods',
                        referencedTableName: 'korttouk_payment_method',
                        referencedColumnNames: ['id'],
                        columnNames: ['paymentMethodId'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    },
                    {
                        name: 'fk_project_payment_method_projects',
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
        await queryRunner.dropTable('korttouk_project_payment_method');
    }
}
