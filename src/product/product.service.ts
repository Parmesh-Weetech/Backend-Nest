import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { APIResponse } from '../common/response/response.dto';
import { User } from '../user/entities/user.entity';

import { Product } from './entities/product.entity';
import { CreateProductDTO } from './dtos/create-product.dto';
import { UpdateProductDTO } from './dtos/update-product.dto';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductRepository)
        private readonly productRepository: ProductRepository
    ) { }
    async findAll(
        skip: number,
        take: number,
        search?: string,
        filter?: {
            _cuisine?: string[],
            _price?: [number, number],
        },
        sort = 'created_at',
        order: 'ASC' | 'DESC' = 'DESC',
    ): Promise<APIResponse> {
        const response = await this.productRepository.findAll(search, filter, sort, order, skip, take);

        if (!response.products) throw new InternalServerErrorException({ message: "Something went wrong while fetching product." });

        return {
            success: true,
            message: response.products.length > 0
                ? 'Products fetched successfully.'
                : 'No Products found.',
            data: {
                items: response.products.length > 0 ? response.products : [],
                meta: {
                    totalItems: response.total,
                    skip,
                    limit: take,
                    total: Math.max(response.total - skip, 0),
                },
            },
            expired: false,
            statusCode: 200,
        };
    }


    async findOne(id: string): Promise<APIResponse> {
        const product = await this.productRepository.findById(id);

        if (!product) throw new NotFoundException('Product not found.');

        return {
            success: true,
            message: "Product fetched successfully.",
            data: product,
            expired: false,
            statusCode: 200
        }
    }

    async create(product: CreateProductDTO, user: User): Promise<APIResponse> {
        const newProduct = this.productRepository.createProduct(product, user)

        if (!newProduct) throw new InternalServerErrorException('Failed to create product.');

        return {
            success: true,
            message: "Product saved successfully.",
            statusCode: 201,
            expired: false,
            data: newProduct
        }
    }

    async insertBulk(
        products: CreateProductDTO[],
        user: User,
    ): Promise<APIResponse> {
        const data = products.map(product => ({
            ...product,
            user,
        }));

        const result = await this.productRepository
            .createQueryBuilder()
            .insert()
            .into(Product)
            .values(data)
            .returning('*')
            .execute();

        if (!result.raw.length) {
            throw new InternalServerErrorException(
                'Failed to insert bulk products.',
            );
        }

        return {
            success: true,
            message: 'Successfully inserted all products.',
            data: result.raw,
            expired: false,
            statusCode: 201,
        };
    }

    async update(product: UpdateProductDTO): Promise<APIResponse> {
        const existingProduct = await this.findOne(product.id);

        if (!product.name && existingProduct?.data.name) product.name = existingProduct.data.name;
        if (!product.image && existingProduct?.data.image) product.image = existingProduct.data.image;
        if (!product.price && existingProduct?.data.price) product.price = existingProduct.data.price;
        if (!product.rating && existingProduct?.data.rating) product.rating = existingProduct.data.rating;
        if (!product.mealType?.length && existingProduct?.data.mealType?.length) product.mealType = existingProduct.data.mealType as [string];
        if (!product.cuisine && existingProduct?.data.cuisine) product.cuisine = existingProduct.data.cuisine;
        if (!product.ingredients?.length && existingProduct?.data.ingredients?.length) product.ingredients = existingProduct.data.ingredients as [string];
        if (!product.instructions?.length && existingProduct?.data.instructions?.length) product.instructions = existingProduct.data.instructions as [string];

        const saveProduct = await this.productRepository.updateProduct(product);
        if (!saveProduct) throw new InternalServerErrorException('Failed to update product.');

        return {
            success: true,
            message: "Product updated successfully.",
            statusCode: 200,
            expired: false,
            data: saveProduct
        }
    }

    async deleteAll(id: string): Promise<APIResponse> {
        const existingProduct = await this.productRepository.findByUserId(id);
        if (!existingProduct) throw new InternalServerErrorException({ message: "Something went wrong while fetching product." });

        const deleteProduct = await this.productRepository.softDeleteAllProduct(id);
        if (!deleteProduct) throw new InternalServerErrorException('Products associated with current user not found.');

        return {
            success: false,
            message: "Products associated with current user is not deleted.",
            data: null,
            expired: false,
            statusCode: 400
        }
    }

    async deleteById(id: string): Promise<APIResponse> {
        const existingProduct = await this.findOne(id);
        if (!existingProduct) throw new NotFoundException('Product associated with current user not found.');

        const deleteProduct = await this.productRepository.softDeleteProductById(id);
        if (!deleteProduct) throw new InternalServerErrorException('Product associated with current user is not deleted.');

        return {
            success: false,
            message: "Product associated with current user is not deleted.",
            data: null,
            expired: false,
            statusCode: 400
        }
    }
}
