import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdatePostDTO {
    @IsString()
    @IsNotEmpty()
    id: string

    @IsString()
    @MaxLength(50)
    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    name: string;

    @IsString()
    @MaxLength(255)
    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    description?: string;
}