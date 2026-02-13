import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Product, ProductDocument } from './schemas/product.schema';
import { IProductRepository } from './product.repository.interface';

@Injectable()
export class MongoProductRepository implements IProductRepository {
    constructor(
        @InjectModel(Product.name)
        private readonly productModel: Model<ProductDocument>,
    ) { }

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
            .limit(take);

        return { items, total };
    }

    async findOne(id: string) {
        return this.productModel.findOne({ _id: id, deleted_at: null });
    }

    async create(data: any) {
        return this.productModel.create(data);
    }

    async insertBulk(data: any[]) {
        return this.productModel.insertMany(data);
    }

    async update(id: string, data: any) {
        return this.productModel.findByIdAndUpdate(id, data, {
            new: true,
        });
    }

    async softDeleteByUser(userId: string) {
        const result = await this.productModel.updateMany(
            { user: userId },
            { deleted_at: new Date() },
        );

        return result.modifiedCount;
    }

    async softDeleteById(id: string) {
        const result = await this.productModel.findByIdAndUpdate(id, {
            deleted_at: new Date(),
        });

        return !!result;
    }
}
