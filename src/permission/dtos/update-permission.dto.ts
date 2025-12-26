import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePermissionDTO {
    @IsString()
    @IsOptional()
    @MinLength(3)
    name?: string;
}
