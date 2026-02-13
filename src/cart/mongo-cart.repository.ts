import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ICartRepository } from './cart.repository.interface';
import { CartDocument } from './schemas/cart.schema';
import { CartItemDocument } from './schemas/cart_item.schema';
import { ProductDocument } from '../product/schemas/product.schema';

@Injectable()
export class MongoCartRepository implements ICartRepository {
    constructor(
        @InjectModel(CartDocument.name)
        private readonly cartModel: Model<CartDocument>,

        @InjectModel(CartItemDocument.name)
        private readonly cartItemModel: Model<CartItemDocument>,

        @InjectModel('Product')
        private readonly productModel: Model<ProductDocument>,
    ) { }

    async findActiveCartByUser(userId: string) {
        return this.cartModel.findOne({ userId, status: 'ACTIVE' });
    }

    async findProductById(productId: string) {
        return this.productModel.findById(productId);
    }

    async createCart(userId: string) {
        return this.cartModel.create({
            userId,
            items: [],
            status: 'ACTIVE',
        });
    }

    async addCartItem(data: {
        cartId: string;
        productId: string;
        quantity: number;
        price: number;
    }) {
        const item = await this.cartItemModel.create({
            productId: data.productId,
            quantity: data.quantity,
            price: data.price,
            total_price: data.price * data.quantity,
        });

        await this.cartModel.findByIdAndUpdate(data.cartId, {
            $push: { items: item._id },
        });

        return item;
    }

    async updateItemQuantity(productId: string, userId: string, quantity: number) {
        const cart = await this.findActiveCartByUser(userId);
        if (!cart) return false;

        const item = await this.cartItemModel.findOne({
            id: { $in: cart.items },
            productId,
        });

        if (!item) return false;

        item.quantity = quantity;
        item.total_price = item.price * quantity;
        await item.save();

        return true;
    }

    async findCartItems(userId: string) {
        const cart = await this.findActiveCartByUser(userId);
        if (!cart) return [];

        return this.cartItemModel
            .find({ id: { $in: cart.items } })
            .populate('productId');
    }

    async findCartItem(productId: string, userId: string) {
        const cart = await this.findActiveCartByUser(userId);
        if (!cart) return null;

        return this.cartItemModel
            .findOne({ id: { $in: cart.items }, productId })
            .populate('productId');
    }

    async removeItemsByIds(ids: string[], userId: string) {
        await this.cartItemModel.deleteMany({ _id: { $in: ids } });
        return true;
    }

    async removeByProductId(productId: string, userId: string) {
        const cart = await this.findActiveCartByUser(userId);
        if (!cart) return false;

        const item = await this.cartItemModel.findOneAndDelete({
            id: { $in: cart.items },
            productId,
        });

        if (!item) return false;

        await this.cartModel.findByIdAndUpdate(cart._id, {
            $pull: { items: item._id },
        });

        return true;
    }
}
