import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class UpdateRoleDTO {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsOptional()
    @MinLength(3)
    key?: string;

    @IsString()
    @IsOptional()
    label?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    @IsOptional()
    @IsUUID('all', { each: true })
    permissionIds?: string[]

    @IsArray()
    @IsOptional()
    @IsUUID('all', { each: true })
    organizationIds?: string[];
}
