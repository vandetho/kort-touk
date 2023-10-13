import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Category from '@models/Category';
import PaymentMethod from '@models/PaymentMethod';
import Project from '@models/Project';

@Entity('korttouk_transaction')
export default class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    amount: number;

    @Column()
    debit: boolean;

    @Column()
    note?: string;

    @Column()
    doneAt: number;

    @ManyToOne(() => Category, { nullable: true })
    category: Category;

    @ManyToOne(() => PaymentMethod, { nullable: true })
    paymentMethod: PaymentMethod;

    @ManyToOne(() => Project, { eager: false })
    project: Project;

    @Column()
    createdAt: number;

    @Column()
    updatedAt: number;
}
