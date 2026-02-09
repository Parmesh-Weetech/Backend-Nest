import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { APIResponse } from '../common/response/response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart.item.entity';
import { CreateCartItemDTO } from './dtos/create.cartItem.dto';
import { ProductService } from '../product/product.service';
import { Product } from 'src/product/entities/product.entity';

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
        });

        if (!cart) {
            cart = await this.cartRepository.save(
                this.cartRepository.create({ user }),
            );
        }

        const existingProduct = await this.productRepository.findOne({ where: { id: createCartItemDTO.productId }});

        if(!existingProduct) throw new NotFoundException("Product not found in db.");

        const item = this.cartItemRepository.create({
            cart,
            product: existingProduct,
            quantity: createCartItemDTO.quantity,
            price: createCartItemDTO.price,
            total_price: createCartItemDTO.quantity * createCartItemDTO.price
        });

        const savedCart = await this.cartItemRepository.save(item);

        if(!savedCart) throw new InternalServerErrorException("Something went wrong while saving cart! try again...");

        const data = {
            ...cart,
            ...savedCart
        }

        return {
            success: true,
            data: data,
            expired: false,
            message: "Cart Saved Successfully.",
            statusCode: 200
        }
    }
}
