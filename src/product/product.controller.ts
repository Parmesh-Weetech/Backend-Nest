import { Controller, Get, Headers, Param, Res, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import type { Response } from 'express';

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
}
