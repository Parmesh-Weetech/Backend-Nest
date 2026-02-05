import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';

import { AuthGuard } from '../common/guards/auth.guard';
import { APIResponse } from '../common/response/response.dto';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { CurrentUserInterceptor } from '../common/interceptors/currentUser.interceptor';
import { User } from '../user/entities/user.entity';

import { ProductService } from './product.service';
import { CreateProductDTO } from './dtos/create-product.dto';
import { UpdateProductDTO } from './dtos/update-product.dto';

@Controller('product')
@UseGuards(AuthGuard)
@UseInterceptors(CurrentUserInterceptor)
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) { }

    @Get()
    async findAll(
        @Query('_start') start = '0',
        @Query('_limit') limit = '10',
        @CurrentUser() user: User
    ): Promise<APIResponse> {
        const skip = Math.max(parseInt(start, 10), 0);
        const take = Math.min(parseInt(limit, 10), 100);

        return await this.productService.findAll(user, skip, take);
    }

    @Get(":id")
    async findOne(@Param("id") id: string, @CurrentUser() user: User): Promise<APIResponse> {
        return await this.productService.findOne(id, user);
    }


    @Post("/create")
    async create(@Body() product: CreateProductDTO, @CurrentUser() user: User): Promise<APIResponse> {
        return await this.productService.create(product, user);
    }

    @Post("/insert/bulk")
    async insertBulk(@Body() products: CreateProductDTO[], @CurrentUser() user: User): Promise<APIResponse> {
        return await this.productService.insertBulk(products, user)
    }

    @Put("/update")
    async update(@Body() product: UpdateProductDTO, @CurrentUser() user: User): Promise<APIResponse> {
        return await this.productService.update(product, user)
    }

    @Delete()
    async deleteAll(@CurrentUser() user: User): Promise<APIResponse> {
        return await this.productService.deleteAll(user);
    }

    @Delete(":id")
    async deleteById(@Param("id") id: string): Promise<APIResponse> {
        return await this.productService.deleteById(id);
    }
}
