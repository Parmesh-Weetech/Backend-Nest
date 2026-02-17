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
import { createDatabaseRepositoryProvider } from '../common/providers/repository-selector.provider';

dotenv.config();

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    PostgresProductRepository,
    MongoProductRepository,
    createDatabaseRepositoryProvider(
      PRODUCT_REPOSITORY,
      PostgresProductRepository,
      MongoProductRepository,
    ),
  ],
  exports: [ProductService],
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Product]),
    MongooseModule.forFeature([
      { name: MongoProduct.name, schema: ProductSchema },
    ]),
    AuthModule,
  ]
})
export class ProductModule { }
