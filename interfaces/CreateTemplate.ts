import Category from '@models/Category';
import PaymentMethod from '@models/PaymentMethod';

export interface CreateTemplate {
    name: string;
    amount: number;
    debit: boolean;
    category: Category | undefined;
    paymentMethod: PaymentMethod | undefined;
}
