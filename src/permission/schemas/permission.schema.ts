import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true, collection: 'permissions' })
export class PermissionDocument extends Document {
    @Prop({ required: true })
    key: string;

    @Prop()
    label: string;

    @Prop()
    description: string;

    @Prop({ required: true })
    entity: string;

    @Prop({ required: true })
    action: string;

    @Prop({ type: String })
    organization: string;

    @Prop({ type: [String], default: [] })
    roles: string[];

    @Prop({ default: null })
    deleted_at?: Date;
}

export const PermissionSchema =
    SchemaFactory.createForClass(PermissionDocument);
