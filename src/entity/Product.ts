import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ database: "postgres" })
export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 20
    })
    name: string

    @Column('text')
    description: string
}