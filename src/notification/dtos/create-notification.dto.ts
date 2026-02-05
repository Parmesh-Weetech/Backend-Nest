import {
    IsNotEmpty,
    IsString
} from 'class-validator';

export class NotificationDto {
    @IsString({ message: 'senderId must be a string' })
    @IsNotEmpty({ message: 'senderId cannot be empty' })
    senderId: string;

    @IsString({ message: 'conversationId must be a string' })
    @IsNotEmpty({ message: 'conversationId cannot be empty' })
    conversationId: string;

    @IsString({ message: 'Message must be a string' })
    @IsNotEmpty({ message: 'Message cannot be empty' })
    message: string;

    @IsString({ message: 'Date must be a string in YYYY-MM-DD format' })
    @IsNotEmpty({ message: 'Date is required' })
    date: string;

    @IsString({ message: 'Time must be a string in HH:mm format' })
    @IsNotEmpty({ message: 'Time is required' })
    time: string;

    @IsString({ message: 'Timezone must be a string' })
    @IsNotEmpty({ message: 'Timezone is required' })
    timezone: string;
}
