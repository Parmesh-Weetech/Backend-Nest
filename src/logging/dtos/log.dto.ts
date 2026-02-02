import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateIf } from 'class-validator';

export enum LogType {
    ANALYTICS = "analytics",
    ERROR = 'error',
    SECURITY = 'security',
}

export class CreateLogDto {
    @IsString()
    @IsNotEmpty()
    actionType: string; // what user did

    @IsOptional()
    @IsString()
    actorId?: string; // user ID

    @IsOptional()
    @IsString()
    targetType?: string; // resource type

    @IsOptional()
    @IsString()
    targetId?: string; // resource ID

    @IsOptional()
    @IsString()
    details?: string; // description or error message

    @IsOptional()
    metadata?: {
        ip?: string;
        userAgent?: string;
        device?: string; // mobile, desktop, tablet
        referrer?: string;
        stack?: string;
    };

    @IsEnum(LogType)
    @IsNotEmpty()
    type: LogType; // ANALYTICS | ERROR | SECURITY
}
