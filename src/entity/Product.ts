import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ database: "postgres" })
export class Product {
    @PrimaryGeneratedColumn("uuid") // generate uuid column string as id
    id: number

    @Column({
        length: 20
    })
    name: string

    @Column('text')
    description: string

    @CreateDateColumn()
    createdAt: Date; 

    @UpdateDateColumn()
    updatedAt: Date; // automatically set no need to set both. There is another column is there named @DeleteDateColumn which is used to set the soft-delete in the entity. @VersionColumn is used to make versioning of that entity.
}