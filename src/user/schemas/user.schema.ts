import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'users' })
export class UserDocument extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, lowercase: true, trim: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: String })
    organization: string;

    @Prop({ type: [String], default: [] })
    roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
UserSchema.index({ organization: 1, email: 1 }, { unique: true, name: 'organization_1_email_1' });
