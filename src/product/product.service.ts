import { Injectable } from '@nestjs/common';
import { Auth } from '../common/util/auth';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDTO } from './dtos/create-product.dto';
import { UpdateProductDTO } from './dtos/update-product.dto';
import { Response } from '../common/response/response.dto';

@Injectable()
export class ProductService {
    constructor(
        private readonly auth: Auth,
        private readonly userService: UserService,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>
    ) { }
    async getAll(authorization: string): Promise<Response> {
        const [type, token] = authorization?.split(' ') ?? [];
        const access_token = type === 'Bearer' ? token : undefined;

        if (!access_token) return {
            success: false,
            message: "Token is required",
            data: null,
            expired: false,
            statusCode: 401
        }

        const isValid = await this.auth.verify(access_token);

        if (!isValid) return {
            success: false,
            message: "Token expired!",
            data: null,
            expired: true,
            statusCode: 400
        }

        const decodedPayload = await this.auth.decode(access_token);

        const isUserExists = await this.userService.findOne(decodedPayload.sub);

        if (!isUserExists) return {
            success: false,
            message: "User not found!",
            data: null,
            expired: false,
            statusCode: 404
        }

        const products = await this.productRepository.findBy({ user: { id: isUserExists.id } });

        if (products.length === 0) return {
            success: false,
            message: "No Products found.",
            data: null,
            expired: false,
            statusCode: 404
        }

        return {
            success: true,
            message: "Products fetched successfully.",
            data: products,
            expired: false,
            statusCode: 200
        }
    }

    async getById(id: string, authorization: string): Promise<Response> {
        const [type, token] = authorization?.split(' ') ?? [];
        const access_token = type === 'Bearer' ? token : undefined;

        if (!access_token) return {
            success: false,
            message: "Token is required",
            data: null,
            expired: false,
            statusCode: 401,
        }

        const isValid = await this.auth.verify(access_token);

        if (!isValid) return {
            success: false,
            message: "Token expired!",
            data: null,
            expired: true,
            statusCode: 400
        }

        const decodedPayload = await this.auth.decode(access_token);

        const isUserExists = await this.userService.findOne(decodedPayload.sub);

        if (!isUserExists) return {
            success: false,
            message: "User not found!",
            data: null,
            expired: false,
            statusCode: 404
        }

        const product = await this.productRepository.findOneBy({ id: id });

        if (!product) return {
            success: false,
            message: "No Products found.",
            data: null,
            expired: false,
            statusCode: 404
        }

        return {
            success: true,
            message: "Product fetched successfully.",
            data: product,
            expired: false,
            statusCode: 200
        }
    }

    async create(product: CreateProductDTO, authorization: string): Promise<Response> {
        const [type, token] = authorization?.split(' ') ?? [];
        const access_token = type === 'Bearer' ? token : undefined;

        if (!access_token) return {
            success: false,
            message: "Token is required",
            data: null,
            expired: false,
            statusCode: 401,
        }

        const isValid = await this.auth.verify(access_token);

        if (!isValid) return {
            success: false,
            message: "Token expired!",
            data: null,
            expired: true,
            statusCode: 400
        }

        const decodedPayload = await this.auth.decode(access_token);

        const isUserExists = await this.userService.findOne(decodedPayload.sub);

        if (!isUserExists) return {
            success: false,
            message: "User not found!",
            data: null,
            expired: false,
            statusCode: 404
        }

        const newProduct = this.productRepository.create({
            name: product.name,
            user: isUserExists,
            image: product.image,
            price: product.price,
            rating: product.rating,
            mealType: product.mealType,
            cuisine: product.cuisine,
            ingredients: product.ingredients,
            instructions: product.instructions
        });

        const saveProduct = await this.productRepository.save(newProduct);

        if (!saveProduct) return {
            success: false,
            message: "Failed to save product! try again.",
            statusCode: 400,
            expired: false,
            data: null
        }

        return {
            success: true,
            message: "Product saved successfully.",
            statusCode: 201,
            expired: false,
            data: saveProduct
        }
    }

    async insertBulk(products: CreateProductDTO[], authorization: string): Promise<Response> {
        const [type, token] = authorization?.split(' ') ?? [];
        const access_token = type === 'Bearer' ? token : undefined;

        if (!access_token) return {
            success: false,
            message: "Token is required",
            data: null,
            expired: false,
            statusCode: 401,
        }

        const isValid = await this.auth.verify(access_token);

        if (!isValid) return {
            success: false,
            message: "Token expired!",
            data: null,
            expired: true,
            statusCode: 400
        }

        const decodedPayload = await this.auth.decode(access_token);

        const isUserExists = await this.userService.findOne(decodedPayload.sub);

        if (!isUserExists) return {
            success: false,
            message: "User not found!",
            data: null,
            expired: false,
            statusCode: 404
        }

        const data = products.map((product) => ({
            ...product,
            user: isUserExists
        }))

        const bulkProduct = await this.productRepository
            .createQueryBuilder()
            .insert()
            .into(Product)
            .values(data)
            .returning("*")
            .execute();

        if(bulkProduct.identifiers.length === 0) return {
            success: false,
            message: "Error while bulk insert",
            statusCode: 400,
            data: null,
            expired: false
        }

        return {
            success: true,
            message: "Successfully inserted all products.",
            data: bulkProduct.raw,
            expired: false,
            statusCode: 201,
        }
    }

    async update(product: UpdateProductDTO, authorization: string): Promise<Response> {
        const [type, token] = authorization?.split(' ') ?? [];
        const access_token = type === 'Bearer' ? token : undefined;

        if (!access_token) return {
            success: false,
            message: "Token is required",
            data: null,
            expired: false,
            statusCode: 401,
        }

        const isValid = await this.auth.verify(access_token);

        if (!isValid) return {
            success: false,
            message: "Token expired!",
            data: null,
            expired: true,
            statusCode: 400
        }

        const decodedPayload = await this.auth.decode(access_token);

        const isUserExists = await this.userService.findOne(decodedPayload.sub);

        if (!isUserExists) return {
            success: false,
            message: "User not found!",
            data: null,
            expired: false,
            statusCode: 404
        }

        const existingProduct = await this.productRepository.findOne({ where: { id: product.id } })

        if (!product.name && existingProduct?.name) product.name = existingProduct.name;
        if (!product.image && existingProduct?.image) product.image = existingProduct.image;
        if (!product.price && existingProduct?.price) product.price = existingProduct.price;
        if (!product.rating && existingProduct?.rating) product.rating = existingProduct.rating;
        if (!product.mealType?.length && existingProduct?.mealType?.length) product.mealType = existingProduct.mealType;
        if (!product.cuisine && existingProduct?.cuisine) product.cuisine = existingProduct.cuisine;
        if (!product.ingredients?.length && existingProduct?.ingredients?.length) product.ingredients = existingProduct.ingredients;
        if (!product.instructions?.length && existingProduct?.instructions?.length) product.instructions = existingProduct.instructions;

        const saveProduct = await this.productRepository.save(product);

        if (!saveProduct) return {
            success: false,
            message: "Failed to update product! try again.",
            statusCode: 400,
            expired: false,
            data: null
        }

        return {
            success: true,
            message: "Product updated successfully.",
            statusCode: 200,
            expired: false,
            data: saveProduct
        }
    }

    async deleteAll(authorization: string): Promise<Response> {
        const [type, token] = authorization?.split(' ') ?? [];
        const access_token = type === 'Bearer' ? token : undefined;

        if (!access_token) return {
            success: false,
            message: "Token is required",
            data: null,
            expired: false,
            statusCode: 401,
        }

        const isValid = await this.auth.verify(access_token);

        if (!isValid) return {
            success: false,
            message: "Token expired!",
            data: null,
            expired: true,
            statusCode: 400
        }

        const decodedPayload = await this.auth.decode(access_token);

        const isUserExists = await this.userService.findOne(decodedPayload.sub);

        if (!isUserExists) return {
            success: false,
            message: "User not found!",
            data: null,
            expired: false,
            statusCode: 404
        }

        const existingProduct = await this.productRepository.find({ where: { user: { id: isUserExists.id } } });

        if (existingProduct.length === 0) return {
            success: false,
            message: "Products associated with current user not found.",
            data: null,
            expired: false,
            statusCode: 404
        }

        const deleteProduct = await this.productRepository.softDelete({ user: isUserExists });

        if (deleteProduct.affected !== null && deleteProduct.affected !== undefined && deleteProduct.affected > 0) return {
            success: true,
            message: "Products associated with current user is deleted successfully",
            data: null,
            expired: false,
            statusCode: 200
        }

        return {
            success: false,
            message: "Products associated with current user is not deleted.",
            data: null,
            expired: false,
            statusCode: 400
        }
    }

    async deleteById(id: string, authorization: string): Promise<Response> {
        const [type, token] = authorization?.split(' ') ?? [];
        const access_token = type === 'Bearer' ? token : undefined;

        if (!access_token) return {
            success: false,
            message: "Token is required",
            data: null,
            expired: false,
            statusCode: 401,
        }

        const isValid = await this.auth.verify(access_token);

        if (!isValid) return {
            success: false,
            message: "Token expired!",
            data: null,
            expired: true,
            statusCode: 400
        }

        const decodedPayload = await this.auth.decode(access_token);

        const isUserExists = await this.userService.findOne(decodedPayload.sub);

        if (!isUserExists) return {
            success: false,
            message: "User not found!",
            data: null,
            expired: false,
            statusCode: 404
        }

        const existingProduct = await this.productRepository.findOne({ where: { id: id } });

        if (!existingProduct) return {
            success: false,
            message: "Product associated with current user not found.",
            data: null,
            expired: false,
            statusCode: 404
        }

        const deleteProduct = await this.productRepository.softDelete({ id: id });

        if (deleteProduct.affected !== null && deleteProduct.affected !== undefined && deleteProduct.affected > 0) return {
            success: true,
            message: "Product associated with current user is deleted successfully",
            data: null,
            expired: false,
            statusCode: 200
        }

        return {
            success: false,
            message: "Product associated with current user is not deleted.",
            data: null,
            expired: false,
            statusCode: 400
        }
    }
}
