import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { User } from "../../user/entities/user.entity";

@Entity("pdf")
export class Pdf {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: ['PENDING', 'GENERATED', 'PROCESSING', 'FAILED'],
        default: 'PENDING',
    })
    status: "PENDING" | "GENERATED" | "PROCESSING" | "FAILED";

    @ManyToOne(() => User, user => user.pdfs, {
        nullable: true,
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: "CASCADE"
    })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ nullable: true })
    filePath: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
