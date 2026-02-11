import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Cart } from "./entities/cart.entity";

@Injectable()
export class CartRepository extends Repository<Cart> {

    constructor(private dataSource: DataSource) {
        super(Cart, dataSource.createEntityManager());
    }
    async findById(userId: string): Promise<Cart | null> {
        const cart = this.findOne({
            where: { user: { id: userId }, status: 'ACTIVE' },
            relations: ['items', 'items.product'],
        });

        if(!cart) return null;

        return cart;
    }

    async createCart(userId: string): Promise<Cart | null> {
        const newCart = this.create({
            user: { id: userId },
            status: "ACTIVE"
        });

        const saveCart = await this.save(newCart);

        if(!saveCart) return null;

        return saveCart;
    }
}