import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Product, ProductDocument } from './schemas/product.schema';
import { IProductRepository } from './product.repository.interface';

@Injectable()
export class MongoProductRepository implements IProductRepository {
    constructor(
        @InjectModel(Product.name)
        private readonly productModel: Model<ProductDocument>,
    ) { }

    private toPlain(document: any) {
        if (!document) return null;

        const raw = typeof document.toObject === 'function'
            ? document.toObject()
            : document;

        const id = raw?._id?.toString?.() ?? String(raw._id ?? raw.id);
        const { _id, __v, ...rest } = raw;

        return {
            ...rest,
            id,
        };
    }

    async findAll(
        skip: number,
        take: number,
        search?: string,
        filter?: {
            _cuisine?: string[];
            _price?: [number, number];
        },
        sort = 'name',
        order: 'ASC' | 'DESC' = 'ASC',
    ) {
        const query: any = { deleted_at: null };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { mealType: { $elemMatch: { $regex: search, $options: 'i' } } },
            ];
        }

        if (filter?._cuisine?.length) {
            query.cuisine = { $in: filter._cuisine };
        }

        if (filter?._price) {
            query.price = {
                $gte: filter._price[0],
                $lte: filter._price[1],
            };
        }

        const total = await this.productModel.countDocuments(query);

        const items = await this.productModel
            .find(query)
            .sort({ [sort]: order === 'ASC' ? 1 : -1 })
            .skip(skip)
            .limit(take)
            .lean()
            .exec();

        return { items: items.map((item: any) => this.toPlain(item)), total };
    }

    async findOne(id: string) {
        if (!id || !Types.ObjectId.isValid(id)) {
            return null;
        }

        const document = await this.productModel.findOne({ _id: id }).lean().exec();
        return this.toPlain(document);
    }

    async create(data: any) {
        const document = new this.productModel(data);
        const saved = await document.save();
        return this.toPlain(saved);
    }

    async insertBulk(data: any[]) {
        const docs = data.map((entry) => new this.productModel(entry));
        const saved = await Promise.all(docs.map((doc) => doc.save()));
        return saved.map((document) => this.toPlain(document));
    }

    async update(id: string, data: any) {
        if (!id || !Types.ObjectId.isValid(id)) {
            return null;
        }

        const document = await this.productModel.findByIdAndUpdate(id, data, {
            new: true,
        }).lean().exec();

        return this.toPlain(document);
    }

    async softDeleteByUser(userId: string) {
        const result = await this.productModel.updateMany(
            { user: userId },
            { deleted_at: new Date() },
        );

        return result.modifiedCount;
    }

    async softDeleteById(id: string) {
        if (!id || !Types.ObjectId.isValid(id)) {
            return false;
        }

        const result = await this.productModel.findByIdAndUpdate(id, {
            deleted_at: new Date(),
        });

        return !!result;
    }
}
