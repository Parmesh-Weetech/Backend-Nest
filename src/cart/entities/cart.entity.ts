import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { User } from "../../user/entities/user.entity";
import { CartItem } from "./cart.item.entity";

@Entity("cart")
export class Cart {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({
        type: 'enum',
        enum: ['ACTIVE', 'CHECKED_OUT', 'ORDER'],
        default: 'ACTIVE',
    })
    status: 'ACTIVE' | 'CHECKED_OUT' | 'ORDER';
    @OneToOne(() => User, user => user.cart, { cascade: true, onUpdate: "CASCADE", onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;

    @OneToMany(() => CartItem, item => item.cart)
    items: CartItem[];

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    deleted_at?: Date;
}