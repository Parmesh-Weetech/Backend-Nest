import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { APIResponse } from '../common/response/response.dto';
import { User } from '../user/entities/user.entity';

import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { type IOrganizationRepository, ORGANIZATION_REPOSITORY } from './organization.repository.interface';

@Injectable()
export class OrganizationService {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
  ) { }

  async findAll(user: User): Promise<APIResponse> {
    const organizations =
      await this.organizationRepository.findAllByUser(user.id);

    if (!organizations || organizations.length === 0)
      throw new NotFoundException('No organizations found.');

    return {
      success: true,
      message: "Organizations fetched successfully.",
      data: organizations,
      expired: false,
      statusCode: 200
    };
  }

  async findOne(id: string): Promise<APIResponse> {
    console.log(id);
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
    const organization = await this.organizationRepository.create(createOrganizationDto);

    if (!organization) throw new InternalServerErrorException('Failed to create organization.');

    return {
      success: true,
      message: "Organization Created Successfully.",
      data: organization,
      expired: false,
      statusCode: 201
    }
  }

  async update(updateOrganizationDto: UpdateOrganizationDto): Promise<APIResponse> {
    const organization = await this.organizationRepository.update(
      updateOrganizationDto.id,
      { name: updateOrganizationDto.name }
    );
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

    const res = await this.organizationRepository.softDelete(id);

    if (!res) {
      throw new InternalServerErrorException("Error while removing organization.")
    }

    return {
      success: true,
      expired: false,
      data: null,
      message: "Organization removed successfully.",
      statusCode: 200
    }
  }
}
