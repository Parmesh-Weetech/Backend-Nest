import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart.item.entity';
import { Product } from '../product/entities/product.entity';
import { ICartRepository } from './cart.repository.interface';

@Injectable()
export class PostgresCartRepository implements ICartRepository {
    constructor(
        @InjectRepository(Cart)
        private readonly cartRepo: Repository<Cart>,

        @InjectRepository(CartItem)
        private readonly cartItemRepo: Repository<CartItem>,

        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
    ) { }

    async findActiveCartByUser(userId: string) {
        return await this.cartRepo.findOne({
            where: { user: { id: userId }, status: 'ACTIVE' },
            relations: ['items', 'items.product'],
        });
    }

    async findProductById(productId: string) {
        return this.productRepo.findOne({ where: { id: productId } });
    }

    async createCart(userId: string) {
        const cart = this.cartRepo.create({
            user: { id: userId } as any,
        });
        return this.cartRepo.save(cart);
    }

    async addCartItem(data: {
        cartId: string;
        productId: string;
        quantity: number;
        price: number;
    }) {
        const cartItem = this.cartItemRepo.create({
            cart: { id: data.cartId } as any,
            product: { id: data.productId } as any,
            quantity: data.quantity,
            price: data.price,
            total_price: data.price * data.quantity,
        });

        return this.cartItemRepo.save(cartItem);
    }

    async updateItemQuantity(productId: string, userId: string, quantity: number) {
        const item = await this.cartItemRepo.findOne({
            where: {
                product: { id: productId },
                cart: { user: { id: userId } },
            },
            relations: ['product', 'cart'],
        });

        if (!item) return false;

        item.quantity = quantity;
        item.total_price = item.price * quantity;

        await this.cartItemRepo.save(item);
        return true;
    }

    async findCartItems(userId: string) {
        return this.cartItemRepo.find({
            where: { cart: { user: { id: userId } } },
            relations: ['product', 'cart'],
        });
    }

    async findCartItem(productId: string, userId: string) {
        return this.cartItemRepo.findOne({
            where: {
                product: { id: productId },
                cart: { user: { id: userId } },
            },
            relations: ['product', 'cart'],
        });
    }

    async removeItemsByIds(ids: string[], userId: string) {
        const items = await this.cartItemRepo.find({
            where: { id: In(ids), cart: { user: { id: userId } } },
        });

        if (!items.length) return false;

        await this.cartItemRepo.remove(items);
        return true;
    }

    async removeByProductId(productId: string, userId: string) {
        const result = await this.cartItemRepo.delete({
            product: { id: productId },
            cart: { user: { id: userId } },
        });

        return !!result.affected;
    }
}
