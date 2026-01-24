import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class Video {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    original_url: string

    @Column({ nullable: false, default: 'DRAFT'})
    status: string

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    deleted_at?: Date;
}