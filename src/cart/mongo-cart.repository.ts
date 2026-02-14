import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ICartRepository } from './cart.repository.interface';
import { CartDocument } from './schemas/cart.schema';
import { CartItemDocument } from './schemas/cart_item.schema';
import { Product, ProductDocument } from '../product/schemas/product.schema';

@Injectable()
export class MongoCartRepository implements ICartRepository {
    constructor(
        @InjectModel(CartDocument.name)
        private readonly cartModel: Model<CartDocument>,

        @InjectModel(CartItemDocument.name)
        private readonly cartItemModel: Model<CartItemDocument>,

        @InjectModel(Product.name)
        private readonly productModel: Model<ProductDocument>,
    ) { }

    private cartItemIds(cart: any): any[] {
        return (Array.isArray(cart?.items) ? cart.items : [])
            .map((item: any) => item?._id ?? item)
            .filter(Boolean);
    }

    async findActiveCartByUser(userId: string) {
        return this.cartModel.findOne({ userId, status: 'ACTIVE' }).exec();
    }

    async findProductById(productId: string) {
        return this.productModel.findById(productId).lean().exec();
    }

    async createCart(userId: string) {
        const cart = new this.cartModel({
            userId,
            items: [],
            status: 'ACTIVE',
        });
        return cart.save();
    }

    async addCartItem(data: {
        cartId: string;
        productId: string;
        quantity: number;
        price: number;
    }) {
        const item = new this.cartItemModel({
            productId: data.productId,
            quantity: data.quantity,
            price: data.price,
            total_price: data.price * data.quantity,
        });
        const savedItem = await item.save();

        await this.cartModel.findByIdAndUpdate(data.cartId, {
            $push: { items: savedItem._id },
        });

        return savedItem;
    }

    async updateItemQuantity(productId: string, userId: string, quantity: number) {
        const cart = await this.findActiveCartByUser(userId);
        if (!cart) return false;
        const itemIds = this.cartItemIds(cart);

        const item = await this.cartItemModel.findOne({
            _id: { $in: itemIds },
            productId,
        } as any).exec();

        if (!item) return false;

        item.quantity = quantity;
        item.total_price = item.price * quantity;
        await item.save();

        return true;
    }

    async findCartItems(userId: string) {
        const cart = await this.findActiveCartByUser(userId);
        if (!cart) return [];
        const itemIds = this.cartItemIds(cart);

        return this.cartItemModel
            .find({ _id: { $in: itemIds } } as any)
            .populate('productId')
            .exec();
    }

    async findCartItem(productId: string, userId: string) {
        const cart = await this.findActiveCartByUser(userId);
        if (!cart) return null;
        const itemIds = this.cartItemIds(cart);

        return this.cartItemModel
            .findOne({ _id: { $in: itemIds }, productId } as any)
            .populate('productId')
            .exec();
    }

    async removeItemsByIds(ids: string[], userId: string) {
        await this.cartItemModel.deleteMany({ _id: { $in: ids } });
        return true;
    }

    async removeByProductId(productId: string, userId: string) {
        const cart = await this.findActiveCartByUser(userId);
        if (!cart) return false;

        const item = await this.cartItemModel.findOneAndDelete({
            _id: { $in: this.cartItemIds(cart) },
            productId,
        } as any).exec();

        if (!item) return false;

        await this.cartModel.findByIdAndUpdate(cart._id, {
            $pull: { items: item._id },
        });

        return true;
    }
}
