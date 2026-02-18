import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart.item.entity';
import { Cart } from './entities/cart.entity';
import { UserModule } from '../user/user.module';
import { Auth } from '../common/util/auth';
import { AuthModule } from '../auth/auth.module';
import { ProductModule } from '../product/product.module';
import { Product } from '../product/entities/product.entity';

@Module({
  providers: [CartService, Auth],
  controllers: [CartController],
  imports: [TypeOrmModule.forFeature([CartItem, Cart, Product]), UserModule, AuthModule, ProductModule],
  exports: [CartService]
})
export class CartModule {}
