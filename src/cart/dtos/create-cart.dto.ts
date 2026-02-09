import { IsEnum } from "class-validator";
import { CartItem } from "../entities/cart.item.entity";

export class CreateCartDTO {
    @IsEnum(['ACTIVE'])
    status: 'ACTIVE' | 'CHECKED_OUT' | 'ORDER';

    items: CartItem[];
}