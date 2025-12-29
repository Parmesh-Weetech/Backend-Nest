import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity.js';
import { Expose } from 'class-transformer';

@Entity('posts')
export class PostEntity {
    @PrimaryGeneratedColumn('uuid')
    @Expose()
    id: string;

    @Column()
    @Expose()
    name: string;

    @Column({ nullable: true })
    @Expose()
    bio: string;

    @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;
}
