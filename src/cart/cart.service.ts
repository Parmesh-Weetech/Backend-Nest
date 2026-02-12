import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { APIResponse } from '../common/response/response.dto';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';

import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart.item.entity';
import { CreateCartItemDTO, RemoveCartItemDTO } from './dtos/create.cartItem.dto';

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

    async addToCart(createCartItemDTO: CreateCartItemDTO, user: User): Promise<APIResponse> {
        let cart = await this.cartRepository.findOne({
            where: { user: { id: user.id }, status: 'ACTIVE' },
            relations: ['items', 'items.product'],
        });

        if (!cart) {
            cart = await this.cartRepository.save(
                this.cartRepository.create({ user, status: 'ACTIVE' }),
            );
        }

        const product = await this.productRepository.findOne({ where: { id: createCartItemDTO.productId } });

        if(!product) throw new BadRequestException({ message: "Product is not exists in db" });

        const cartItem = await this.cartItemRepository.save({
            cart: cart,
            price: createCartItemDTO.price,
            product: product,
            quantity: createCartItemDTO.quantity ?? 1,
            total_price: (createCartItemDTO.quantity ?? 1) * createCartItemDTO.price
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
        const cart = await this.cartRepository.findOne({
            where: {
                user: { id: userId },
                status: 'ACTIVE',
            },
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        const affectedRows = await this.cartItemRepository.delete({
            cart: { id: cart.id },
            product: { id: productId },
        });

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
