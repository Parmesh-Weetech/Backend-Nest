import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { Expose } from 'class-transformer';

@Entity('permissions')
export class Permission {
    @PrimaryGeneratedColumn('uuid')
    @Expose()
    id: string;

    @Column({ unique: true })
    @Expose()
    name: string;

    // Foreign key to Role
    @ManyToOne(() => Role, role => role.permissions, { onDelete: 'CASCADE' })
    role: Role;
}
