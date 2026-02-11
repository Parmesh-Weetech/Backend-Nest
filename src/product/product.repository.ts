import { Injectable } from "@nestjs/common";
import { Product } from "./entities/product.entity";
import { DataSource, In, Repository } from "typeorm";
import { CreateProductDTO } from "./dtos/create-product.dto";
import { User } from "../user/entities/user.entity";
import { UpdatePostDTO } from "src/post/dtos/update-post.dto";

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
        const product = await this.findOne({ where: { id: id } });

        if (!product) return null;

        return product;
    }

    async findByUserId(userId: string): Promise<Product[] | [] | null> {
        const product = await this.find({ where: { user: { id: userId } } });

        if (!product) return null;

        if (product.length === 0) return [];

        return product;
    }

    async findByProductIds(productIds: string[]): Promise<Product[] | null> {
        const products = await this.findBy({
            id: In(productIds)
        });

        if(!productIds) return null;

        return products;
    }

    async createProduct(productDTO: CreateProductDTO, user: User): Promise<Product | null> {
        const newProduct = this.create({
            name: productDTO.name,
            user: user,
            image: productDTO.image,
            price: productDTO.price,
            rating: productDTO.rating,
            mealType: productDTO.mealType,
            cuisine: productDTO.cuisine,
            ingredients: productDTO.ingredients,
            instructions: productDTO.instructions,
            cookTimeMinutes: productDTO.cookTimeMinutes,
            prepTimeMinutes: productDTO.prepTimeMinutes,
            difficulty: productDTO.difficulty,
        });

        const saveProduct = await this.save(newProduct);

        if (!saveProduct) return null;

        return saveProduct;
    }

    async updateProduct(updateProductDTO: UpdatePostDTO): Promise<Product | null> {
        const updateProduct = await this.save(updateProductDTO);

        if (!updateProduct) return null;

        return updateProduct;
    }

    async softDeleteAllProduct(id: string): Promise<boolean> {
        const affectedRows = await this.softDelete({ user: { id: id } });

        if(affectedRows.affected === null || affectedRows.affected === undefined || affectedRows.affected === 0) return false;

        return true;
    }

    async softDeleteProductById(id: string): Promise<boolean> {
        const affectedRows = await this.softDelete(id);

        if (affectedRows.affected === null || affectedRows.affected === undefined || affectedRows.affected === 0) return false;

        return true;
    }
}