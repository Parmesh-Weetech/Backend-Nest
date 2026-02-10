import { Injectable } from "@nestjs/common";
import { Product } from "./entities/product.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class ProductRepository extends Repository<Product> {

    constructor(private dataSource: DataSource) {
        super(Product, dataSource.createEntityManager());
    }

    async findAll(
        search?: string,
        filter?: {
            _cuisine?: string[],
            _price?: [number, number],
        },
        sort: string = "name",
        order: "ASC" | "DESC" = "ASC",
        skip: number = 0,
        take: number = 6
    ): Promise<{
        products: Product[] | [] | null,
        total: number
    }> {

        const qb = this.createQueryBuilder('product')
            .where('product.deleted_at IS NULL');

        if (search) {
            qb.andWhere(
                `
                        product.name ILIKE :searchLike
                        OR EXISTS (
                        SELECT 1
                        FROM unnest(product.mealType) mt
                        WHERE mt ILIKE :searchLike
                    )
                `,
                {
                    searchLike: `%${search}%`,
                },
            );
        }

        if (filter?._cuisine?.length) {
            qb.andWhere('product.cuisine IN (:...cuisines)', {
                cuisines: filter._cuisine,
            });
        }

        if (filter?._price && filter._price.length === 2) {
            qb.andWhere(
                'product.price BETWEEN :min AND :max',
                {
                    min: filter._price[0],
                    max: filter._price[1],
                },
            );
        }

        qb.orderBy(`product.${sort}`, order);

        qb.skip(skip).take(take);

        const [products, total] = await qb.getManyAndCount();

        if (products.length === 0) return {
            products: [],
            total: 0
        }

        if (!products) return {
            products: null,
            total: 0
        }

        return {
            products,
            total,
        };
    }

    async findById(id: string): Promise<Product | null> {
        const product = await this.findOne({ where: { id: id }});

        if(!product) return null;

        return product;
    }
}