import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class UpdateProductDTO {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsOptional()
    name: string

    @IsString()
    @IsOptional()
    image: string

    @IsNumber()
    @IsOptional()
    @IsPositive()
    price: number

    @IsNumber()
    @IsOptional()
    @IsPositive()
    rating: number

    @IsArray()
    @IsOptional()
    mealType: [string]

    @IsString()
    @IsOptional()
    cuisine: string

    @IsArray()
    @IsOptional()
    ingredients: [string]

    @IsArray()
    @IsOptional()
    instructions: [string]
}