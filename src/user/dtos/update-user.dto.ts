import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator"

export class updateUserDTO {
    @IsString()
    @IsNotEmpty()
    id: string

    @MinLength(3)
    @MaxLength(20)
    @IsString()
    @IsOptional()
    name: string

    @IsEmail()
    @IsString()
    @IsOptional()
    email: string

    @IsString()
    @MinLength(8)
    @MaxLength(10)
    @IsStrongPassword()
    @IsOptional()
    password: string
}