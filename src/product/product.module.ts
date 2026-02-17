import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import dotenv from 'dotenv';

import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Product as MongoProduct, ProductSchema } from './schemas/product.schema';
import { PRODUCT_REPOSITORY } from './product.repository.interface';
import { MongoProductRepository } from './mongo-product.repository';
import { PostgresProductRepository } from './postgres-product.repository';

dotenv.config();
const databaseProvider = (process.env.DATABASE_PROVIDER ?? '').toLowerCase();
const isMongo = databaseProvider === 'mongo' || databaseProvider === 'mongodb';

@Module({
  controllers: [ProductController],
  providers: [ProductService, {
    provide: PRODUCT_REPOSITORY,
    useClass:
      isMongo ? MongoProductRepository : PostgresProductRepository,
  }],
  exports: [ProductService],
  imports: [UserModule, ...(!isMongo
    ? [TypeOrmModule.forFeature([Product])]
    : []),

    ...(isMongo
      ? [
        MongooseModule.forFeature([
          { name: MongoProduct.name, schema: ProductSchema },
        ]),
      ]
      : []), AuthModule]
})
export class ProductModule { }
