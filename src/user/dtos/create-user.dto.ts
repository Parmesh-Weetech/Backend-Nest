import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator"

export class CreateUserDTO {

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(20)
    name: string
    
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string

    @IsString()
    @MinLength(8)
    @MaxLength(10)
    @IsStrongPassword()
    password: string
}