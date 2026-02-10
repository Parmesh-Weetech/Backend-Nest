import { Body, Controller, Delete, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';

import { APIResponse } from '../common/response/response.dto';
import { CurrentUserInterceptor } from '../common/interceptors/currentUser.interceptor';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { User } from '../user/entities/user.entity';

import { CartService } from './cart.service';
import { AddToCartDTO, RemoveCartItemDTO } from './dtos/create.cartItem.dto';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('cart')
@UseGuards(AuthGuard)
@UseInterceptors(CurrentUserInterceptor)
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Post("add")
    async addToCart(@Body() addToCartDTO: AddToCartDTO, @CurrentUser() user: User): Promise<APIResponse> {
        return this.cartService.addToCart(addToCartDTO, user);
    }

    @Get()
    async findCart(@CurrentUser() user: User): Promise<APIResponse> {
        return this.cartService.findCart(user);
    }

    @Delete()
    async removeCartItem(@Body() removeCartItemDTO: RemoveCartItemDTO, @CurrentUser() user: User): Promise<APIResponse> {
        return this.cartService.removeCartItem(removeCartItemDTO, user)
    }
}
