import {
    IsBoolean,
    IsEmail,
    IsIn,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsStrongPassword,
    MaxLength,
    MinLength,
} from "class-validator"

export class SignupDTO {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(20)
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsStrongPassword()
    @MaxLength(20)
    password: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(50)
    organizationName?: string;

    @IsOptional()
    @IsIn(['postgres', 'mongodb'])
    database_provider?: 'postgres' | 'mongodb';

    @IsOptional()
    @IsBoolean()
    postEnabled?: boolean;
}
