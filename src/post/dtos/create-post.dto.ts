import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePostDTO {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    name: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    bio?: string;
}
