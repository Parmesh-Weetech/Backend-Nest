import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { CartService } from './cart.service';
import { CartController } from './cart.controller';

import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart.item.entity';
import { Product } from '../product/entities/product.entity';

import { CartDocument, CartSchema } from './schemas/cart.schema';
import { CartItemDocument, CartItemSchema } from './schemas/cart_item.schema';

import { CART_REPOSITORY } from './cart.repository.interface';
import { PostgresCartRepository } from './postgres-cart.repository';
import { MongoCartRepository } from './mongo-cart.repository';

@Module({
  imports: [
    ...(process.env.DATABASE_PROVIDER === 'postgres'
      ? [TypeOrmModule.forFeature([Cart, CartItem, Product])]
      : []),

    ...(process.env.DATABASE_PROVIDER === 'mongodb'
      ? [
        MongooseModule.forFeature([
          { name: CartDocument.name, schema: CartSchema },
          { name: CartItemDocument.name, schema: CartItemSchema },
        ]),
      ]
      : []),
  ],
  controllers: [CartController],
  providers: [
    CartService,
    {
      provide: CART_REPOSITORY,
      useClass:
        process.env.DATABASE_PROVIDER === 'postgres'
          ? PostgresCartRepository
          : MongoCartRepository,
    },
  ],
})
export class CartModule { }
