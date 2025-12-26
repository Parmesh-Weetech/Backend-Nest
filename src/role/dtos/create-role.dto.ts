import { IsArray, IsNotEmpty, IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePermissionDTO } from '../../permission/dtos/create-permission.dto';

export class CreateRoleDTO {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreatePermissionDTO)
    permissions: CreatePermissionDTO[];
}
