import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Request } from 'express';
import { ScrapeJob, ScrapeStatus } from './entities/web-scraping.entity';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { randomUUID } from 'crypto';
import { APIResponse } from '../common/response/response.dto';

@Injectable()
export class WebScrapingService {
    constructor(
        @InjectRepository(ScrapeJob)
        private readonly webScrapingRepository: Repository<ScrapeJob>,

        @InjectQueue("web-scraping")
        private readonly webScrapingQueue: Queue
    ) {

    }
    async start(url: string) {
        const parsed = new URL(url);

        const mainUrl = `${parsed.protocol}//${parsed.host}`;
        const subUrl = parsed.pathname || '/';

        const saved = await this.webScrapingRepository.save({
            mainUrl,
            subUrl,
            status: ScrapeStatus.PENDING
        });

        const job = await this.webScrapingQueue.add('web-scraping', {
            id: saved.id,
            subUrl: subUrl,
            mainUrl: mainUrl,
            url: url
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

    async updateStatus(id: string, subUrl: string, mainurl: string, status: ScrapeStatus) {
        const updateStatus = await this.webScrapingRepository.update(id, {
            status: status,
            subUrl: subUrl,
            mainUrl: mainurl
        });

        if (!updateStatus) throw new InternalServerErrorException({ message: "Internal Server Error while updating status" });

        return updateStatus;
    }

    async findAndAddLinks(newSubUrl: string, mainUrl: string, link: string) {
        const exists = await this.webScrapingRepository.findOne({
            where: { subUrl: newSubUrl, mainUrl: mainUrl }
        });

        if (!exists || exists === null) {
            const id = randomUUID();

            const job = await this.webScrapingQueue.add('web-scraping', {
                id: id,
                subUrl: newSubUrl,
                mainUrl: mainUrl,
                url: link
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

            const saved = await this.webScrapingRepository.save({
                id: id,
                mainUrl: mainUrl,
                subUrl: newSubUrl,
                status: ScrapeStatus.PROCESSING,
                jobId: job.id
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
    }

    async findById(mainUrl: string, subUrl: string): Promise<APIResponse> {
        const response = await this.webScrapingRepository.findOne({
            where: { mainUrl: mainUrl, subUrl: subUrl }
        });

        if (!response) return {
            success: false,
            data: null,
            expired: false,
            message: "Data not found",
            statusCode: 404
        };

        return {
            success: true,
            data: response,
            expired: false,
            message: "Data fetched successfully",
            statusCode: 200
        }
    }
}
