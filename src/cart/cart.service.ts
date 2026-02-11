import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { APIResponse } from '../common/response/response.dto';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';

import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart.item.entity';
import { AddToCartDTO, RemoveCartItemDTO } from './dtos/create.cartItem.dto';
import { CartItemRepository, CartRepository } from './cart.repository';
import { ProductRepository } from '../product/product.repository';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(CartRepository)
        private readonly cartRepository: CartRepository,

        @InjectRepository(CartItemRepository)
        private readonly cartItemRepository: CartItemRepository,

        @InjectRepository(ProductRepository)
        private readonly productRepository: ProductRepository
    ) { }

    async addToCart(addToCartDTO: AddToCartDTO, user: User): Promise<APIResponse> {
        let cart = await this.cartRepository.findById(user.id);

        /* 🛒 Create cart if not exists */
        if (!cart) {
            cart = await this.cartRepository.createCart(user.id);

            if (!cart) throw new InternalServerErrorException({ message: "Something went wrong while creating new cart!" });
        }

        const productIds = addToCartDTO.items.map(i => i.productId);

        /* 🔍 Fetch all products in one query */
        const products = await this.productRepository.findByProductIds(productIds);

        if (!products || products.length === 0) throw new InternalServerErrorException({ message: "Something went wrong while fetching products" });

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
                const item = await this.cartItemRepository.createCartItem(cart, product!, dto.quantity, dto.price);

                if(!item) throw new InternalServerErrorException({ message: "Something went wrong while saving cart items. "});

                cartItemsToSave.push(item);
            }
        }

        const saveCartItem = await this.cartItemRepository.saveCartItem(cartItemsToSave);

        if(!saveCartItem) throw new InternalServerErrorException({ message: "Something went wrong while saving cart item" });

        return {
            success: true,
            message: 'Items added to cart successfully.',
            data: cart,
            expired: false,
            statusCode: 200,
        };
    }

    async findCart(user: User): Promise<APIResponse> {
        const cartItem = await this.cartItemRepository.find({
            where: { cart: { user: { id: user.id } } }, relations: {
                cart: {
                    user: true
                }, product: true
            }
        });

        if (!cartItem || cartItem.length == 0) {
            const cart = await this.cartRepository.find({ where: { user: { id: user.id } } });

            if (!cart) throw new NotFoundException("Cart not found.");

            return {
                success: true,
                data: cart,
                expired: false,
                message: "Cart fetched successfully.",
                statusCode: 200
            }
        }

        return {
            success: true,
            data: cartItem,
            message: "Cart fetched successfully.",
            expired: false,
            statusCode: 200
        }
    }

    async removeCartItem(removeCartItemDTO: RemoveCartItemDTO, user: User): Promise<APIResponse> {
        const cartItems = await this.cartItemRepository.find({
            where: { id: In(removeCartItemDTO.ids) },
            relations: {
                cart: { user: true }
            },
        });

        for (const item of cartItems) {
            if (item.cart.user.id !== user.id) {
                throw new ForbiddenException('You are not authorized to remove this item.');
            }

            const removeCartItem = await this.cartItemRepository.delete(item.id);

            if (removeCartItem.affected === 0) {
                throw new InternalServerErrorException("Something went wrong while removing cart item.");
            }
        }

        return {
            success: true,
            data: null,
            expired: false,
            message: "Cart-Item removed successfully.",
            statusCode: 200,
        };
    }
}
