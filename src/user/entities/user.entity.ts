import { Exclude, Expose } from "class-transformer";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import bcrypt from "bcryptjs";
import { Role } from "../../role/entities/role.entity.js";
import { Organization } from "../../organization/entities/organization.entity.js";

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

    @ManyToOne(() => Organization, org => org.users, { cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn()
    organization: Organization;

    @ManyToMany(() => Role, role => role.users)
    roles: Role[];

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