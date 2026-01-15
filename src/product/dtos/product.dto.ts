import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class ProductDTO {
    @IsString()
    @IsOptional()
    id: string

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    image: string

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    price: number

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    rating: number

    @IsArray()
    @IsNotEmpty()
    mealType: [string]

    @IsString()
    @IsNotEmpty()
    cuisine: string

    @IsArray()
    @IsNotEmpty()
    ingredients: [string]

    @IsArray()
    @IsNotEmpty()
    instructions: [string]
}