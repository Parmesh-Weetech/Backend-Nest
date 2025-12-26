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
    @IsOptional()
    email: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    roleId: string

    @IsString()
    @MaxLength(10)
    @IsStrongPassword()
    @IsOptional()
    password: string
}