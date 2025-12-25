import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './dtos/user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) { } // typeorm will automatically create repository of user for us. We don't need to create it.

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async create(userDTO: UserDTO): Promise<User> {
        const user = await this.userRepository.create({
            firstName: userDTO.firstName
        })

        return await this.userRepository.save(user);
    }

    async findById(id: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ id: id });

        if(!user) {
            throw new NotFoundException("User not found");
        }

        return user;
    }

    async update(userDTO: UserDTO): Promise<User> {
        const user = await this.userRepository.update({ id: userDTO.id }, { firstName: userDTO.firstName });

        if(!user) {
            throw new InternalServerErrorException("Internal server error while updating data.");
        }

        return {
            id: userDTO.id,
            firstName: userDTO.firstName
        };
    }

    async delete(id: string): Promise<number> {
        const user = await this.userRepository.delete({ id: id });

        if (user.affected !== null && user.affected !== undefined && user.affected > 0) {
            return user.affected;
        }

        return 0;
    }
}
