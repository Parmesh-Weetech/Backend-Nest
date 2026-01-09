import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from "bcryptjs";
import { SignupDTO } from './dtos/signup.dto.js';
import { LoginDTO } from './dtos/login.dto.js';
import { User } from '../user/entities/user.entity.js';
import { RoleService } from '../role/role.service.js';
import { OrganizationService } from '../organization/organization.service.js';
import { PermissionService } from '../permission/permission.service.js';

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
        if (!newOrganization) throw new InternalServerErrorException("Failed to create organization");

        const existingAdminRole = await this.roleService.findRoleByOrganization('admin');
        if (!existingAdminRole) throw new NotFoundException("Admin role not found.");

        const copiedPermissions = await Promise.all(
            existingAdminRole.permissions.map(permission =>
                this.permissionService.create({
                    key: permission.key,
                    label: permission.label,
                    description: permission.description,
                    entity: permission.entity,
                    action: permission.action
                }, newOrganization.id)
            )
        );

        const newRole = await this.roleService.create({
            key: existingAdminRole.key,
            label: existingAdminRole.label,
            description: existingAdminRole.description,
            permissionIds: copiedPermissions.map(p => p.id)
        }, newOrganization.id);

        const newUser = this.userRepository.create({
            name: signupDTO.name,
            email: signupDTO.email,
            password: signupDTO.password,
            organization: newOrganization,
            roles: [newRole]
        });

        return await this.userRepository.save(newUser);
    }
    async login(loginDTO: LoginDTO): Promise<string> {
        if(loginDTO.organizationId) {
            const organization = await this.organizationService.findOne(loginDTO.organizationId);

            if (!organization) throw new NotFoundException("Organization not found.");
            
        }
        
        const user = await this.userRepository.findOne({ where: { email: loginDTO.email } });

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
