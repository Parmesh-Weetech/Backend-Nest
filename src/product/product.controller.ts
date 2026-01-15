import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import type { Response } from 'express';
import { ProductDTO } from './dtos/product.dto';

@Controller('product')
@UseGuards(AuthGuard)
export class ProductController {
    constructor(private readonly productService: ProductService) {}
    @Get()
    async getAll(@Headers('Authorization') authorization: string, @Res({ passthrough: true }) res: Response): Promise<void> {
        const response = await this.productService.getAll(authorization)

        if(!response.success) {
            res.status(response.statusCode).send(response);
            return;
        }

        res.status(response.statusCode).send(response);
    }

    @Get("/:id")
    async getById(@Param("id") id: string, @Headers('Authorization') authorization: string, @Res({ passthrough: true }) res: Response): Promise<void> {
        const response = await this.productService.getById(id, authorization)

        if (!response.success) {
            res.status(response.statusCode).send(response);
            return;
        }

        res.status(response.statusCode).send(response);
    }

    @Post("/create")
    async create(@Body() product: ProductDTO, @Headers('Authorization') authorization: string, @Res({ passthrough: true }) res: Response): Promise<void> {
        const response = await this.productService.create(product, authorization)

        if (!response.success) {
            res.status(response.statusCode).send(response);
            return;
        }

        res.status(response.statusCode).send(response);
    }

    @Put("/update")
    async update(@Body() product: ProductDTO, @Headers('Authorization') authorization: string, @Res({ passthrough: true }) res: Response): Promise<void> {
        const response = await this.productService.update(product, authorization)

        if (!response.success) {
            res.status(response.statusCode).send(response);
            return;
        }

        res.status(response.statusCode).send(response);
    }

    @Delete()
    async deleteAll(@Headers('Authorization') authorization: string, @Res({ passthrough: true }) res: Response): Promise<void> { 
        const response = await this.productService.deleteAll(authorization);

        if (!response.success) {
            res.status(response.statusCode).send(response);
            return;
        }

        res.status(response.statusCode).send(response);
    }

    @Delete("/:id")
    async deleteById(@Param("id") id: string, @Headers('Authorization') authorization: string, @Res({ passthrough: true }) res: Response): Promise<void> {
        const response = await this.productService.deleteById(id, authorization);

        if (!response.success) {
            res.status(response.statusCode).send(response);
            return;
        }

        res.status(response.statusCode).send(response);
    }
}
