import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';
import { Permission } from '../../permission/entities/permission.entity.js';
import { Exclude, Expose } from 'class-transformer';
import { User } from '../../user/entities/user.entity.js';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn('uuid')
    @Expose()
    id: string;

    @Column({ unique: true })
    @Expose()
    key: string;

    @Column()
    @Exclude()
    label: string

    @Column({ nullable: true })
    @Exclude()
    description: string

    @OneToMany(() => User, user => user.role)
    users: User[];

    // One role has many permissions
    @OneToMany(() => Permission, permission => permission.role, { cascade: true })
    permissions: Permission[];

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    deleted_at?: Date
}
