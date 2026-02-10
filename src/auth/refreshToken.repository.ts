import { Injectable } from "@nestjs/common";
import { Refresh_token } from "../user/entities/refresh_token.entity";
import { DataSource, Repository } from "typeorm";
import { User } from "../user/entities/user.entity";

@Injectable()
export class RefreshTokenRepository extends Repository<Refresh_token> {

    constructor(private dataSource: DataSource) {
        super(Refresh_token, dataSource.createEntityManager());
    }

    async createRefreshToken(user: User, refreshToken: string): Promise<string | null> {
        const newRefreshToken = this.create({
            refresh_token: refreshToken,
            user: user
        })

        const savedRefreshToken = await this.save(newRefreshToken);

        if (!savedRefreshToken) return null;

        return savedRefreshToken.refresh_token;
    }

    async deleteRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
        const affectedRows = await this.delete({ user: { id: userId }, refresh_token: refreshToken });

        if (affectedRows.affected === null || affectedRows.affected === undefined || affectedRows.affected === 0) return false;

        return true;
    }

    async findByToken(refreshToken: string): Promise<Refresh_token | null> {
        const refreshTokenData = await this.findOne({ where: { refresh_token: refreshToken } });

        if (!refreshTokenData) return null;

        return refreshTokenData;
    }

    async updateRefreshToken(id: string, refreshToken: string, user: User): Promise<boolean | null> {
        console.log("update refreshtoken")
        const updateRefreshToken = await this.update(id, {
            refresh_token: refreshToken,
            user: user
        });

        if(updateRefreshToken.affected === null || updateRefreshToken.affected === undefined || updateRefreshToken.affected === 0) return null;

        return true;
    }
}