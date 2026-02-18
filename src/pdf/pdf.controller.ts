import { BadRequestException, Controller, Get, Headers, NotFoundException, Param, Post, Req, Res, UnauthorizedException, UseGuards, UseInterceptors } from '@nestjs/common';
import { type Response } from 'express';

import { CurrentUserInterceptor } from '../common/interceptors/currentUser.interceptor';
import { AuthGuard } from '../common/guards/auth.guard';

import { PdfService } from './pdf.service';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Controller('pdf')
export class PdfController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly configService: ConfigService,

    @InjectQueue("pdf")
    private readonly pdfQueue: Queue
  ) { }

  @UseGuards(AuthGuard)
  @UseInterceptors(CurrentUserInterceptor)
  @Post()
  async createPdf(@Req() req) {
    const job = await this.pdfService.createPdf(req.currentUser);

    return {
      jobId: job.jobId
    }
  }

  @Get("/internal/:userId")
  async fetchCartForPdf(@Param("userId") userId: string, @Headers("x-internal-secret") secret: string) {
    const secret_code = await this.configService.get<string>("SECRET");

    if (secret_code !== secret) {
      throw new UnauthorizedException({ message: "Unauthorized access!" });
    }

    return this.pdfService.fetchCartForPdf(userId);
  }

  @UseGuards(AuthGuard)
  @Get('download/:jobId')
  async download(
    @Param('jobId') jobId: string,
    @Res() res: Response,
  ) {
    const job = await this.pdfQueue.getJob(jobId);

    if (!job) throw new NotFoundException();

    const state = await job.getState();
    if (state !== 'completed') {
      throw new BadRequestException('PDF not ready');
    }

    const filePath = job.returnvalue;

    res.download(filePath);
  }

}
