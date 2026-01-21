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