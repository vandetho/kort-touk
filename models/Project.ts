import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import Category from '@models/Category';
import PaymentMethod from '@models/PaymentMethod';

@Entity('korttouk_project')
export default class Project {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column()
    name: string;

    @Column()
    color: string;

    @Column()
    currency: string;

    @Column()
    archived: boolean;

    @Column()
    balances: number;

    @Column()
    sort: number;

    @Column()
    monthlyExpense: boolean;

    @Column()
    trackTransaction: boolean;

    @Column()
    createdAt: number;

    @Column()
    updatedAt: number;

    @ManyToMany(() => Category, {
        cascade: true,
    })
    @JoinTable({
        name: 'korttouk_project_categories',
        inverseJoinColumn: {
            name: 'categoryId',
            referencedColumnName: 'id',
        },
        joinColumn: {
            name: 'projectId',
            referencedColumnName: 'id',
        },
    })
    categories: Category[];

    @ManyToMany(() => PaymentMethod, {
        cascade: true,
    })
    @JoinTable({
        name: 'korttouk_project_payment_methods',
        inverseJoinColumn: {
            name: 'paymentMethodId',
            referencedColumnName: 'id',
        },
        joinColumn: {
            name: 'projectId',
            referencedColumnName: 'id',
        },
    })
    paymentMethods: PaymentMethod[];
}
