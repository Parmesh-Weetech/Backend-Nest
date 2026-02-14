import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true, collection: 'roles' })
export class RoleDocument extends Document {
    @Prop({ required: true })
    key: string;

    @Prop({ required: true })
    label: string;

    @Prop()
    description: string;

    @Prop({ type: String })
    organization: string;

    @Prop({ type: [String], default: [] })
    permissionIds: string[];

    @Prop({ default: null })
    deleted_at?: Date;
}

export const RoleSchema =
    SchemaFactory.createForClass(RoleDocument);
