import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from "bcryptjs";
import { SignupDTO } from './dtos/signup.dto.js';
import { LoginDTO } from './dtos/login.dto.js';
import { User } from '../user/entities/user.entity.js';
import { RoleService } from '../role/role.service.js';
import { OrganizationService } from '../organization/organization.service.js';
import { PermissionService } from '../permission/permission.service.js';
import { Permission } from '../permission/entities/permission.entity.js';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly organizationService: OrganizationService,
        private readonly roleService: RoleService,
        private readonly permissionService: PermissionService
    ) { }

    async signup(signupDTO: SignupDTO): Promise<User> {
        const newOrganization = await this.organizationService.create({ name: "Default" });

        if (!newOrganization) throw new InternalServerErrorException("Internal server error while creating organization.");

        const existingRolePermission = await this.roleService.findRoleByOrganization('admin');

        if (!existingRolePermission) {
            throw new NotFoundException("Admin role not found.");
        }

        const newCopiedRole = await this.roleService.create({
            key: existingRolePermission.key,
            label: existingRolePermission.label,
            description: existingRolePermission.description,
            organizationIds: [newOrganization.id],
        });

        const existingPermissions = await Promise.all(
            existingRolePermission.permissions.flatMap(permission =>
                newCopiedRole.map(copiedRole =>
                    this.permissionService.create({
                        key: permission.key,
                        label: permission.label,
                        description: permission.description,
                        entity: permission.entity,
                        action: permission.action,
                        organizationId: newOrganization.id,
                        roleIds: [copiedRole.id],
                    })
                )
            )
        );

        if (!existingPermissions || existingPermissions.length === 0) {
            throw new InternalServerErrorException("Internal server exception while creating new permissions");
        }

        const newUser = await this.userRepository.create({
            name: signupDTO.name,
            email: signupDTO.email,
            password: signupDTO.password,
            organization: newOrganization,
            roles: newCopiedRole
        });

        if (!newCopiedRole || !existingPermissions || existingPermissions.length === 0) {
            throw new InternalServerErrorException("Internal server error while creating user.");
        }

        return await this.userRepository.save(newUser);
    }

    async login(loginDTO: LoginDTO): Promise<string> {
        const organization = await this.organizationService.findOne(loginDTO.organizationId);

        if (!organization) throw new NotFoundException("Organization not found.");

        const user = await this.userRepository.findOne({ where: { email: loginDTO.email, organization: { id: loginDTO.organizationId } } });

        if (!user) {
            throw new NotFoundException("User with this email not exists")
        }

        const checkPassword = await bcrypt.compare(loginDTO.password, user.password);

        if (!checkPassword) {
            throw new UnauthorizedException("Invalid Credentials");
        }

        return user.id;
    }
}
