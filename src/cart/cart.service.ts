import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { APIResponse } from '../common/response/response.dto';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';

import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart.item.entity';
import { AddToCartDTO, RemoveCartItemDTO } from './dtos/create.cartItem.dto';

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
                existingItem.quantity += (dto.quantity ?? 1);
                existingItem.total_price = existingItem.quantity * existingItem.price;

                cartItemsToSave.push(existingItem);
            } else {
                /* ➕ New cart item */
                const item = this.cartItemRepository.create({
                    cart,
                    product,
                    quantity: dto.quantity,
                    price: dto.price,
                    total_price: (dto.quantity ?? 1) * dto.price,
                });

                cartItemsToSave.push(item);
            }
        }

        const saveCartItem = await this.cartItemRepository.save(cartItemsToSave);

        if (!saveCartItem || saveCartItem.length === 0) throw new InternalServerErrorException({ message: "Somethingwent wrong while saving cart item. " });

        const existingCartItem = await this.cartItemRepository.find({
            where: { cart: { id: cart.id } }, relations: {
                product: true,
                cart: true
            }
        });

        const specificCartItem = existingCartItem.map((item) => {
            return {
                image: item.product.image,
                name: item.product.name,
                mealType: item.product.mealType
            }
        })

        return {
            success: true,
            message: 'Items added to cart successfully.',
            data: {
                ...cart,
                items: specificCartItem
            },
            expired: false,
            statusCode: 200,
        };
    }

    async updateQuantity(productId: string, quantity: number, userId: string): Promise<APIResponse> {
        const subQuery = this.cartRepository
            .createQueryBuilder('cart')
            .innerJoin('cart.user', 'user')
            .select('cart.id')
            .where('user.id = :userId', { userId })
            .andWhere('cart.status = :status', { status: 'ACTIVE' })
            .getQuery();

        const updateQuantity = await this.cartItemRepository
            .createQueryBuilder()
            .update(CartItem)
            .set({
                quantity,
                total_price: () => `"price" * ${quantity}`,
            })
            .where('productId = :productId', { productId })
            .andWhere(`cartId IN (${subQuery})`)
            .setParameters({ userId, status: 'ACTIVE' })
            .execute();

        if (updateQuantity.affected === null || updateQuantity.affected === undefined || updateQuantity.affected === 0) throw new InternalServerErrorException({ message: "Something went wrong while updating quantity" });

        const cartItem = await this.findOne(productId, userId);

        return {
            success: true,
            data: cartItem.data,
            expired: false,
            message: "Quantity Updated Successfully.",
            statusCode: 200
        }
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

            if (!cart) throw new NotFoundException("Cart or CartItem not found.");

            return {
                success: true,
                data: cart,
                expired: false,
                message: "Cart fetched successfully.",
                statusCode: 200
            }
        }

        const formattedCartItems = cartItem.map((item) => {
            const { product, ...rest } = item;
            return {
                ...rest,
                image: product.image,
                name: product.name,
                mealType: product.mealType,
            };
        });

        return {
            success: true,
            data: formattedCartItems,
            message: "Cart fetched successfully.",
            expired: false,
            statusCode: 200
        }
    }

    async findOne(productId: string, userId: string): Promise<APIResponse> {
        const cartItem = await this.cartItemRepository.findOne({
            where: { product: { id: productId }, cart: { user: { id: userId } } }, relations: {
                cart: true
            }
        });

        if (!cartItem) throw new InternalServerErrorException({ message: "Something went wrong while fetching cart item " });

        return {
            success: true,
            data: cartItem,
            expired: false,
            message: "Cart Item fetch successfully.",
            statusCode: 200
        };
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

    async removeCartItemById(productId: string, userId: string): Promise<APIResponse> {
        const affectedRows = await this.cartItemRepository.delete({ product: { id: productId }, cart: { user: { id: userId } } });

        if (affectedRows.affected === undefined || affectedRows.affected === null || affectedRows.affected === 0) throw new InternalServerErrorException({ message: "Something went wrong while removing product from cart!" });

        return {
            success: true,
            data: null,
            expired: false,
            message: "Product removeed successfully from cart.",
            statusCode: 200
        }
    }
}
