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

    async process(job: Job<{ userId: string }>): Promise<any> {
        const { userId } = job.data;

        if (!userId) throw new Error('UserId is required to generate PDF');

        return await this.pdfService.generatePdf(userId, job.id!);
    }
}
