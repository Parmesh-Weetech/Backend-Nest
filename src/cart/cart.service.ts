import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { APIResponse } from '../common/response/response.dto';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';

import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart.item.entity';
import { AddToCartDTO } from './dtos/create.cartItem.dto';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>,

        @InjectRepository(CartItem)
        private readonly cartItemRepository: Repository<CartItem>,

        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>
    ) { }

    async addToCart(addToCartDTO: AddToCartDTO, user: User): Promise<APIResponse> {
        let cart = await this.cartRepository.findOne({
            where: { user: { id: user.id }, status: 'ACTIVE' },
            relations: ['items', 'items.product'],
        });

        /* 🛒 Create cart if not exists */
        if (!cart) {
            cart = await this.cartRepository.save(
                this.cartRepository.create({ user, status: 'ACTIVE' }),
            );
        }

        const productIds = addToCartDTO.items.map(i => i.productId);

        /* 🔍 Fetch all products in one query */
        const products = await this.productRepository.findBy({
            id: In(productIds),
        });

        if (products.length !== productIds.length) {
            throw new NotFoundException('One or more products not found.');
        }

        const productMap = new Map(products.map(p => [p.id, p]));

        const cartItemsToSave: CartItem[] = [];

        for (const dto of addToCartDTO.items) {
            const product = productMap.get(dto.productId);

            const existingItem = cart.items?.find(
                item => item.product.id === dto.productId,
            );

            if (existingItem) {
                /* ➕ Increase quantity */
                existingItem.quantity += dto.quantity;
                existingItem.total_price = existingItem.quantity * existingItem.price;

                cartItemsToSave.push(existingItem);
            } else {
                /* ➕ New cart item */
                const item = this.cartItemRepository.create({
                    cart,
                    product,
                    quantity: dto.quantity,
                    price: dto.price,
                    total_price: dto.quantity * dto.price,
                });

                cartItemsToSave.push(item);
            }
        }

        await this.cartItemRepository.save(cartItemsToSave);

        return {
            success: true,
            message: 'Items added to cart successfully.',
            data: cart,
            expired: false,
            statusCode: 200,
        };
    }
}
