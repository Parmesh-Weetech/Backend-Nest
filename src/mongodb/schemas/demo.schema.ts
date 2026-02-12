import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Demo extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    email: string;
}

export const DemoSchema = SchemaFactory.createForClass(Demo);
