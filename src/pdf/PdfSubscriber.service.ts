import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import { PdfService } from "./pdf.service";

@Injectable()
export class PdfSubscriberService implements OnModuleInit {
    constructor(
        private readonly configService: ConfigService,
        private readonly pdfService: PdfService
    ) { }

    async onModuleInit() {
        const redis_url = this.configService.get("REDIS_URL");
        const redis = new Redis(redis_url);

        await redis.subscribe("pdf-status");

        redis.on("message", (channel: string, message: string) => {
            if (channel === 'pdf-status') {
                const data = JSON.parse(message);

                this.pdfService.updatePdfRecord(
                    data.status,
                    data.jobId,
                    data.filePath ? data.filePath : undefined
                )
            }
        })
    }
}