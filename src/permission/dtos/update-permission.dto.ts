import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

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

    @IsString()
    @IsOptional()
    roleId: string
}
