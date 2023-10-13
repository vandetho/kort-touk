import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('korttouk_category')
export default class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    color: string;

    @Column()
    icon: string;

    @Column()
    sort: number;

    @Column()
    createdAt: number;

    @Column()
    updatedAt: number;
}
