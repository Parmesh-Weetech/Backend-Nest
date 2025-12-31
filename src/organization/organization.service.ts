import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrganizationService {
  constructor(@InjectRepository(Organization) private readonly organizationRepository: Repository<Organization>) {}
  async findAll(): Promise<Organization[]> {
    return await this.organizationRepository.find();
  }

  async findOne(id: string): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({ where: { id: id }});

    if(!organization) throw new NotFoundException("Organization not found.");

    return organization;
  }

  async create(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    const organization = await this.organizationRepository.create(createOrganizationDto)

    return await this.organizationRepository.save(organization);
  }

  async update(updateOrganizationDto: UpdateOrganizationDto): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({ where: { id : updateOrganizationDto.id }});

    if(!organization) throw new NotFoundException("Organization not found.");

    if(organization.name) organization.name = updateOrganizationDto.name;

    return await this.organizationRepository.save(organization);
  }

  async remove(id: string): Promise<string> {
    const organization = await this.organizationRepository.findOne({ where: { id: id } });

    if (!organization) throw new NotFoundException("Organization not found.");

    const acknowledge = await this.organizationRepository.softDelete(id);

    if(acknowledge.affected !== null || acknowledge.affected !== undefined || acknowledge.affected > 0) {
      return "Organization deleted successfully.";
    }

    throw new InternalServerErrorException("Internal server error while deleting organization.");
  }
}
