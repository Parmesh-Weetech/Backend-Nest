import { User } from "../../user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("product")
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.products, { nullable: false, cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE" })
    user: User;

    @Column()
    name: string

    @Column()
    image: string

    @Column()
    price: number

    @Column()
    rating: number

    @Column("text", { array: true })
    mealType: [string]

    @Column()
    cuisine: string

    @Column("text", { array: true })
    ingredients: [string]

    @Column("text", { array: true })
    instructions: [string]

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    deleted_at?: Date;
}