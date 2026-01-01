import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator"

export class LoginDTO {
    @IsEmail()
    email: string;

    @IsString()
    @Length(8, 10, { message: "Passwords must be between 8 and 10 characters" })
    password: string;

    @IsString()
    @IsNotEmpty()
    organizationId: string
}