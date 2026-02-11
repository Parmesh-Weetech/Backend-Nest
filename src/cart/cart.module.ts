import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart.item.entity';
import { Cart } from './entities/cart.entity';
import { CurrentUserInterceptor } from '../common/interceptors/currentUser.interceptor';
import { UserModule } from '../user/user.module';
import { Auth } from '../common/util/auth';
import { AuthModule } from '../auth/auth.module';
import { ProductModule } from '../product/product.module';
import { Product } from '../product/entities/product.entity';
import { CartItemRepository, CartRepository } from './cart.repository';
import { ProductRepository } from 'src/product/product.repository';

@Module({
  providers: [CartService, CurrentUserInterceptor, Auth, CartRepository, CartItemRepository, ProductRepository],
  controllers: [CartController],
  imports: [TypeOrmModule.forFeature([CartItemRepository, CartRepository, ProductRepository]), UserModule, AuthModule, ProductModule]
})
export class CartModule {}
