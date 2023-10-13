import { Currency } from './Currency';
import Category from '@models/Category';
import PaymentMethod from '@models/PaymentMethod';

export interface CreateProject {
    name: string;
    color: string;
    currency: Currency;
    archived: boolean;
    monthlyExpense: boolean;
    trackTransaction: boolean;
    balances: number;
    sort: number;
    createdAt?: number;
    updatedAt?: number;
    categories: Category[];
    paymentMethods: PaymentMethod[];
}
