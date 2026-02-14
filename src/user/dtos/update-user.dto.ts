import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, IsUUID, MaxLength, MinLength } from "class-validator"

export class updateUserDTO {
    @IsString()
    @IsNotEmpty()
    @IsUUID('all')
    id: string;

    @MinLength(3)
    @MaxLength(20)
    @IsString()
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    organizationId?: string;

    @IsArray()
    @IsOptional()
    roleIds?: string[];

    @IsString()
    @MaxLength(10)
    @IsStrongPassword()
    @IsOptional()
    password?: string;
}