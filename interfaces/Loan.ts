import Transaction from '@models/Transaction';
import Project from '@models/Project';

export class Loan {
    id?: string;
    name: string;
    color: string;
    currency: string;
    archived: boolean;
    balances: number;
    remains: number;
    monthlyExpense: boolean;
    trackTransaction: boolean;
    sort: number;
    createdAt: number;
    updatedAt: number;
    nextTransaction?: Transaction;

    constructor(data: Project & { remains?: number; nextTransaction?: Transaction }) {
        this.id = data.id;
        this.name = data.name;
        this.color = data.color;
        this.currency = data.currency;
        this.archived = data.archived;
        this.balances = data.balances;
        this.remains = data.remains;
        this.monthlyExpense = data.monthlyExpense;
        this.trackTransaction = data.trackTransaction;
        this.sort = data.sort;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.nextTransaction = data.nextTransaction;
    }
}
