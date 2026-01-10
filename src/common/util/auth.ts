import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { DecodedJwt } from "../../user/dtos/decode-jwt.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class Auth {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}
    async verify(token: string): Promise<boolean> {
        const isValid = await this.jwtService.verify(token, {
            secret: this.configService.get("JWT_SECRET")
        })

        return isValid;
    }

    async decode(authorization: string): Promise<DecodedJwt> {
        const token = authorization.split(' ')[1];

        const decodedPayload = this.jwtService.decode(token, {
            json: true
        });

        return decodedPayload;
    }

    async generateAccessToken(payload: { sub: string, email: string }): Promise<string> {
        const access_token = await this.jwtService.signAsync({ sub: payload.sub, email: payload.email });

        return access_token;
    }

    async generateRefreshToken(payload: { sub: string }): Promise<string> {
        const refresh_token = await this.jwtService.signAsync({ sub: payload.sub }, { expiresIn: "1d" });

        return refresh_token;
    }
}