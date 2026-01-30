import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum LogType {
    ANALYTICS = 'ANALYTICS',
    ERROR = 'ERROR',
    SECURITY = 'SECURITY'
}

@Entity('logs')
export class Log {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    actionType: string; // e.g., SEND_MESSAGE, LOGIN, FRONTEND_ERROR

    @Column({ nullable: true })
    actorId?: string; // user ID who performed the action

    @Column({ nullable: true })
    targetType?: string; // e.g., MESSAGE, CONVERSATION, USER

    @Column({ nullable: true })
    targetId?: string; // ID of the resource

    @Column({ type: 'text', nullable: true })
    details?: string; // optional description or error message

    @Column({ type: 'jsonb', nullable: true })
    metadata?: {
        ip?: string;
        userAgent?: string;
        device?: string; // mobile, desktop, tablet, etc.
        referrer?: string;
        stack?: string; // for error stack traces
    };

    @Column({ type: 'enum', enum: LogType })
    type: LogType; // ANALYTICS | ERROR | SECURITY

    @CreateDateColumn()
    createdAt: Date;
}
