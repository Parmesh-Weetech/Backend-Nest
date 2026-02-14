import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true, collection: 'refresh_tokens' })
export class RefreshTokenDocument extends Document {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    refresh_token: string;
}

export const RefreshTokenSchema =
    SchemaFactory.createForClass(RefreshTokenDocument);
