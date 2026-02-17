import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateOrganizationDto {
    @IsString()
    @IsNotEmpty()
    id: string

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    name: string;

    @IsOptional()
    @IsIn(['postgres', 'mongodb'])
    database_provider?: 'postgres' | 'mongodb';

    @IsOptional()
    @IsBoolean()
    postEnabled?: boolean;
}
