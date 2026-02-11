import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Cart } from "./cart.entity";
import { Product } from "../../product/entities/product.entity";

@Entity('cart_item')
export class CartItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Cart, cart => cart.items, {
        onDelete: 'CASCADE',
    })
    cart: Cart;

    @ManyToOne(() => Product, { eager: true })
    product: Product;

    @Column({ type: 'int', default: 1 })
    quantity: number;

    @Column('numeric', {
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value),
        },
    })
    price: number;

    @Column('numeric', {
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value),
        }, default: 0
    })
    total_price: number;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;
}
