import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { IProductRepository } from './product.repository.interface';

@Injectable()
export class PostgresProductRepository
    implements IProductRepository {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
    ) { }

    async findAll(
        skip: number,
        take: number,
        search?: string,
        filter?: {
            _cuisine?: string[];
            _price?: [number, number];
        },
        sort = 'name',
        order: 'ASC' | 'DESC' = 'ASC',
    ) {
        const qb = this.productRepo
            .createQueryBuilder('product')
            .where('product.deleted_at IS NULL');

        // 🔍 Search
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
                { searchLike: `%${search}%` },
            );
        }

        // 🍽 Cuisine filter
        if (filter?._cuisine?.length) {
            qb.andWhere('product.cuisine IN (:...cuisines)', {
                cuisines: filter._cuisine,
            });
        }

        // 💰 Price filter
        if (filter?._price) {
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

        const [items, total] = await qb.getManyAndCount();

        return { items, total };
    }

    async findOne(id: string) {
        return this.productRepo.findOne({
            where: { id: id },
        });
    }

    async create(data: any) {
        const product = this.productRepo.create(data);
        return this.productRepo.save(product);
    }

    async insertBulk(data: any[]) {
        const result = await this.productRepo
            .createQueryBuilder()
            .insert()
            .into(Product)
            .values(data)
            .returning('*')
            .execute();

        return result.raw;
    }

    async update(id: string, data: any) {
        await this.productRepo.update({ id }, data);
        return this.findOne(id);
    }

    async softDeleteByUser(userId: string) {
        const result = await this.productRepo
            .createQueryBuilder()
            .softDelete()
            .where('userId = :userId', { userId })
            .execute();

        return result.affected ?? 0;
    }

    async softDeleteById(id: string) {
        const result = await this.productRepo.softDelete({ id });
        return !!result.affected;
    }
}
