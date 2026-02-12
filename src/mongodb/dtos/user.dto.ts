import { Transform } from "class-transformer";
import { IsEmail, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateUserDTO {
    @IsString()
    name: string;

    @IsString()
    @IsEmail()
    email: string
}

export class ResponseUserDTO {
    @IsOptional()
    @IsUUID("all", { each: true })
    @Transform(({ value }) => value.toString()) _id: string;
    id?: string = undefined

    @IsString()
    name: string;

    @IsString()
    @IsEmail()
    email: string
}