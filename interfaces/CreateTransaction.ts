import Category from '@models/Category';
import PaymentMethod from '@models/PaymentMethod';
import Project from '@models/Project';

export interface CreateTransaction {
    name: string;
    amount: number;
    debit: boolean;
    note?: string;
    doneAt: number;
    category: Category;
    paymentMethod: PaymentMethod;
    project: Project;
}
