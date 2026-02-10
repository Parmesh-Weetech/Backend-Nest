import { Injectable } from "@nestjs/common";
import { DataSource, In, Repository } from "typeorm";

import { Organization } from "./entities/organization.entity";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { UpdateOrganizationDto } from "./dto/update-organization.dto";

@Injectable()
export class OrganizationRepository extends Repository<Organization> {

    constructor(private dataSource: DataSource) {
        super(Organization, dataSource.createEntityManager());
    }

    async findAll(userId: string): Promise<Organization[] | [] | null> {
        const organizations = await this.find({ where: { users: In([userId]) }, relations: ['users'] });

        if (organizations.length === 0) return [];

        if (!organizations) return null;

        return organizations;
    }

    async findById(id: string): Promise<Organization | null> {
        const organization = await this.findOne({ where: { id: id } });

        if(!organization) return null;

        return organization;
    }

    async createOrganization(createOrganizationDto: CreateOrganizationDto): Promise<Organization | null> {
        const newOrganization = this.create(createOrganizationDto);

        const organization = await this.save(newOrganization);

        if(!organization) return null;

        return organization;
    }

    async updateOrganization(updateOrganizationDto: UpdateOrganizationDto): Promise<Organization | null> {
        const updateOrganization = await this.save(updateOrganizationDto);

        if(!updateOrganization) return null;

        return updateOrganization;
    }

    async softDeleteOrganization(id: string): Promise<boolean> {
        const affectedRows = await this.softDelete(id);

        if(!affectedRows.affected === null || affectedRows.affected === undefined || affectedRows.affected === 0) return false;

        return true;
    }
}