import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { APIResponse } from '../common/response/response.dto';
import { User } from '../user/entities/user.entity';

import { Product } from './entities/product.entity';
import { CreateProductDTO } from './dtos/create-product.dto';
import { UpdateProductDTO } from './dtos/update-product.dto';
import { type IProductRepository, PRODUCT_REPOSITORY } from './product.repository.interface';

@Injectable()
export class ProductService {
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepository: IProductRepository,
    ) { }
    async findAll(skip, take, search, filter, sort, order) {
        const { items, total } =
            await this.productRepository.findAll(
                skip,
                take,
                search,
                filter,
                sort,
                order,
            );

        return {
            success: true,
            message: items.length
                ? 'Products fetched successfully.'
                : 'No Products found.',
            data: {
                items,
                meta: {
                    totalItems: total,
                    skip,
                    limit: take,
                    total: Math.max(total - skip, 0),
                },
            },
            expired: false,
            statusCode: 200,
        };
    }

    async findOne(id: string) {
        const product = await this.productRepository.findOne(id);

        if (!product) throw new NotFoundException('Product not found.');

        return {
            success: true,
            data: product,
            message: 'Product fetched successfully.',
            statusCode: 200,
            expired: false,
        };
    }

    async create(product, user) {
        const newProduct = await this.productRepository.create({
            ...product,
            user: user.id,
        });

        if (!newProduct)
            throw new InternalServerErrorException('Failed to create product.');

        return {
            success: true,
            message: 'Product saved successfully.',
            data: newProduct,
            statusCode: 201,
            expired: false,
        };
    }

    async insertBulk(products, user) {
        const data = products.map(p => ({
            ...p,
            user: user.id,
        }));

        const result = await this.productRepository.insertBulk(data);

        return {
            success: true,
            message: 'Successfully inserted all products.',
            data: result,
            statusCode: 201,
            expired: false,
        };
    }

    async update(product, user) {
        const updated = await this.productRepository.update(
            product.id,
            product,
        );

        if (!updated)
            throw new InternalServerErrorException(
                'Failed to update product.',
            );

        return {
            success: true,
            message: 'Product updated successfully.',
            data: updated,
            statusCode: 200,
            expired: false,
        };
    }

    async deleteAll(user) {
        const count =
            await this.productRepository.softDeleteByUser(user.id);

        if (!count)
            throw new NotFoundException(
                'Products associated with current user not found.',
            );

        return {
            success: true,
            message: 'Products deleted successfully.',
            data: null,
            statusCode: 200,
            expired: false,
        };
    }

    async deleteById(id: string) {
        const deleted =
            await this.productRepository.softDeleteById(id);

        if (!deleted)
            throw new NotFoundException('Product not found.');

        return {
            success: true,
            message: 'Product deleted successfully.',
            data: null,
            statusCode: 200,
            expired: false,
        };
    }
}
