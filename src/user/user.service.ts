import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/create-user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dtos/create-user.dto';
import { updateUserDTO } from './dtos/update-user.dto';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

    async findOne(id: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ id: id });

        if (!user) {
            throw new NotFoundException("User not found.");
        }

        return user;
    }

    async findUsers(): Promise<User[]> {
        const users = await this.userRepository.find();

        if (!users) {
            throw new NotFoundException("Users not found.");
        }

        return users;
    }

    async create(createUserDTO: CreateUserDTO): Promise<User> {
        const user = await this.userRepository.create({
            name: createUserDTO.name,
            email: createUserDTO.email,
            password: createUserDTO.password
        })

        return await this.userRepository.save(user);
    }

    async update(updateUserDTO: updateUserDTO): Promise<User> {
        const user = await this.findOne(updateUserDTO.id);

        user.name = updateUserDTO.name;
        user.email = updateUserDTO.email;
        user.password = updateUserDTO.password;

        return await this.userRepository.save(user);
    }

    async delete(id: string): Promise<string> {
        const user = await this.findOne(id);

        const deleteAction = await this.userRepository.remove(user);

        if(!deleteAction) {
            throw new InternalServerErrorException("Internal Server Error");
        }

        return "User Deleted Successfully."
    }
}
