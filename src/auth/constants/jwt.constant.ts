import { ConfigService } from "@nestjs/config";

export class JWTSecret {
    constructor(private readonly configService: ConfigService) {}
    jwtSecret() {
        return this.configService.get("JWT_SECRET");
    }
}