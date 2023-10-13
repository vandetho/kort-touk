import { MigrationInterface, QueryRunner } from 'typeorm';
import PaymentMethod from '@models/PaymentMethod';
import { CreatePaymentMethod } from '@interfaces';

const PAYMENT_METHODS: CreatePaymentMethod[] = [
    {
        icon: 'money-bill',
        name: 'Cash',
    },
    {
        icon: 'cc-visa',
        name: 'Visa Card',
    },
    {
        icon: 'cc-mastercard',
        name: 'Master Card',
    },
    {
        icon: 'cc-paypal',
        name: 'Paypal',
    },
    {
        icon: 'cc-stripe',
        name: 'Stripe',
    },
    {
        icon: 'cc-apple-pay',
        name: 'Apple Pay',
    },
    {
        icon: 'exchange-alt',
        name: 'Bank Transfer',
    },
];

export class SeedPaymentMethodTable1640073668988 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const repository = queryRunner.connection.getRepository(PaymentMethod);
        const now = new Date().getTime();
        const paymentMethods = PAYMENT_METHODS.map((paymentMethod, index) => ({
            ...paymentMethod,
            sort: index,
            createdAt: now,
            updatedAt: now,
        }));
        await repository.save(paymentMethods);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
