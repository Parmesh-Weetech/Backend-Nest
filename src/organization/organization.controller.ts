import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Res } from '@nestjs/common';
import { OrganizationService } from './organization.service.js';
import { CreateOrganizationDto } from './dto/create-organization.dto.js';
import { UpdateOrganizationDto } from './dto/update-organization.dto.js';
import { AuthGuard } from '../common/guards/auth.guard.js';
import type { Response } from 'express';

@Controller('organization')
@UseGuards(AuthGuard)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) { }

  @Get()
  async findAll(@Res({ passthrough: true }) res: Response): Promise<void> {
    const response = await this.organizationService.findAll();

    res.status(response.statusCode).send(response);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res({ passthrough: true }) res: Response): Promise<void> {
    const response = await this.organizationService.findOne(id);

    res.status(response.statusCode).send(response);
  }

  @Post()
  async create(@Body() createOrganizationDto: CreateOrganizationDto, @Res({ passthrough: true }) res: Response): Promise<void> {
    const response = await this.organizationService.create(createOrganizationDto);

    res.status(response.statusCode).send(response);
  }

  @Put()
  async update(@Body() updateOrganizationDto: UpdateOrganizationDto, @Res({ passthrough: true }) res: Response): Promise<void> {
    const response = await this.organizationService.update(updateOrganizationDto);

    res.status(response.statusCode).send(response);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res({ passthrough: true }) res: Response): Promise<void> {
    const response = await this.organizationService.remove(id);

    res.status(response.statusCode).send(response);
  }
}
