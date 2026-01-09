import { ConfigService } from "@nestjs/config";

export class JWTSecret {
    constructor(private readonly configService: ConfigService) {}
    jwtSecret() {
        return "6a8ae3db8cb1a48182e63a0cfcf1a658"
    }
}