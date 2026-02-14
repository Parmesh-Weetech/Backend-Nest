import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, collection: 'notifications' })
export class NotificationDocument extends Document {
    @Prop({ required: true })
    senderId: string;

    @Prop({ required: true })
    conversationId: string;

    @Prop({ required: true })
    message: string;

    @Prop({ required: true, enum: ['PENDING', 'SENT', 'FAILED'], default: 'PENDING' })
    status: 'PENDING' | 'SENT' | 'FAILED';

    @Prop({ required: true })
    scheduledAt: Date;

    @Prop({ required: true, default: 'UTC' })
    timezone: string;

    @Prop({ type: Date, default: null })
    sentAt: Date | null;

    createdAt?: Date;
    updatedAt?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(NotificationDocument);
