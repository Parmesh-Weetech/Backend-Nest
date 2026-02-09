import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsPositive,
    IsString,
    IsEnum,
} from 'class-validator';

export class CreateProductDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    image: string;

    @IsNumber()
    @IsPositive()
    price: number;

    @IsNumber()
    @IsPositive()
    rating: number;

    @IsArray()
    @IsString({ each: true }) // ✅ critical
    mealType: string[];

    @IsString()
    @IsNotEmpty()
    cuisine: string;

    @IsArray()
    @IsString({ each: true })
    ingredients: string[];

    @IsArray()
    @IsString({ each: true })
    instructions: string[];

    @IsNumber()
    prepTimeMinutes: number;

    @IsNumber()
    cookTimeMinutes: number;

    @IsEnum(['Easy', 'Medium', 'Hard'])
    difficulty: 'Easy' | 'Medium' | 'Hard';
}
