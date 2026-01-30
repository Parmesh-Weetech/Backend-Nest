import { Conversation } from 'src/websocket/entities/conversation.entity';
import { User } from '../../user/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne,
} from 'typeorm';

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.files, {
        nullable: true,
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: "CASCADE"
    })
    @JoinColumn({ name: 'senderId' })
    sender: User;

    @ManyToOne(() => Conversation, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'conversationId' })
    conversation: Conversation;

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
