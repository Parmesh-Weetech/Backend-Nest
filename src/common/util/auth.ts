import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { DecodedJwt } from "../../user/dtos/decode-jwt.dto";

@Injectable()
export class Auth {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}
    async verify(token: string): Promise<boolean> {
        if (!token) return false;

        try {
            await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async decode(authorization: string): Promise<DecodedJwt> {
        const decodedPayload = this.jwtService.decode(authorization, {
            json: true
        });

        return decodedPayload;
    }

    async generateAccessToken(payload: { sub: string, email: string, orgId: string }): Promise<string> {
        const access_token = await this.jwtService.signAsync({ sub: payload.sub, email: payload.email, orgId: payload.orgId });

        return access_token;
    }

    async generateRefreshToken(payload: { sub: string }): Promise<string> {
        const refresh_token = await this.jwtService.signAsync({ sub: payload.sub }, { expiresIn: "1d" });

        return refresh_token;
    }
}