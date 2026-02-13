import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class MessageDocument extends Document {
    @Prop()
    content: string;

    @Prop()
    type: string;

    @Prop({ required: true })
    conversationId: string;

    @Prop({ required: true })
    senderId: string;

    @Prop({ type: Array })
    attachments: any[];
}

export const MessageSchema = SchemaFactory.createForClass(MessageDocument);
