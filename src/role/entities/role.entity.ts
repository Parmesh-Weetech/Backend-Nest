import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Permission } from '../../permission/entities/permission.entity';
import { Expose } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn('uuid')
    @Expose()
    id: string;

    @Column({ unique: true })
    @Expose()
    name: string;

    @OneToMany(() => User, user => user.role)  // One role can be assigned to many users
    users: User[];

    // One role has many permissions
    @OneToMany(() => Permission, permission => permission.role, { cascade: true })
    permissions: Permission[];
}
