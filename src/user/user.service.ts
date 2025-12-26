import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from "bcryptjs";
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dtos/create-user.dto';
import { updateUserDTO } from './dtos/update-user.dto';
import { LoginDTO } from 'src/auth/dtos/login.dto';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

    async login(loginDTO: LoginDTO): Promise<User> {
        const user = await this.findOneByEmail(loginDTO.email);

        if (!user) {
            throw new NotFoundException("User with this email not exists")
        }

        const checkPassword = await bcrypt.compare(loginDTO.password, user.password);

        if (!checkPassword) {
            throw new UnauthorizedException("Invalid Credentials");
        }

        return user;
    }

    async findOne(id: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id }, relations: ['roles'] });

        if (!user) {
            throw new NotFoundException("User not found.");
        }

        return user;
    }

    async findOneByEmail(email: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { email: email }});

        return user;
    }

    async findUsers(): Promise<User[]> {
        const users = await this.userRepository.find({ relations: ['roles'] });

        if (!users) {
            throw new NotFoundException("Users not found.");
        }

        return users;
    }

    async create(createUserDTO: CreateUserDTO, user: User): Promise<User> {
        const newUser = await this.userRepository.create({
            name: createUserDTO.name,
            email: createUserDTO.email,
            password: createUserDTO.password,
            roleId: createUserDTO.roleId,
            auth: user
        })

        return await this.userRepository.save(newUser);
    }

    async update(updateUserDTO: updateUserDTO): Promise<User> {
        const user = await this.findOne(updateUserDTO.id);

        if (user.name) user.name = updateUserDTO.name;
        if (user.email) user.email = updateUserDTO.email;
        if (user.password) user.password = updateUserDTO.password;
        if (user.roleId) user.roleId = updateUserDTO.roleId;

        return await this.userRepository.save(user);
    }

    async delete(id: string): Promise<string> {
        const user = await this.findOne(id);

        const deleteAction = await this.userRepository.remove(user);

        if (!deleteAction) {
            throw new InternalServerErrorException("Internal Server Error");
        }

        return "User Deleted Successfully."
    }
}
