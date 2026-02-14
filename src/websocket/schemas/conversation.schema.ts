import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'conversations' })
export class ConversationDocument extends Document {
    @Prop({ required: true })
    user1Id: string;

    @Prop({ required: true })
    user2Id: string;

    createdAt?: Date;
    updatedAt?: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(ConversationDocument);
