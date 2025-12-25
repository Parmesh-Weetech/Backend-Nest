import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class UserDTO {
    @IsUUID()
    @IsOptional()
    id: string

    @IsString()
    @IsNotEmpty()
    firstName: string
}