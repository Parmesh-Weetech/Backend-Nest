import { IsInt, IsNumber, IsUUID, Min } from "class-validator";

export class CreateCartItemDTO {
    @IsUUID()
    productId: string;

    @IsInt()
    @Min(1)
    quantity: number;

    @IsNumber()
    price: number;
}