import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';

@Controller('organization')
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

  @Patch(':id')
  update(@Body() updateOrganizationDto: UpdateOrganizationDto): Promise<Organization> {
    return this.organizationService.update(updateOrganizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<string> {
    return this.organizationService.remove(id);
  }
}
