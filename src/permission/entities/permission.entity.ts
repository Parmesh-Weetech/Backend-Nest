import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, DeleteDateColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { Role } from '../../role/entities/role.entity.js';
import { Exclude, Expose } from 'class-transformer';

@Entity('permissions')
export class Permission {
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

    @Column()
    @Exclude()
    entity: string

    @Column()
    @Exclude()
    action: string

    // Foreign key to Role
    @ManyToOne(() => Role, role => role.permissions, { onDelete: 'CASCADE' })
    role: Role;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    deleted_at?: Date;
}
