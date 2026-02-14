import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true, collection: 'products' })
export class Product {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    image: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    rating: number;

    @Prop({ type: [String], default: [] })
    mealType: string[];

    @Prop({ required: true })
    cuisine: string;

    @Prop({ type: [String], default: [] })
    ingredients: string[];

    @Prop({ type: [String], default: [] })
    instructions: string[];

    @Prop({ default: 0 })
    prepTimeMinutes: number;

    @Prop({ default: 0 })
    cookTimeMinutes: number;

    @Prop({ enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' })
    difficulty: 'Easy' | 'Medium' | 'Hard';

    @Prop({ default: null })
    deleted_at?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
