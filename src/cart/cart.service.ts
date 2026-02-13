import { BadRequestException, ForbiddenException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { APIResponse } from '../common/response/response.dto';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';

import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart.item.entity';
import { CreateCartItemDTO, RemoveCartItemDTO } from './dtos/create.cartItem.dto';
import { CART_REPOSITORY, type ICartRepository } from './cart.repository.interface';

@Injectable()
export class CartService {
    constructor(
        @Inject(CART_REPOSITORY)
        private readonly cartRepository: ICartRepository,
    ) { }

    async addToCart(createCartItemDTO: CreateCartItemDTO, user: User): Promise<APIResponse> {
        let cart = await this.cartRepository.findActiveCartByUser(user.id);

        if (!cart) {
            cart = await this.cartRepository.createCart(user.id);
        }

        const product = await this.cartRepository.findProductById(createCartItemDTO.productId);
        if(!product) throw new BadRequestException({ message: "Product is not exists in db" });

        const cartItem = await this.cartRepository.addCartItem({
            cartId: cart.id || cart._id,
            productId: product.id,
            quantity: createCartItemDTO.quantity ?? 1,
            price: createCartItemDTO.price
        });

        if (!cartItem) throw new InternalServerErrorException({ message: "Something went wrong while adding items to cart " });

        return {
            success: true,
            data: {
                id: cart.id,
                productId: createCartItemDTO.productId,
                quantity: createCartItemDTO.quantity,
                price: createCartItemDTO.price,
                image: product.image,
                mealType: product.mealType,
                name: product.name
            },
            expired: false,
            message: "Product Added to Cart Successfully",
            statusCode: 200
        }
    }

    async updateQuantity(productId: string, quantity: number, userId: string): Promise<APIResponse> {
        const updated = await this.cartRepository.updateItemQuantity(productId, userId, quantity);

        if (!updated) {
            throw new InternalServerErrorException({
                message: 'Something went wrong while updating quantity',
            });
        }

        const cartItem = await this.findOne(productId, userId);

        return {
            success: true,
            data: {
                id: cartItem.data.cart.id,
                productId: cartItem.data.product.id,
                quantity: cartItem.data.quantity,
                price: cartItem.data.price,
                image: cartItem.data.product.image,
                mealType: cartItem.data.product.mealType,
                name: cartItem.data.product.name
            },
            expired: false,
            message: "Quantity Updated Successfully.",
            statusCode: 200
        }
    }

    async findCart(user: User): Promise<APIResponse> {
        const cartItems = await this.cartRepository.findCartItems(user.id);

        if (!cartItems || cartItems.length == 0) {
            const cart = await this.cartRepository.findActiveCartByUser(user.id);

            if (!cart) throw new NotFoundException("Cart or CartItem not found.");

            return {
                success: true,
                data: cart,
                expired: false,
                message: "Cart fetched successfully.",
                statusCode: 200
            }
        }

        const formattedCartItems = cartItems.map((item) => {
            const { product, ...rest } = item;
            return {
                ...rest,
                productId: product.id,
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
        const cartItem = await this.cartRepository.findCartItem(productId, userId);
        if (!cartItem) throw new InternalServerErrorException({ message: "Something went wrong while fetching cart item " });

        return {
            success: true,
            data: {
                id: cartItem.cart.id,
                productId: cartItem.product.id,
                name: cartItem.product.name,
                image: cartItem.product.image,
                quantity: cartItem.quantity,
                price: cartItem.price,
                mealType: cartItem.product.mealType
            },
            expired: false,
            message: "Cart Item fetch successfully.",
            statusCode: 200
        };
    }

    async removeCartItem(removeCartItemDTO: RemoveCartItemDTO, user: User): Promise<APIResponse> {
        await this.cartRepository.removeItemsByIds(
            removeCartItemDTO.ids,
            user.id
        );

        return {
            success: true,
            data: null,
            expired: false,
            message: "Cart-Item removed successfully.",
            statusCode: 200,
        };
    }

    async removeCartItemById(productId: string, userId: string): Promise<APIResponse> {
        const deleted = await this.cartRepository.removeByProductId(productId, userId);

        if (!deleted) {
            throw new NotFoundException('Cart not found');
        }

        return {
            success: true,
            data: null,
            expired: false,
            message: "Product removeed successfully from cart.",
            statusCode: 200
        }
    }
}
