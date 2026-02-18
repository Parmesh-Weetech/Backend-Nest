import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { APIResponse } from '../common/response/response.dto';
import { User } from '../user/entities/user.entity';
import { DatabaseResolver } from '../common/resolvers/database.resolver';
import { CacheService } from '../cache/cache.service';

import { CreateCartItemDTO, RemoveCartItemDTO } from './dtos/create.cartItem.dto';
import { CART_REPOSITORY, type ICartRepository } from './cart.repository.interface';
import { Cart } from './entities/cart.entity';
import { CartDocument } from './schemas/cart.schema';

@Injectable()
export class CartService {
    constructor(
        @Inject(CART_REPOSITORY)
        private readonly cartRepository: ICartRepository,
        private readonly databaseResolver: DatabaseResolver,
        private readonly cacheService: CacheService
    ) { }

    private get isMongoProvider() {
        return this.databaseResolver.provider === 'mongodb';
    }

    async addToCart(createCartItemDTO: CreateCartItemDTO, userId: string): Promise<APIResponse> {
        let cart = await this.cartRepository.findActiveCartByUser(userId);
        if (!cart) cart = await this.cartRepository.createCart(userId);

        if (!cart) throw new InternalServerErrorException({ message: "Internal Server Error while processing cart. " });

        const product = await this.cartRepository.findProductById(createCartItemDTO.productId);
        if (!product) throw new BadRequestException({ message: "Product is not exists in db" });

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
                id: this.isMongoProvider ? cart._id?.toString?.() ?? cart.id : cart.id,
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
                id: cartItem.data.id,
                productId: cartItem.data.productId,
                quantity: cartItem.data.quantity,
                price: cartItem.data.price,
                image: cartItem.data.image,
                mealType: cartItem.data.mealType,
                name: cartItem.data.name
            },
            expired: false,
            message: "Quantity Updated Successfully.",
            statusCode: 200
        }
    }

    async findCart(userId: string): Promise<APIResponse> {
        const cartItems = await this.cartRepository.findCartItems(userId);

        if (!cartItems || cartItems.length == 0) {
            const cart = await this.cartRepository.findActiveCartByUser(userId);

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
            const { product, productId, ...rest } = item;
            const resolvedProduct = this.isMongoProvider ? productId : product;
            return {
                ...rest,
                productId: resolvedProduct.id ?? resolvedProduct._id?.toString?.(),
                image: resolvedProduct.image,
                name: resolvedProduct.name,
                mealType: resolvedProduct.mealType,
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
                id: this.isMongoProvider
                    ? cartItem.cart?._id?.toString?.() ?? cartItem.cart?.id
                    : cartItem.cart.id,
                productId: this.isMongoProvider
                    ? cartItem.productId?._id?.toString?.() ?? cartItem.productId?.id
                    : cartItem.product.id,
                name: this.isMongoProvider ? cartItem.productId?.name : cartItem.product.name,
                image: this.isMongoProvider ? cartItem.productId?.image : cartItem.product.image,
                quantity: cartItem.quantity,
                price: cartItem.price,
                mealType: this.isMongoProvider ? cartItem.productId?.mealType : cartItem.product.mealType
            },
            expired: false,
            message: "Cart Item fetch successfully.",
            statusCode: 200
        };
    }

    async removeCartItem(removeCartItemDTO: RemoveCartItemDTO, userId: string): Promise<APIResponse> {
        await this.cartRepository.removeItemsByIds(
            removeCartItemDTO.ids,
            userId
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
