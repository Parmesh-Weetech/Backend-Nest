import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/create-user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './dtos/create-user.dto';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

    async signup(userDTO: UserDTO): Promise<User> {
        const user = await this.userRepository.create({
            name: userDTO.name,
            email: userDTO.email,
            password: userDTO.password
        })

        return await this.userRepository.save(user);
    }
}
