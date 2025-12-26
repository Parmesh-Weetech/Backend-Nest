import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Permission } from '../../permission/entities/permission.entity';
import { Expose } from 'class-transformer';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn('uuid')
    @Expose()
    id: string;

    @Column({ unique: true })
    @Expose()
    name: string;

    // One role has many permissions
    @ManyToOne(() => Permission, permission => permission.role, { cascade: true })
    permissions: Permission[];
}
