import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, UpdateDateColumn, CreateDateColumn, ManyToMany, JoinColumn, ManyToOne } from 'typeorm';
import { Role } from '../../role/entities/role.entity.js';
import { Exclude, Expose } from 'class-transformer';
import { Organization } from  '../../organization/entities/organization.entity.js';

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

    @ManyToMany(() => Role, role => role.permissions)
    roles: Role[];

    @ManyToOne(() => Organization, org => org.permissions, { cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn()
    organization: Organization;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    deleted_at?: Date;
}

