import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true, collection: 'cart_items' })
export class CartItemDocument extends Document {
    @Prop({ type: Types.ObjectId, ref: 'Product' })
    productId: string;

    @Prop()
    quantity: number;

    @Prop()
    price: number;

    @Prop()
    total_price: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItemDocument);
