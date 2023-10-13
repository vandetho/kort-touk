import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import PaymentMethod from '@models/PaymentMethod';
import Category from '@models/Category';

@Entity('korttouk_template')
export default class Template {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    amount: number;

    @Column()
    debit: boolean;

    @Column()
    createdAt: number;

    @Column()
    updatedAt: number;

    @ManyToOne(() => Category)
    category: Category;

    @ManyToOne(() => PaymentMethod)
    paymentMethod: PaymentMethod;
}
