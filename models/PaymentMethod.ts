import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('korttouk_payment_method')
export default class PaymentMethod {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    icon: string;

    @Column()
    sort: number;

    @Column()
    createdAt: number;

    @Column()
    updatedAt: number;
}
