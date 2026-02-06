import {
    IsEmail,
    IsOptional,
    IsString,
    IsUUID,
    Length
} from "class-validator"

export class LoginDTO {
    @IsEmail()
    email: string;

    @IsString()
    @Length(8, 20, { message: "Passwords must be between 8 and 20 characters" })
    password: string;

    @IsString()
    @IsOptional()
    @IsUUID("all", { each: true })
    organizationId: string | null

    @IsString()
    hcaptchaToken: string
}