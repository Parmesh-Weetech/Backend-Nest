import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'organizations' })
export class OrganizationDocument extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ type: Object })
    config: Record<string, any>;

    @Prop({ type: [String], default: [] })
    users: string[];

    @Prop({ default: null })
    deleted_at?: Date;
}

export const OrganizationSchema =
    SchemaFactory.createForClass(OrganizationDocument);
