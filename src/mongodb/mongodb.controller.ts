import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { MongodbService } from './mongodb.service';
import { CreateUserDTO, ResponseUserDTO, UpdateUserDTO } from './dtos/user.dto';

@Controller('mongodb')
export class MongodbController {
    constructor(
        private readonly mongodbService: MongodbService
    ) { }
    
    @Post()
    async create(@Body() createUserDTO: CreateUserDTO): Promise<ResponseUserDTO> {
        return await this.mongodbService.create(createUserDTO.name, createUserDTO.email);
    }

    @Get()
    async findAll(): Promise<ResponseUserDTO[]> {
        return this.mongodbService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ResponseUserDTO> {
        return this.mongodbService.findOne(id);
    }

    @Put()
    async update(@Body() body: UpdateUserDTO) {
        return this.mongodbService.update(body);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.mongodbService.remove(id);
    }
}
