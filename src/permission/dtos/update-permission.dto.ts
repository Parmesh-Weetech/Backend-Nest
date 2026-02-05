import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdatePermissionDTO {
    @IsString()
    @IsNotEmpty()
    id: string

    @IsString()
    @IsOptional()
    @MinLength(3)
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    key: string;

    @IsString()
    @IsOptional()
    label: string

    @IsString()
    @IsOptional()
    description: string

    @IsString()
    @IsOptional()
    entity: string

    @IsString()
    @IsOptional()
    action: string

    @IsArray()
    @IsOptional()
    @IsUUID('all', { each: true })
    organizationIds?: string[];
}
