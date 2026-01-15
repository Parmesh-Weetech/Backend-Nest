import { Product } from "src/product/entities/product.entity"
import { User } from "../../user/entities/user.entity"
import { Organization } from "src/organization/entities/organization.entity"
import { Permission } from "src/permission/entities/permission.entity"
import { Role } from "src/role/entities/role.entity"
import { PostEntity } from "src/post/entities/post.entity"

export class AuthResponse {
    success: false
    expired: true
    message: string
}

export class Response {
    success: boolean
    message: string
    data: any
    expired: boolean
    statusCode: number
}