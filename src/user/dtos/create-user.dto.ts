import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator"

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
    @IsNotEmpty()
    roleId: string;
}