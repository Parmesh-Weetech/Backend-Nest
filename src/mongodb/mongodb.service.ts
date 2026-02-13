import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Demo } from './schemas/demo.schema';
import { ResponseUserDTO, UpdateUserDTO } from './dtos/user.dto';

@Injectable()
export class MongodbService {
    constructor(@InjectModel(Demo.name) private userModel: Model<Demo>) { }

    async create(name: string, email: string): Promise<ResponseUserDTO> {
        const user = await this.userModel.create({ name, email });
        const createdUser = user.toObject();

        return {
            id: createdUser._id.toString(),
            name: createdUser.name,
            email: createdUser.email
        }
    }

    async findAll(): Promise<ResponseUserDTO[]> {
        const users = await this.userModel.find().lean();

        return users.map((user) => ({
            id: user._id.toString(),
            name: user.name,
            email: user.email
        }))
    }

    async findOne(id: string): Promise<ResponseUserDTO> {
        const user = await this.userModel.findById(id).lean();

        if (!user) throw new NotFoundException({ message: "User not found." });

        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email
        }
    }

    async update(id: string, data: UpdateUserDTO): Promise<ResponseUserDTO> {
        const user = await this.userModel.findByIdAndUpdate(id, data, { new: true }).lean();

        if (!user) throw new InternalServerErrorException({ message: "User not updated! " });

        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email
        }
    }

    async remove(id: string) {
        return this.userModel.findByIdAndDelete(id).exec();
    }
}
