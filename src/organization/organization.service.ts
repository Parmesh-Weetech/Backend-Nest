import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto.js';
import { UpdateOrganizationDto } from './dto/update-organization.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity.js';
import { Repository } from 'typeorm';
import { OrganizationCreationFailedError, OrganizationDeletionFailedError, OrganizationUpdationFailedError } from './errors/error.js';

@Injectable()
export class OrganizationService {
  constructor(@InjectRepository(Organization) private readonly organizationRepository: Repository<Organization>) { }
  async findAll(): Promise<Organization[]> {
    const organizations = await this.organizationRepository.find();

    if (!organizations) throw new NotFoundException("Organizations not found.");

    return organizations;
  }

  async findOne(id: string): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({ where: { id: id } });

    if (!organization) throw new NotFoundException("Organization not found.");

    return organization;
  }

  async create(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    try {
      const organization = await this.organizationRepository.create(createOrganizationDto);

      return await this.organizationRepository.save(organization);
    } catch (error) {
      throw new OrganizationCreationFailedError();
    }
  }

  async update(updateOrganizationDto: UpdateOrganizationDto): Promise<Organization> {
    const organization = await this.findOne(updateOrganizationDto.id);

    if (organization.name) organization.name = updateOrganizationDto.name;

    try {
      return await this.organizationRepository.save(organization);
    } catch (error) {
      throw new OrganizationUpdationFailedError();
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const organization = await this.findOne(id);

      await this.organizationRepository.softDelete(id);

      return "Organization deleted successfully.";
    } catch (error) {
      throw new OrganizationDeletionFailedError();
    }
  }
}
