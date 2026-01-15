import { Injectable } from '@nestjs/common';
import { Auth } from '../common/util/auth';
import { ProductResponse } from './dtos/product-response.dto';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
    constructor(
        private readonly auth: Auth,
        private readonly userService: UserService,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>
    ) {}
    async getAll(authorization: string): Promise<ProductResponse> {
        const [type, token] = authorization?.split(' ') ?? [];
        const access_token = type === 'Bearer' ? token : undefined;

        if(!access_token) return {
            success: false,
            message: "Token is required",
            data: null,
            expired: null,
            statusCode: 401
        }

        const isValid = await this.auth.verify(access_token);

        if(!isValid) return {
            success: false,
            message: "Token expired!",
            data: null,
            expired: true,
            statusCode: 400
        }

        const decodedPayload = await this.auth.decode(access_token);

        const isUserExists = await this.userService.findOne(decodedPayload.sub);

        if(!isUserExists) return {
            success: false,
            message: "User not found!",
            data: null,
            expired: null,
            statusCode: 404
        }

        const products = await this.productRepository.findBy({ user: { id: isUserExists.id }});

        if(products.length === 0) return {
            success: true,
            message: "No Products found.",
            data: [],
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

    async getById(id: string, authorization: string): Promise<ProductResponse> {
        const [type, token] = authorization?.split(' ') ?? [];
        const access_token = type === 'Bearer' ? token : undefined;

        if (!access_token) return {
            success: false,
            message: "Token is required",
            data: null,
            expired: null,
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
            expired: null,
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
}
