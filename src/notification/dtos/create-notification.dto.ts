import { Type } from 'class-transformer';
import {
    IsNotEmpty,
    IsString,
    IsISO8601,
    IsOptional,
    ValidateNested
} from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Conversation } from 'src/websocket/entities/conversation.entity';

export class CreateNotificationDto {
    @ValidateNested()
    @Type(() => User)
    @IsNotEmpty({ message: 'Sender is required' })
    sender: User;

    @ValidateNested()
    @Type(() => Conversation)
    @IsNotEmpty({ message: 'Conversation is required' })
    conversation: Conversation;

    @IsString({ message: 'Message must be a string' })
    @IsNotEmpty({ message: 'Message cannot be empty' })
    message: string;

    // Date in "YYYY-MM-DD" format
    @IsString({ message: 'Date must be a string in YYYY-MM-DD format' })
    @IsNotEmpty({ message: 'Date is required' })
    date: string;

    // Time in "HH:mm" 24-hour format
    @IsString({ message: 'Time must be a string in HH:mm format' })
    @IsNotEmpty({ message: 'Time is required' })
    time: string;

    // Timezone like "Asia/Kolkata"
    @IsString({ message: 'Timezone must be a string' })
    @IsNotEmpty({ message: 'Timezone is required' })
    timezone: string;
}
