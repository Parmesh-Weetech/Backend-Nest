import { IsArray, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePermissionDTO } from '../../permission/dtos/create-permission.dto';

export class UpdateRoleDTO {
    @IsString()
    @IsOptional()
    @MinLength(3)
    name?: string;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreatePermissionDTO)
    permissions?: CreatePermissionDTO[];
}
