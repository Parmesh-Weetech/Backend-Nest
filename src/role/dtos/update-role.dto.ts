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

    @IsArray()
    @IsUUID('all', { each: true })
    @IsOptional()
    organizationIds: string[];

    @IsString()
    @IsOptional()
    description?: string;
}
