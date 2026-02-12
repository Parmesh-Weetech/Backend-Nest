import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { MongodbService } from './mongodb.service';
import { CreateUserDTO, ResponseUserDTO } from './dtos/user.dto';

@Controller('mongodb')
export class MongodbController {
    constructor(
        private readonly mongodbService: MongodbService
    ) { }
    
    @Post()
    async create(@Body() createUserDTO: CreateUserDTO) {
        const response = await this.mongodbService.create(createUserDTO.name, createUserDTO.email);
        // return response
    }

    @Get()
    async findAll() {
        return this.mongodbService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.mongodbService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: any) {
        return this.mongodbService.update(id, body);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.mongodbService.remove(id);
    }
}
