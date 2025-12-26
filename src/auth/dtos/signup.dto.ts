import { IsEmail, IsInt, IsNotEmpty, IsString, Max, IsStrongPassword, MaxLength, MinLength, ValidateIf } from "class-validator"
import { Transform } from 'class-transformer';
import { Match } from "../util/passwordMatch.util";

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
    @IsNotEmpty()
    @ValidateIf((obj) => obj.roleId !== undefined)
    roleId: string
}