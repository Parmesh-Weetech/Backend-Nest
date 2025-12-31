import { ArrayNotEmpty, IsArray, IsEmail, IsNotEmpty, IsString, IsStrongPassword, IsUUID, MaxLength, MinLength } from "class-validator"

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
    password?: string;

    @IsArray()
    @IsUUID('all', { each: true })
    @IsNotEmpty()
    roleIds: string[];
}