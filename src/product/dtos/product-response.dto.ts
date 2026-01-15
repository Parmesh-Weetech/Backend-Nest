import { Product } from "../entities/product.entity"

export class ProductResponse {
    success: boolean
    message: string
    data: Product | Product[] | null
    expired: boolean | null
    statusCode: number
}