import { IsEmail, IsInt, IsNotEmpty, IsString, Min, Max, IsStrongPassword, Length, Matches, MaxLength, MinLength, ValidateIf } from "class-validator"
import { Transform } from 'class-transformer';
import { Match } from "../util/passwordMatch.util";

export class SignupDTO {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(20)
    @Transform(({ value }) => value.trim())
    name: string

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    email: string

    @IsInt()
    @IsNotEmpty()
    @Min(18, { message: 'Age must be at least 18' })
    @Max(100, { message: 'Age must not exceed 100' })
    age: number

    @IsString()
    @IsStrongPassword()
    @Length(8, 10, { message: "Passwords must be between 8 and 10 characters" })
    password: string

    @IsString()
    @IsStrongPassword()
    @MinLength(8)
    @MaxLength(10)
    @Match("password", {
        message: "Passwords do not match"
    })
    confirmPassword: string
}