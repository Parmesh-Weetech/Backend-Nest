import { Type } from "class-transformer";
import { IsInt, IsNumber, IsUUID, Min, ValidateNested } from "class-validator";

export class CreateCartItemDTO {
    @IsUUID()
    productId: string;

    @IsInt()
    @Min(1)
    quantity: number;

    @IsNumber()
    price: number;
}

export class AddToCartDTO {
    @ValidateNested({ each: true })
    @Type(() => CreateCartItemDTO)
    items: CreateCartItemDTO[];
}