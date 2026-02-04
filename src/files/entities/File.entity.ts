import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { Expose } from "class-transformer";

import { User } from "../../user/entities/user.entity";

@Entity("files")
export class Files {
    @PrimaryGeneratedColumn('uuid')
    @Expose()
    id: string;

    @ManyToOne(() => User, user => user.files,
        {
            nullable: true,
            cascade: true,
            onDelete: 'CASCADE',
            onUpdate: "CASCADE"
        })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    path: string

    @Column()
    bucket: string

    @Column({ default: "default.png" })
    originalFileName: string

    @Column({ default: "image/png" })
    mimeType: string

    @Column({ default: "PENDING" })
    status: "PENDING" | "ACTIVE" | "ORPHAN"

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    deleted_at?: Date;
}