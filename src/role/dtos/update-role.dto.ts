import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

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
}
