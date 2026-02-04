import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import bcrypt from "bcryptjs";

import { Auth } from '../common/util/auth';
import { APIResponse } from '../common/response/response.dto';
import { RoleService } from '../role/role.service';
import { PermissionService } from '../permission/permission.service';
import { OrganizationService } from '../organization/organization.service';
import { User } from '../user/entities/user.entity';
import { Refresh_token } from '../user/entities/refresh_token.entity';

import { SignupDTO } from './dtos/signup.dto';
import { LoginDTO } from './dtos/login.dto';
import { TokenResponse } from './dtos/token-response.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Refresh_token)
        private readonly refresh_tokenRepository: Repository<Refresh_token>,
        
        private readonly roleService: RoleService,
        private readonly permissionService: PermissionService,
        private readonly organizationService: OrganizationService,
        
        private readonly auth: Auth
    ) { }

    async signup(signupDTO: SignupDTO): Promise<APIResponse> {
        const isUserExists = await this.userRepository.findOne({ where: { email: signupDTO.email } });
        if (isUserExists) throw new ConflictException({ message: "User with this email already exists!" });

        const newOrganization = await this.organizationService.create({ name: "Default" });
        if (!newOrganization) throw new InternalServerErrorException({ message: "Something went wrong while processing your request" });

        const existingAdminRole = await this.roleService.findRoleByOrganizationName('admin');
        if (!existingAdminRole) throw new NotFoundException({ message: "Admin role not found." });

        const newPermissions = await Promise.all(
            existingAdminRole.data.permissions.map(permission =>
                this.permissionService.create({
                    key: permission.key,
                    label: permission.label,
                    description: permission.description,
                    entity: permission.entity,
                    action: permission.action
                }, newOrganization.data.id)
            )
        );

        const newRole = await this.roleService.create({
            key: existingAdminRole.data.key,
            label: existingAdminRole.data.label,
            description: existingAdminRole.data.description,
            permissionIds: newPermissions.map(p => p.id)
        }, newOrganization.data.id);

        const newUser = this.userRepository.create({
            name: signupDTO.name,
            email: signupDTO.email,
            password: signupDTO.password,
            organization: newOrganization.data,
            roles: [newRole.data]
        });

        const user = await this.userRepository.save(newUser);
        if (!user) throw new InternalServerErrorException({ message: "Something went wrong while processing user." });

        return {
            success: true,
            message: "Registration Successful.",
            data: user,
            expired: false,
            statusCode: 201
        }
    }

    async login(loginDTO: LoginDTO): Promise<TokenResponse> {
        if (loginDTO.organizationId) {
            const organization = await this.organizationService.findOne(loginDTO.organizationId);
            if (!organization) throw new NotFoundException({ message: "Organization not found!" });
        }

        const user = await this.userRepository.findOne({ where: { email: loginDTO.email } });
        if (!user) throw new NotFoundException({ message: "User with this email not found!" });

        const checkPassword = await bcrypt.compare(loginDTO.password, user.password);
        if (!checkPassword) throw new UnauthorizedException({ message: "Invalid Credentials!" });

        const access_token = await this.auth.generateAccessToken({ sub: user.id, email: user.email });
        const refresh_token = await this.auth.generateRefreshToken({ sub: user.id });

        const saveRefreshToken = this.refresh_tokenRepository.create({
            user: user,
            refresh_token: refresh_token
        });

        const savedRefreshToken = await this.refresh_tokenRepository.save(saveRefreshToken);
        if (!savedRefreshToken) throw new InternalServerErrorException({ message: "Something went wrong while processing your request." });

        return {
            success: true,
            message: "Login Successful.",
            statusCode: 200,
            access_token: access_token,
            refresh_token: refresh_token
        }
    }

    async logout(authorization: string): Promise<APIResponse> {
        const token = authorization?.split(' ')[1];

        const decodedPayload = await this.auth.decode(token);

        const deleteRefreshToken = await this.refresh_tokenRepository.delete({ user: { id: decodedPayload.sub } });

        if (deleteRefreshToken.affected !== null && deleteRefreshToken.affected !== undefined && deleteRefreshToken.affected > 0) {
            return {
                success: true,
                statusCode: 200,
                message: "Logout Successfully.",
                data: null,
                expired: false
            }
        }

        throw new InternalServerErrorException({ message: "Something went wrong while processing your request" })
    }

    async refreshAccessToken(refreshToken: string): Promise<APIResponse> {
        const isValid = this.auth.verify(refreshToken);

        if (!isValid) throw new UnauthorizedException({ message: "Token expired!" , expired: true });

        const decode = await this.auth.decode(refreshToken);

        const user = await this.userRepository.findOne({ where: { id: decode.sub } });
        if (!user) throw new NotFoundException({ message: "User not found!" });

        const newAccessToken = await this.auth.generateAccessToken({ sub: decode.sub, email: user.email });
        const newRefreshToken = await this.auth.generateRefreshToken({ sub: decode.sub });

        if (!newAccessToken || !newRefreshToken) {
            await this.logout(refreshToken)
            throw new InternalServerErrorException({ message: "Something went wrong while processing your request." });
        }

        return {
            success: true,
            message: "Refresh the access token successfully.",
            statusCode: 200,
            data: {
                access_token: newAccessToken,
                refresh_token: newRefreshToken
            },
            expired: false
        }
    }
}
