import { Controller, Get, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { type Response } from 'express';

import { CurrentUserInterceptor } from '../common/interceptors/currentUser.interceptor';
import { AuthGuard } from '../common/guards/auth.guard';

import { PdfService } from './pdf.service';

@Controller('pdf')
@UseGuards(AuthGuard)
export class PdfController {
  constructor(private readonly pdfService: PdfService) { }

  @UseInterceptors(CurrentUserInterceptor)
  @Post()
  async createPdf(@Req() req, @Res() res: Response) {
    const pdf = await this.pdfService.createPdf(req.currentUser);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=invoice.pdf',
      'Content-Length': pdf.length,
    });

    res.end(pdf);
  }

  @Get("/screen-shot")
  async createScreenShot(@Res() res: Response) {
    const image = await this.pdfService.createScreenShot();

    res.set({
      'Content-Type': 'image/png',
      'Content-Length': image.length,
    });

    res.end(image);
  }
}
