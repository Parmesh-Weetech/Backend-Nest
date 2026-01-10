import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, Length } from "class-validator"

export class LoginDTO {
    @IsEmail()
    email: string;

    @IsString()
    @Length(8, 10, { message: "Passwords must be between 8 and 10 characters" })
    password: string;

    @IsString()
    @IsOptional()
    @IsUUID("all", { each: true })
    organizationId: string

    @IsOptional()
    @IsString()
    hcaptchaToken: string
}