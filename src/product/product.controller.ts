import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUserGuard } from '../common/guards/currentUser.guard';
import { APIResponse } from '../common/response/response.dto';

import { ProductService } from './product.service';
import { CreateProductDTO } from './dtos/create-product.dto';
import { UpdateProductDTO } from './dtos/update-product.dto';

@Controller('product')
@UseGuards(AuthGuard, CurrentUserGuard)
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) { }

    @Get()
    async findAll(
        @Query('_start') start = '0',
        @Query('_limit') limit = '10',
        @Query('_sort') sort = 'created_at',
        @Query('_order') order: 'ASC' | 'DESC' = 'DESC',

        @Query('search') search?: string,
        @Query('cuisine') cuisine?: string,
        @Query('price') price?: string,
    ): Promise<APIResponse> {

        const skip = Math.max(parseInt(start, 10), 0);
        const take = Math.min(parseInt(limit, 10), 100);

        /* 🎯 Build filter object */
        const filter: {
            _cuisine?: string[];
            _price?: [number, number];
        } = {};

        /* 🍽 Cuisine: "Italian,Mexican" → ["Italian","Mexican"] */
        if (cuisine) {
            filter._cuisine = cuisine.split(',').map(c => c.trim());
        }

        /* 💰 Price: "140-250" → [140, 250] */
        if (price) {
            const [min, max] = price.split('-').map(Number);
            if (!isNaN(min) && !isNaN(max)) {
                filter._price = [min, max];
            }
        }

        return this.productService.findAll(
            skip,
            take,
            search,
            filter,
            sort,
            order,
        );
    }

    @Get(":id")
    async findOne(@Param("id") id: string): Promise<APIResponse> {
        return await this.productService.findOne(id);
    }


    @Post("/create")
    async create(@Body() product: CreateProductDTO, @Req() req): Promise<APIResponse> {
        return await this.productService.create(product, req.currentUser);
    }

    @Post("/insert/bulk")
    async insertBulk(@Body() products: CreateProductDTO[], @Req() req): Promise<APIResponse> {
        return await this.productService.insertBulk(products, req.currentUser)
    }

    @Put("/update")
    async update(@Body() product: UpdateProductDTO): Promise<APIResponse> {
        return await this.productService.update(product)
    }

    @Delete()
    async deleteAll(@Req() req): Promise<APIResponse> {
        return await this.productService.deleteAll(req.currentUser.id);
    }

    @Delete(":id")
    async deleteById(@Param("id") id: string): Promise<APIResponse> {
        return await this.productService.deleteById(id);
    }
}
