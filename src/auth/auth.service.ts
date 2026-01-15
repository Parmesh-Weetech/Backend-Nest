import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from "bcryptjs";
import { SignupDTO } from './dtos/signup.dto.js';
import { LoginDTO } from './dtos/login.dto.js';
import { User } from '../user/entities/user.entity.js';
import { RoleService } from '../role/role.service.js';
import { OrganizationService } from '../organization/organization.service.js';
import { PermissionService } from '../permission/permission.service.js';
import { Refresh_token } from '../user/entities/refresh_token.entity.js';
import { TokenResponse } from './dtos/token-response.dto.js';
import { signupResponse } from './dtos/signup-response.dto.js';
import { Auth } from '../common/util/auth.js';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly organizationService: OrganizationService,
        private readonly roleService: RoleService,
        private readonly permissionService: PermissionService,
        @InjectRepository(Refresh_token)
        private readonly refresh_tokenRepository: Repository<Refresh_token>,
        private readonly auth: Auth
    ) { }

    async signup(signupDTO: SignupDTO): Promise<signupResponse> {
        const newOrganization = await this.organizationService.create({ name: "Default" });
        if (!newOrganization) throw new InternalServerErrorException("Failed to create organization");

        const existingAdminRole = await this.roleService.findRoleByOrganization('admin');
        if (!existingAdminRole) throw new NotFoundException("Admin role not found.");

        const copiedPermissions = await Promise.all(
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
            permissionIds: copiedPermissions.map(p => p.id)
        }, newOrganization.data.id);

        const newUser = this.userRepository.create({
            name: signupDTO.name,
            email: signupDTO.email,
            password: signupDTO.password,
            organization: newOrganization.data,
            roles: [newRole.data]
        });

        const user = await this.userRepository.save(newUser);

        if (!user) {
            return {
                success: false,
                message: "Registration Unsuccessful."
            }
        }

        return {
            success: true,
            message: "Registration Successful."
        }
    }
    async login(loginDTO: LoginDTO): Promise<TokenResponse> {
        if (loginDTO.organizationId) {
            const organization = await this.organizationService.findOne(loginDTO.organizationId);

            if (!organization) throw new NotFoundException("Organization not found.");

        }

        const user = await this.userRepository.findOne({ where: { email: loginDTO.email } });

        if (!user) {
            throw new NotFoundException("User with this email not exists")
        }

        const checkPassword = await bcrypt.compare(loginDTO.password, user.password);

        if (!checkPassword) {
            return {
                success: false,
                message: "Invalid Credentials"
            }
        }

        const access_token = await this.auth.generateAccessToken({ sub: user.id, email: user.email });
        const refresh_token = await this.auth.generateRefreshToken({ sub: user.id });

        const saveRefreshToken = await this.refresh_tokenRepository.create({
            user: user,
            refresh_token: refresh_token
        });

        const savedRefreshToken = await this.refresh_tokenRepository.save(saveRefreshToken);

        if (!savedRefreshToken) {
            return {
                success: false,
                message: "Invalid Credentials"
            }
        }

        return {
            success: true,
            message: "Login Successful.",
            access_token: access_token,
            refresh_token: refresh_token
        }
    }

    async logout(token: string): Promise<TokenResponse> {
        const decodedPayload = await this.auth.decode(token);

        const deleteRefreshToken = await this.refresh_tokenRepository.delete({ user: { id: decodedPayload.sub } });

        if (deleteRefreshToken.affected !== null && deleteRefreshToken.affected !== undefined && deleteRefreshToken.affected > 0) {
            return {
                success: true,
                message: "Logout Successfully."
            }
        }

        return {
            success: false,
            message: "Error while logging out! try again."
        }
    }

    async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
        const isValid = this.auth.verify(refreshToken)

        if (!isValid) throw new UnauthorizedException("You must be logged in to perform this action!");

        const decode = await this.auth.decode(refreshToken);

        const user = await this.userRepository.findOne({ where: { id: decode.sub } });

        if (!user) throw new ForbiddenException("You must be logged in to perform this action!");

        const newAccessToken = await this.auth.generateAccessToken({ sub: decode.sub, email: user.email });
        const newRefreshToken = await this.auth.generateRefreshToken({ sub: decode.sub });

        if (!newAccessToken || !newRefreshToken) {
            await this.logout(refreshToken)
            return {
                success: false,
                message: "Error while refreshing the access token! Please login again."
            }
        }

        return {
            success: true,
            message: "Refresh the access token successfully.",
            access_token: newAccessToken,
            refresh_token: newRefreshToken
        }
    }
}
