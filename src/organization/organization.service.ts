import { forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Auth } from '../common/util/auth';
import { APIResponse } from '../common/response/response.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    private readonly auth: Auth,
  ) { }

  async findAll(user: User): Promise<APIResponse> {
    const organizations = await this.organizationRepository.find({ where: { users: In([user.id]) }, relations: ['users'] });

    if (!organizations) throw new NotFoundException('No organizations found.');

    return {
      success: true,
      message: "Organizations fetched successfully.",
      data: organizations,
      expired: false,
      statusCode: 200
    };
  }

  async findOne(id: string): Promise<APIResponse> {
    const organization = await this.organizationRepository.findOne({ where: { id: id } });
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
    const newOrganization = this.organizationRepository.create(createOrganizationDto);

    const organization = await this.organizationRepository.save(newOrganization);

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
    const existingOrganization = await this.findOne(updateOrganizationDto.id);

    if (updateOrganizationDto.name) existingOrganization.data.name = updateOrganizationDto.name;

    const organization = await this.organizationRepository.save(existingOrganization.data);
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

    if (res.affected === null && res.affected === undefined && res.affected === 0) {
      throw new InternalServerErrorException("Error while removing organization.")
    }

    return {
      success: true,
      expired: false,
      data: res.raw,
      message: "Organization removed successfully.",
      statusCode: 200
    }
  }
}
