import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from "bcryptjs";
import { SignupDTO } from './dtos/signup.dto';
import { LoginDTO } from './dtos/login.dto';
import { Auth } from './entities/auth.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Auth) private readonly authRepository: Repository<Auth>
    ) { }

    async signup(signupDTO: SignupDTO): Promise<Auth> {
        const user = await this.findOneByEmail(signupDTO.email);

        if (user) {
            throw new ConflictException("User with this email already exists")
        }

        const newUser = await this.authRepository.create({
            name: signupDTO.name,
            email: signupDTO.email,
            password: signupDTO.password,
            roleId: signupDTO.roleId
        })

        return await this.authRepository.save(newUser)
    }

    async login(loginDTO: LoginDTO): Promise<string> {
        const user = await this.findOneByEmail(loginDTO.email);

        if (!user) {
            throw new NotFoundException("User with this email not exists")
        }

        const checkPassword = await bcrypt.compare(loginDTO.password, user.password);

        if (!checkPassword) {
            throw new UnauthorizedException("Invalid Credentials");
        }

        return user.id;
    }

    async findOneByEmail(email: string): Promise<Auth | null> {
        const auth = await this.authRepository.findOne({ where: { email: email } });
        
        return auth;
    }

    async findOne(id: string): Promise<Auth> {
        const user = await this.authRepository.findOneBy({ id });

        if (!user) {
            throw new NotFoundException("User not found.");
        }

        return user;
    }
}
