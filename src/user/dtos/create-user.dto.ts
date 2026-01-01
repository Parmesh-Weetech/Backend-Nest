import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, IsUUID, MaxLength, MinLength } from "class-validator"

export class CreateUserDTO {

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(20)
    name: string;
    
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MaxLength(10)
    @IsStrongPassword()
    password: string;

    @IsString()
    @IsUUID('all', { each: true })
    @IsNotEmpty()
    organizationId: string;

    @IsArray()
    @IsUUID('all', { each: true })
    @IsNotEmpty()
    roleIds: string[];
}