import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { APIResponse } from '../common/response/response.dto';
import { User } from '../user/entities/user.entity';

import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationRepository } from './organization.repository';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(OrganizationRepository)
    private readonly organizationRepository: OrganizationRepository,
  ) { }

  async findAll(user: User): Promise<APIResponse> {
    const organizations = await this.organizationRepository.findAll(user.id);
    if (!organizations) throw new NotFoundException('No organizations found.');

    return {
      success: true,
      message: "Organizations fetched successfully.",
      data: organizations.length > 0 ? organizations : [],
      expired: false,
      statusCode: 200
    };
  }

  async findOne(id: string): Promise<APIResponse> {
    const organization = await this.organizationRepository.findById(id);
    if (!organization) throw new NotFoundException('Organization not found.');

    return {
      success: true,
      message: "Organization fetched successfully.",
      data: organization,
      expired: false,
      statusCode: 200
    };
  }

  async create(createOrganizationDto: CreateOrganizationDto): Promise<APIResponse> {
    const newOrganization = this.organizationRepository.createOrganization(createOrganizationDto)

    if (!newOrganization) throw new InternalServerErrorException('Failed to create organization.');

    return {
      success: true,
      message: "Organization Created Successfully.",
      data: newOrganization,
      expired: false,
      statusCode: 201
    }
  }

  async update(updateOrganizationDto: UpdateOrganizationDto): Promise<APIResponse> {
    const existingOrganization = await this.findOne(updateOrganizationDto.id);

    if (updateOrganizationDto.name) existingOrganization.data.name = updateOrganizationDto.name;

    const organization = await this.organizationRepository.updateOrganization(updateOrganizationDto)
    if (!organization) throw new InternalServerErrorException('Failed to update organization.');

    return {
      success: true,
      message: "Organization Updated Successfully.",
      data: organization,
      expired: false,
      statusCode: 200
    }
  }

  async remove(id: string): Promise<APIResponse> {
    await this.findOne(id);

    const res = await this.organizationRepository.softDeleteOrganization(id);

    if (!res) throw new InternalServerErrorException("Error while removing organization.")

    return {
      success: true,
      expired: false,
      data: null,
      message: "Organization removed successfully.",
      statusCode: 200
    }
  }
}
