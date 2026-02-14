import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'videos' })
export class VideoDocument extends Document {
    @Prop({ required: true })
    path: string;

    @Prop()
    bucket: string;

    @Prop({ default: 'default.mp4' })
    originalVideoName: string;

    @Prop({ default: 'video/mp4' })
    mimeType: string;

    @Prop()
    userId: string;

    @Prop({ enum: ['PENDING', 'PROCESSING', 'ACTIVE', 'FAILED'], default: 'PENDING' })
    status: string;

    @Prop({ default: null })
    deleted_at?: Date;
}

export const VideoSchema = SchemaFactory.createForClass(VideoDocument);
