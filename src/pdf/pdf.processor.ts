import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PdfService } from './pdf.service';

@Processor('pdf')
export class PdfProcessor extends WorkerHost {
    constructor(
        private readonly pdfService: PdfService,
    ) {
        super();
    }

    async process(job: Job<{ userId: string, token: string }>): Promise<any> {
        const { userId, token } = job.data;

        return await this.pdfService.generatePdf(userId, token);
    }
}
