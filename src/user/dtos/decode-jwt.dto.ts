export class DecodedJwt {
    sub: string
    email: string
    orgId?: string
    orgProvider?: 'postgres' | 'mongodb'
    exp: any
    iat: any
}
