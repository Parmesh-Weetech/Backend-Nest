import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, UseInterceptors } from '@nestjs/common';

import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUserGuard } from '../common/guards/currentUser.guard';
import { APIResponse } from '../common/response/response.dto';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { CurrentUserInterceptor } from '../common/interceptors/currentUser.interceptor';
import { User } from '../user/entities/user.entity';

import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Controller('organization')
@UseGuards(AuthGuard, CurrentUserGuard)
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService
  ) { }

  @UseInterceptors(CurrentUserInterceptor)
  @Get()
  async findAll(@CurrentUser() user: User): Promise<APIResponse> {
    return await this.organizationService.findAll(user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<APIResponse> {
    return await this.organizationService.findOne(id);
  }

  @Post()
  async create(@Body() createOrganizationDto: CreateOrganizationDto): Promise<APIResponse> {
    return await this.organizationService.create(createOrganizationDto);
  }

  @Put()
  async update(@Body() updateOrganizationDto: UpdateOrganizationDto): Promise<APIResponse> {
    return await this.organizationService.update(updateOrganizationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<APIResponse> {
    return await this.organizationService.remove(id);
  }
}
