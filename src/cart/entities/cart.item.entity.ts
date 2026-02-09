import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Cart } from "./cart.entity";
import { Product } from "../../product/entities/product.entity";

@Entity('cart_item')
export class CartItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Cart, cart => cart.items, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    cart: Cart;

    @ManyToOne(() => Product, { eager: true })
    product: Product;

    @Column({ type: 'int', default: 1 })
    quantity: number;

    @Column('numeric', { precision: 10, scale: 2 })
    price_at_time: number;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;
}
