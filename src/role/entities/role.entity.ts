import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn, ManyToMany, JoinTable, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Permission } from '../../permission/entities/permission.entity.js';
import { Exclude, Expose } from 'class-transformer';
import { User } from '../../user/entities/user.entity.js';
import { Organization } from '../../organization/entities/organization.entity.js';

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

    @ManyToOne(() => Organization, org => org.roles, { cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE" })
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

    @Index(["key", "organizationId"], { unique: true })

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    deleted_at?: Date
}
