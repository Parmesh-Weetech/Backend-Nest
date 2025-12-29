import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDTO {
    @IsString()
    @IsNotEmpty()
    key: string;

    @IsString()
    @IsNotEmpty()
    label: string

    @IsString()
    @IsOptional()
    description: string

    // @IsArray()
    // @ValidateNested({ each: true })
    // @Type(() => CreatePermissionDTO)
    // permissions: CreatePermissionDTO[];
}
