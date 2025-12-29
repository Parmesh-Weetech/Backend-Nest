import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength, ValidateIf, IsOptional } from "class-validator"
import { Transform } from 'class-transformer';

export class SignupDTO {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(20)
    @ValidateIf((obj) => obj.name !== undefined)
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    name: string

    @IsEmail()
    @IsNotEmpty()
    @ValidateIf((obj) => obj.email !== undefined)
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    email: string

    @IsStrongPassword()
    @MaxLength(10)
    password: string

    @IsString()
    @IsOptional()
    @ValidateIf((obj) => obj.roleId !== undefined)
    roleId: string
}