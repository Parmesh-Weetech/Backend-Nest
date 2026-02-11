import { Injectable } from "@nestjs/common";
import { DataSource, In, Repository } from "typeorm";
import { Cart } from "./entities/cart.entity";
import { CartItem } from "./entities/cart.item.entity";
import { Product } from "src/product/entities/product.entity";
import { af, r } from "node_modules/@faker-js/faker/dist/airline-CWrCIUHH";

@Injectable()
export class CartRepository extends Repository<Cart> {

    constructor(private dataSource: DataSource) {
        super(Cart, dataSource.createEntityManager());
    }
    async findById(userId: string): Promise<Cart | null> {
        const cart = this.findOne({
            where: { user: { id: userId }, status: 'ACTIVE' },
            relations: ['items', 'items.product'],
        });

        if (!cart) return null;

        return cart;
    }

    async createCart(userId: string): Promise<Cart | null> {
        const newCart = this.create({
            user: { id: userId },
            status: "ACTIVE"
        });

        const saveCart = await this.save(newCart);

        if (!saveCart) return null;

        return saveCart;
    }
}

@Injectable()
export class CartItemRepository extends Repository<CartItem> {
    constructor(private dataSource: DataSource) {
        super(Cart, dataSource.createEntityManager());
    }

    async createCartItem(cart: Cart, product: Product, quantity: number, price: number): Promise<CartItem | null> {
        const newCartItem = this.create({
            cart,
            product,
            quantity: quantity,
            price: price,
            total_price: quantity * price,
        });

        if (!newCartItem) return null;

        return newCartItem;
    }

    async saveCartItem(cartItems: CartItem[]): Promise<CartItem[] | null> {
        const saveCartItem = await this.save(cartItems);

        if (!saveCartItem) return null;

        return saveCartItem;
    }

    async findByUserId(userId: string): Promise<CartItem[] | null> {
        const cartItems = await this.find({
            where: { cart: { user: { id: userId } } }, relations: {
                cart: {
                    user: true
                }, product: true
            }
        });

        if (!cartItems) return null;

        return cartItems;
    }

    async findById(ids: string[]): Promise<CartItem[] | null> {
        const cartItems = await this.find({
            where: { id: In(ids) },
            relations: {
                cart: { user: true }
            },
        });

        if(!cartItems) return null;

        return cartItems;
    }

    async deleteById(id: string): Promise<boolean> {
        const affectedRows = await this.delete(id);

        if(affectedRows.affected === undefined || affectedRows.affected === null || affectedRows.affected === 0) return false;
        
        return true;
    }
}