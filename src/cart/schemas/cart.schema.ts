import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CartItemDocument } from './cart_item.schema';

@Schema({ timestamps: true })
export class CartDocument extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'CartItem' }] })
    items: CartItemDocument[];

    @Prop({ enum: ['ACTIVE', 'CHECKED_OUT', 'ORDER'], default: 'ACTIVE' })
    status: string;
}

export const CartSchema = SchemaFactory.createForClass(CartDocument);
