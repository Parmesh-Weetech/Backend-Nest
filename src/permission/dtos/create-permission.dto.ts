import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
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

    // @IsArray()
    // @IsUUID('all', { each: true })
    // @IsNotEmpty()
    // organizationIds: string[];

    @IsArray()
    @IsNotEmpty()
    roleIds: string[]
}
