import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

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

@Module({
  controllers: [ProductController],
  providers: [ProductService, {
    provide: PRODUCT_REPOSITORY,
    useClass:
      process.env.DATABASE_PROVIDER === 'postgres'
        ? PostgresProductRepository
        : MongoProductRepository,
  }],
  exports: [ProductService],
  imports: [UserModule, ...(process.env.DATABASE_PROVIDER === 'postgres'
    ? [TypeOrmModule.forFeature([Product])]
    : []),

    ...((process.env.DATABASE_PROVIDER === 'mongodb' || process.env.DATABASE_PROVIDER === 'mongo')
      ? [
        MongooseModule.forFeature([
          { name: MongoProduct.name, schema: ProductSchema },
        ]),
      ]
      : []), AuthModule]
})
export class ProductModule { }
