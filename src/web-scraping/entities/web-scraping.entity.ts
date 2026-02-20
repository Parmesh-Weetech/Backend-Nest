import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

export enum ScrapeStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    DONE = 'DONE',
    FAILED = 'FAILED',
    SKIPPED = 'SKIPPED'
}

@Entity('scrape_jobs')
@Index(['subUrl'], { unique: true })
export class ScrapeJob {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: ScrapeStatus,
        default: ScrapeStatus.PENDING,
    })
    status: ScrapeStatus;

    @Column()
    mainUrl: string;

    @Column()
    subUrl: string;

    @Column({ unique: true, nullable: false, default: 1 })
    jobId: string

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}