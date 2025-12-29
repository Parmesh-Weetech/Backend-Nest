import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePermissionDTO {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    key: string;

    @IsString()
    @IsNotEmpty()
    label: string

    @IsString()
    @IsOptional()
    description: string

    @IsString()
    @IsNotEmpty()
    entity: string

    @IsString()
    @IsNotEmpty()
    action: string

    @IsString()
    @IsNotEmpty()
    roleId: string
}
