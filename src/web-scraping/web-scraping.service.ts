import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Request } from 'express';
import { ScrapeJob, ScrapeStatus } from './entities/web-scraping.entity';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class WebScrapingService {
    constructor(
        @InjectRepository(ScrapeJob)
        private readonly webScrapingRepository: Repository<ScrapeJob>,

        @InjectQueue("web-scraping")
        private readonly webScrapingQueue: Queue
    ) {

    }
    async start(url: string, req: Request) {
        const mainUrl = req.baseUrl;
        console.log(mainUrl);

        const saved = await this.webScrapingRepository.save({
            mainUrl: mainUrl,
            subUrl: url,
            status: ScrapeStatus.PENDING
        });

        const job = await this.webScrapingQueue.add('web-scraping', {
            jobId: saved.id,
            url: url,
            mainUrl: mainUrl
        }, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 5000 },
            removeOnFail: {
                age: 24 * 60 * 60,
                count: 1000
            },
            removeOnComplete: {
                age: 60 * 60,
                count: 10
            },
        });

        if (!job.id) {
            throw new UnauthorizedException({ message: "Unauthorized request" });
        }

        const updated = await this.webScrapingRepository.update(
            saved.id,
            {
                status: ScrapeStatus.PROCESSING
            }
        )

        if (!updated) {
            throw new InternalServerErrorException({ message: "Internal Server Error while updating record" });
        }

        return updated;
    }

    async updateStatus(jobId: string, url: string, mainurl: string, status: ScrapeStatus) {
        const updateStatus = await this.webScrapingRepository.update({ jobId: jobId }, {
            status: status,
            subUrl: url,
            mainUrl: mainurl
        });

        if (!updateStatus) throw new InternalServerErrorException({ message: "Internal Server Error while updating status" });

        return updateStatus;
    }
}
