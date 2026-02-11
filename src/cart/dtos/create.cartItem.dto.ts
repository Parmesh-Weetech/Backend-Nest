import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsInt, IsNumber, IsString, IsUUID, Min, ValidateNested } from "class-validator";

export class CreateCartItemDTO {
    @IsUUID()
    productId: string;

    @IsInt()
    @Min(1)
    quantity?: number = 1;

    @IsNumber()
    price: number;
}

export class AddToCartDTO {
    @ValidateNested({ each: true })
    @Type(() => CreateCartItemDTO)
    items: CreateCartItemDTO[];
}

export class RemoveCartItemDTO {
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    ids: string[];
}