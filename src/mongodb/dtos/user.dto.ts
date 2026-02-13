import { IsEmail, IsString, IsUUID } from "class-validator";

export class CreateUserDTO {
    @IsString()
    name: string;

    @IsString()
    @IsEmail()
    email: string
}

export class ResponseUserDTO {
    @IsString()
    @IsUUID("all")
    id: string;

    @IsString()
    name: string;

    @IsString()
    @IsEmail()
    email: string
}

export class UpdateUserDTO {
    @IsString()
    @IsUUID("all")
    id: string;

    @IsString()
    name: string;

    @IsString()
    @IsEmail()
    email: string
}