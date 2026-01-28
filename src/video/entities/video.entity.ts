import { User } from "../../user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("videos")
export class Video {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    path: string

    @Column()
    bucket: string

    @ManyToOne(() => User, user => user.files, {
        nullable: true,
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: "CASCADE"
    })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ nullable: false, default: 'PENDING' })
    status: "PENDING" | "PROCESSING" | "ACTIVE" | "FAILED"

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    deleted_at?: Date;
}