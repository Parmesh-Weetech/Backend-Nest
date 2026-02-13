import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ConversationDocument extends Document {
    @Prop({ required: true })
    user1Id: string;

    @Prop({ required: true })
    user2Id: string;
}

export const ConversationSchema = SchemaFactory.createForClass(ConversationDocument);
