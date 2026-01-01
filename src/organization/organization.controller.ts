import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { OrganizationService } from './organization.service.js';
import { CreateOrganizationDto } from './dto/create-organization.dto.js';
import { UpdateOrganizationDto } from './dto/update-organization.dto.js';
import { Organization } from './entities/organization.entity.js';
import { AuthGuard } from '../common/guards/auth.guard.js';

@Controller('organization')
@UseGuards(AuthGuard)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  async findAll(): Promise<Organization[]> {
    return await this.organizationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(id);
  }

  @Post()
  create(@Body() createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    return this.organizationService.create(createOrganizationDto);
  }

  @Put()
  update(@Body() updateOrganizationDto: UpdateOrganizationDto): Promise<Organization> {
    return this.organizationService.update(updateOrganizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<string> {
    return this.organizationService.remove(id);
  }
}
