import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto.js';
import { UpdateOrganizationDto } from './dto/update-organization.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity.js';
import { Repository } from 'typeorm';
import { OrganizationCreationFailedError, OrganizationDeletionFailedError, OrganizationUpdationFailedError } from './errors/error.js';
import { Response } from '../common/response/auth-response.dto.js';

@Injectable()
export class OrganizationService {
  constructor(@InjectRepository(Organization) private readonly organizationRepository: Repository<Organization>) { }
  async findAll(): Promise<Response> {
    const organizations = await this.organizationRepository.find();

    if (!organizations) return {
      success: false,
      message: "Organizations not found.",
      data: null,
      expired: false,
      statusCode: 404
    }

    return {
      success: true,
      message: "Organizations fetched successfully.",
      data: organizations,
      expired: false,
      statusCode: 200
    };
  }

  async findOne(id: string): Promise<Response> {
    const organization = await this.organizationRepository.findOne({ where: { id: id } });

    if (!organization) return {
      success: false,
      message: "Organization not found.",
      data: null,
      expired: false,
      statusCode: 404
    }

    return {
      success: true,
      message: "Organization fetched successfully.",
      data: organization,
      expired: false,
      statusCode: 200
    };
  }

  async create(createOrganizationDto: CreateOrganizationDto): Promise<Response> {
    try {
      const newOrganization = await this.organizationRepository.create(createOrganizationDto);

      const organization = await this.organizationRepository.save(newOrganization);

      return {
        success: true,
        message: "Organization Created Successfully.",
        data: organization,
        expired: false,
        statusCode: 201
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null,
        expired: false,
        statusCode: 500
      }
    }
  }

  async update(updateOrganizationDto: UpdateOrganizationDto): Promise<Response> {
    const existingOrganization = await this.findOne(updateOrganizationDto.id);

    if (existingOrganization.data.name) existingOrganization.data.name = updateOrganizationDto.name;

    try {
      const organization = await this.organizationRepository.save(existingOrganization.data);

      return {
        success: true,
        statusCode: 200,
        message: "Organization updated successfully.",
        data: organization,
        expired: false
      }
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: error.message,
        expired: false,
        data: null
      }
    }
  }

  async remove(id: string): Promise<Response> {
    try {
      const organization = await this.findOne(id);

      if(!organization.success) return organization;

      const res = await this.organizationRepository.softDelete(id);

      if(res.affected === null && res.affected === undefined && res.affected === 0) {
        throw new Error("Error while removing organization.")  
      }

      return {
        success: true,
        expired: false,
        data: res.raw,
        message: "Organization removed successfully.",
        statusCode: 200
      }
    } catch (error) {
      return {
        success: false,
        expired: false,
        data: null,
        message: error.message,
        statusCode: 500
      }
    }
  }
}
