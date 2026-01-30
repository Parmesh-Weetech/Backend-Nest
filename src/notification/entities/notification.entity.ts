import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    senderId: string;

    @Column('uuid')
    receiverId: string;

    @Column('text')
    message: string;

    @Column({ default: 'PENDING' })
    status: 'PENDING' | 'SENT' | 'FAILED';

    @Column({ type: 'timestamptz', nullable: true })
    scheduledAt: Date;

    @Column({ default: 'UTC' })
    timezone: string;

    @Column({ type: 'timestamp', nullable: true })
    sentAt: Date | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
