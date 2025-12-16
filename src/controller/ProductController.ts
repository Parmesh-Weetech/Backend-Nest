import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product";

export class ProductController {
    private productRepository = AppDataSource.getRepository(Product)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.productRepository.find()
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { name, description } = request.body;

        const productObject = this.productRepository.create({ name: name, description: description })

        const product = await this.productRepository.save(productObject);

        return product;
    }

    async findById(request: Request, response: Response, next: NextFunction) {
        const id = Number(request.params.id);

        const product = this.productRepository.findOneBy({ id: id });

        return product
    }
}