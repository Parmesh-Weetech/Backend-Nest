import { PartialType } from '@nestjs/swagger';
import { CreatePdfDto } from './create-pdf.dto';

export class UpdatePdfDto extends PartialType(CreatePdfDto) {}
