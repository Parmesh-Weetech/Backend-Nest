import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRoleDTO {
    @IsString()
    @IsNotEmpty()
    key: string;

    @IsString()
    @IsNotEmpty()
    label: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    @IsUUID('all', { each: true })
    @IsNotEmpty()
    organizationId: string;
}
