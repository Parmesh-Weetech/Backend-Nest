import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';

import { APIResponse } from '../common/response/response.dto';
import { CurrentUserInterceptor } from '../common/interceptors/currentUser.interceptor';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { User } from '../user/entities/user.entity';

import { CartService } from './cart.service';
import { CreateCartItemDTO, RemoveCartItemDTO } from './dtos/create.cartItem.dto';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('cart')
@UseGuards(AuthGuard)
@UseInterceptors(CurrentUserInterceptor)
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Post("add")
    async addToCart(@Body() createCartItemDTO: CreateCartItemDTO, @CurrentUser() user: User): Promise<APIResponse> {
        return this.cartService.addToCart(createCartItemDTO, user);
    }

    @Patch("/product/:productId")
    async updateQuantity(@Param("productId") productId: string, @Body() body: { quantity: number }, @Req() req): Promise<APIResponse> {
        return this.cartService.updateQuantity(productId, body.quantity, req.currentUser.id);
    }

    @Get()
    async findCart(@CurrentUser() user: User): Promise<APIResponse> {
        return this.cartService.findCart(user);
    }

    @Get(":productId")
    async findOne(@Param("productId") productId: string, @Req() req): Promise<APIResponse> {
        return this.cartService.findOne(productId, req.currentUser.id);
    }

    @Delete()
    async removeCartItem(@Body() removeCartItemDTO: RemoveCartItemDTO, @CurrentUser() user: User): Promise<APIResponse> {
        return this.cartService.removeCartItem(removeCartItemDTO, user)
    }

    @Delete(":productId")
    async removeCartItemById(@Param("productId") productId, @Req() req): Promise<APIResponse> {
        return this.cartService.removeCartItemById(productId, req.currentUser.id)
    }
}
