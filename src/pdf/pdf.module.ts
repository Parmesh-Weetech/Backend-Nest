import { Module } from '@nestjs/common';

import { CartModule } from '../cart/cart.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { BrowserService } from './browser.service';

@Module({
  controllers: [PdfController],
  providers: [PdfService, BrowserService],
  imports: [CartModule, UserModule, AuthModule]
})
export class PdfModule {}
