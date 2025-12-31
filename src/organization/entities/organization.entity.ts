import { Expose } from "class-transformer";
import { User } from "../../user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Role } from "../../role/entities/role.entity";
import { Permission } from "../../permission/entities/permission.entity";

@Entity("organization")
export class Organization {
    @PrimaryGeneratedColumn('uuid')
    @Expose()
    id: string;

    @Column()
    @Expose()
    name: string;

    @OneToMany(() => User, user => user.organization)
    users: User[]; 

    @OneToMany(() => User, role => role.organization)
    roles: Role[]; 

    @OneToMany(() => User, permision => permision.organization)
    permissions: Permission[]; 

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    deleted_at?: Date;
}
