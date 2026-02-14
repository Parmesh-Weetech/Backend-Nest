import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

import { CartService } from './cart.service';
import { CartController } from './cart.controller';

import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart.item.entity';
import { Product } from '../product/entities/product.entity';

import { CartDocument, CartSchema } from './schemas/cart.schema';
import { CartItemDocument, CartItemSchema } from './schemas/cart_item.schema';
import { Product as ProductDocument, ProductSchema } from '../product/schemas/product.schema';

import { CART_REPOSITORY } from './cart.repository.interface';
import { PostgresCartRepository } from './postgres-cart.repository';
import { MongoCartRepository } from './mongo-cart.repository';

const databaseProvider = process.env.DATABASE_PROVIDER?.toLowerCase();
const isPostgres = databaseProvider === 'postgres';
const isMongo = databaseProvider === 'mongo' || databaseProvider === 'mongodb';

@Module({
  imports: [
    ...(isPostgres
      ? [TypeOrmModule.forFeature([Cart, CartItem, Product])]
      : []),

    ...(isMongo
      ? [
        MongooseModule.forFeature([
          { name: CartDocument.name, schema: CartSchema },
          { name: CartItemDocument.name, schema: CartItemSchema },
          { name: ProductDocument.name, schema: ProductSchema },
        ]),
      ]
      : []),
    AuthModule,
    UserModule,
  ],
  controllers: [CartController],
  providers: [
    CartService,
    {
      provide: CART_REPOSITORY,
      useClass:
        isPostgres
          ? PostgresCartRepository
          : MongoCartRepository,
    },
  ],
})
export class CartModule { }
