import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn, ManyToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

import { Permission } from '../../permission/entities/permission.entity';
import { User } from '../../user/entities/user.entity';
import { Organization } from '../../organization/entities/organization.entity';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn('uuid')
    @Expose()
    id: string;

    @Column()
    @Expose()
    key: string;

    @Column()
    @Exclude()
    label: string

    @Column({ nullable: true })
    @Exclude()
    description: string

    @ManyToOne(() => Organization, org => org.roles, {
        cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE"
    })
    @JoinColumn()
    organization: Organization;

    @ManyToMany(() => User, user => user.roles, { cascade: true })
    @JoinTable({
        name: "user_roles",
        joinColumn: {
            name: 'roleId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'userId',
            referencedColumnName: 'id',
        },
    })
    users: User[];

    @ManyToMany(() => Permission, permission => permission.roles, { cascade: true })
    @JoinTable({
        name: "roles_permissions",
        joinColumn: {
            name: 'roleId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'permissionId',
            referencedColumnName: 'id',
        },
    })
    permissions: Permission[];

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    deleted_at?: Date
}
