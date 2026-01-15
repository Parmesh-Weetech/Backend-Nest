export class TokenResponse {
    success: boolean
    message: string
    statusCode: number
    access_token?: string
    refresh_token?: string
}