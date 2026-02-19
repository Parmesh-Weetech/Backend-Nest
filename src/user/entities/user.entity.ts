import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exclude, Expose } from "class-transformer";
import bcrypt from "bcryptjs";

import { Role } from "../../role/entities/role.entity";
import { Files } from "../../files/entities/File.entity";
import { Video } from "../../video/entities/video.entity";
import { Product } from "../../product/entities/product.entity";
import { Organization } from "../../organization/entities/organization.entity";
import { Notification } from "../../notification/entities/notification.entity";
import { Cart } from "../../cart/entities/cart.entity";

import { Refresh_token } from "./refresh_token.entity";
import { Pdf } from "src/pdf/entities/pdf.entity";

@Entity("user")
export class User {
    @PrimaryGeneratedColumn("uuid")
    @Expose()
    id: string;

    @Column()
    @Expose()
    name: string;

    @Column()
    @Expose()
    email: string;

    @Column()
    @Exclude()
    password: string;

    @OneToMany(() => Files, file => file.user)
    files: Files[];

    @OneToMany(() => Video, video => video.user)
    videos: Video[];

    @OneToMany(() => Notification, notification => notification.sender)
    notifications: Notification[];

    @OneToMany(() => Pdf, pdf => pdf.user)
    pdfs: Pdf[];

    @ManyToOne(() => Organization, org => org.users, {
        cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE"
    })
    @JoinColumn()
    organization: Organization;

    @ManyToMany(() => Role, role => role.users)
    roles: Role[];

    @OneToMany(() => Refresh_token, token => token.refresh_token)
    tokens: Refresh_token[]

    @OneToMany(() => Product, product => product.user)
    products: Product[];

    @OneToOne(() => Cart, cart => cart.user)
    cart: Cart;

    @Index(["email", "organizationId"], { unique: true })

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    deleted_at?: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async hashpassword() {
        if (this.password) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, 10);
        }
    }
}