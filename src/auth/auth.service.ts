import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from "bcryptjs";
import { SignupDTO } from './dtos/signup.dto.js';
import { LoginDTO } from './dtos/login.dto.js';
import { User } from '../user/entities/user.entity.js';
import { RoleService } from '../role/role.service.js';
import { OrganizationService } from 'src/organization/organization.service.js';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly roleService: RoleService,
        private readonly organizationService: OrganizationService
    ) { }

    async signup(signupDTO: SignupDTO): Promise<User> {
        const user = await this.userRepository.findOne({ where: { email: signupDTO.email } });
        let role;

        if (user) {
            throw new ConflictException("User with this email already exists");
        }

        if (signupDTO.roleId) {
            role = await this.roleService.findOne(signupDTO.roleId);
        }

        if (!role) {
            role = await this.roleService.findRoleByKey('system');

            if (!role) {
                role = await this.roleService.create({
                    key: 'system',
                    label: 'System',
                    description: 'Full Software Access',
                    // organizationIds: []
                });
            }
        }

        const newUser = await this.userRepository.create({
            name: signupDTO.name,
            email: signupDTO.email,
            password: signupDTO.password,
            roles: [role]
        });

        return await this.userRepository.save(newUser);
    }

    async login(loginDTO: LoginDTO): Promise<string> {
        const organization = await this.organizationService.findOne(loginDTO.organizationId);

        if(!organization) throw new NotFoundException("Organization not found.");

        const user = await this.userRepository.findOne({ where: { email: loginDTO.email, organization: organization } });

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
