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

    @Column("numeric", { precision: 10, scale: 2 })
    price: number;

    @Column("numeric", { precision: 2, scale: 1 })
    rating: number;

    @Column("text", { array: true })
    mealType: [string]

    @Column()
    cuisine: string

    @Column("text", { array: true })
    ingredients: [string]

    @Column("text", { array: true })
    instructions: [string]

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    deleted_at?: Date;
}