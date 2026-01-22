import { Expose } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("files")
export class files {
    @PrimaryGeneratedColumn('uuid')
    @Expose()
    id: string;

    @Column()
    user_id: string

    @Column()
    path: string

    @Column()
    bucket: string

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;
}