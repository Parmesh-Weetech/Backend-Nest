import { Module } from '@nestjs/common';

import { CartModule } from '../cart/cart.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { BullModule } from '@nestjs/bullmq';
import { Pdf } from './entities/pdf.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [PdfController],
  providers: [PdfService],
  imports: [CartModule, UserModule, AuthModule, TypeOrmModule.forFeature([Pdf]), BullModule.registerQueue({
    name: 'pdf',
    connection: {
      url: "redis://localhost:6379"
    }
  })]
})
export class PdfModule { }
