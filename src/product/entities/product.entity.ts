import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { User } from "../../user/entities/user.entity";

@Entity("product")
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.products, { nullable: false, cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE" })
    user: User;

    @Column()
    name: string

    @Column()
    image: string

    @Column('numeric', {
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value),
        },
    })
    price: number;

    @Column("numeric", {
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value),
        }
    })
    rating: number;

    @Column("text", { array: true })
    mealType: string[]

    @Column()
    cuisine: string

    @Column("text", { array: true })
    ingredients: string[]

    @Column("text", { array: true })
    instructions: string[]

    @Column({ type: 'int', default: 0 })
    prepTimeMinutes: number;

    @Column({ type: 'int', default: 0 })
    cookTimeMinutes: number;

    @Column({ type: 'enum', enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' })
    difficulty: 'Easy' | 'Medium' | 'Hard';

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    deleted_at?: Date;
}