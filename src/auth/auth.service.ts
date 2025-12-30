import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from "bcryptjs";
import { SignupDTO } from './dtos/signup.dto.js';
import { LoginDTO } from './dtos/login.dto.js';
import { User } from '../user/entities/user.entity.js';
import { RoleService } from '../role/role.service.js';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly roleService: RoleService
    ) { }

    async signup(signupDTO: SignupDTO): Promise<User> {
        const user = await this.userRepository.findOne({ where: { email: signupDTO.email } });
        let role;

        if (user) {
            throw new ConflictException("User with this email already exists");
        }

        // if (!signupDTO.roleId) {
        //     const existingRole = await this.roleService.findRoleByKey("system");

        //     if(!existingRole) {
        //         const newRole = await this.roleService.createRole({
        //             key: "system",
        //             label: "System",
        //             description: "Full Software Access"
        //         });

        //         role = newRole;
        //     } else {
        //         role = existingRole
        //     }
        // } else {
        //     const existingRole = await this.roleService.findOne(signupDTO.roleId);

        //     if (existingRole) {
        //         role = existingRole;
        //     } else {
        //         const newRole = await this.roleService.createRole({
        //             key: "system",
        //             label: "System",
        //             description: "Full Software Access"
        //         });

        //         role = newRole;
        //     }
        // }

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
                });
            }
        }

        const newUser = await this.userRepository.create({
            name: signupDTO.name,
            email: signupDTO.email,
            password: signupDTO.password,
            role: role
        });

        return await this.userRepository.save(newUser);
    }

    async login(loginDTO: LoginDTO): Promise<string> {
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
