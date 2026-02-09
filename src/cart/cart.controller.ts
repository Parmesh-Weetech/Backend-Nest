import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';

import { APIResponse } from '../common/response/response.dto';
import { CurrentUserInterceptor } from '../common/interceptors/currentUser.interceptor';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { User } from '../user/entities/user.entity';

import { CartService } from './cart.service';
import { AddToCartDTO } from './dtos/create.cartItem.dto';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @UseInterceptors(CurrentUserInterceptor)
    @Post("add")
    async addToCart(@Body() addToCartDTO: AddToCartDTO, @CurrentUser() user: User): Promise<APIResponse> {
        return this.cartService.addToCart(addToCartDTO, user);
    }
}
