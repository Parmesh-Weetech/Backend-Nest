import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class UserDocument extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: String })
    organization: string;

    @Prop({ type: [String], default: [] })
    roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);