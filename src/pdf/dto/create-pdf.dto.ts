import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export enum PdfStatus {
    PENDING = 'PENDING',
    GENERATED = 'GENERATED',
    PROCESSING = 'PROCESSING',
    FAILED = 'FAILED',
}

export class CreatePdfDto {
    @IsEnum(PdfStatus)
    @IsOptional()
    status?: PdfStatus;

    @IsString()
    @IsOptional()
    filePath?: string;
}
