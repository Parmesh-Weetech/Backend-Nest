import { forwardRef, Inject, Injectable, Req } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto.js';
import { UpdateOrganizationDto } from './dto/update-organization.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity.js';
import { Repository } from 'typeorm';
import { Response } from '../common/response/response.dto.js';
import { Auth } from '../common/util/auth.js';
import { UserService } from '../user/user.service.js';
import type { Request } from 'express';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization) private readonly organizationRepository: Repository<Organization>,
    private readonly auth: Auth,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) { }
  async findAll(authorization: string): Promise<Response> {
    const [type, token] = authorization?.split(' ') ?? [];
    const access_token = type === 'Bearer' ? token : undefined;

    if (!access_token) return {
      success: false,
      message: "Token is required",
      data: null,
      expired: false,
      statusCode: 401
    }

    const isValid = await this.auth.verify(access_token);

    if (!isValid) return {
      success: false,
      message: "Token expired!",
      data: null,
      expired: true,
      statusCode: 400
    }

    const decodedPayload = await this.auth.decode(access_token);

    const isUserExists = await this.userService.findOne(decodedPayload.sub, authorization);

    if (!isUserExists) return {
      success: false,
      message: "User not found!",
      data: null,
      expired: false,
      statusCode: 404
    }

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

  async findOne(id: string, authorization: string): Promise<Response> {
    const [type, token] = authorization?.split(' ') ?? [];
    const access_token = type === 'Bearer' ? token : undefined;

    if (!access_token) return {
      success: false,
      message: "Token is required",
      data: null,
      expired: false,
      statusCode: 401
    }

    const isValid = await this.auth.verify(access_token);

    if (!isValid) return {
      success: false,
      message: "Token expired!",
      data: null,
      expired: true,
      statusCode: 400
    }

    const decodedPayload = await this.auth.decode(access_token);

    const isUserExists = await this.userService.findOne(decodedPayload.sub, authorization);

    if (!isUserExists) return {
      success: false,
      message: "User not found!",
      data: null,
      expired: false,
      statusCode: 404
    }

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

  async create(createOrganizationDto: CreateOrganizationDto, authorization: string): Promise<Response> {
    try {
      let req: Request

      if(req.originalUrl !== '/auth/signup' && authorization) {
        const [type, token] = authorization?.split(' ') ?? [];
        const access_token = type === 'Bearer' ? token : undefined;

        if (!access_token) return {
          success: false,
          message: "Token is required",
          data: null,
          expired: false,
          statusCode: 401
        }

        const isValid = await this.auth.verify(access_token);

        if (!isValid) return {
          success: false,
          message: "Token expired!",
          data: null,
          expired: true,
          statusCode: 400
        }

        const decodedPayload = await this.auth.decode(access_token);

        const isUserExists = await this.userService.findOne(decodedPayload.sub, authorization!);

        if (!isUserExists) return {
          success: false,
          message: "User not found!",
          data: null,
          expired: false,
          statusCode: 404
        }
      } else if (req.originalUrl !== '/auth/signup' && !authorization) {
        return {
          success: false,
          message: "Token is required",
          data: null,
          expired: false,
          statusCode: 401
        }
      }

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

  async update(updateOrganizationDto: UpdateOrganizationDto, authorization: string): Promise<Response> {
    const [type, token] = authorization?.split(' ') ?? [];
    const access_token = type === 'Bearer' ? token : undefined;

    if (!access_token) return {
      success: false,
      message: "Token is required",
      data: null,
      expired: false,
      statusCode: 401
    }

    const isValid = await this.auth.verify(access_token);

    if (!isValid) return {
      success: false,
      message: "Token expired!",
      data: null,
      expired: true,
      statusCode: 400
    }

    const decodedPayload = await this.auth.decode(access_token);

    const isUserExists = await this.userService.findOne(decodedPayload.sub, authorization);

    if (!isUserExists) return {
      success: false,
      message: "User not found!",
      data: null,
      expired: false,
      statusCode: 404
    }

    const existingOrganization = await this.findOne(updateOrganizationDto.id, authorization);

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

  async remove(id: string, authorization): Promise<Response> {
    try {
      const [type, token] = authorization?.split(' ') ?? [];
      const access_token = type === 'Bearer' ? token : undefined;

      if (!access_token) return {
        success: false,
        message: "Token is required",
        data: null,
        expired: false,
        statusCode: 401
      }

      const isValid = await this.auth.verify(access_token);

      if (!isValid) return {
        success: false,
        message: "Token expired!",
        data: null,
        expired: true,
        statusCode: 400
      }

      const decodedPayload = await this.auth.decode(access_token);

      const isUserExists = await this.userService.findOne(decodedPayload.sub, authorization);

      if (!isUserExists) return {
        success: false,
        message: "User not found!",
        data: null,
        expired: false,
        statusCode: 404
      }

      const organization = await this.findOne(id, authorization);

      if (!organization.success) return organization;

      const res = await this.organizationRepository.softDelete(id);

      if (res.affected === null && res.affected === undefined && res.affected === 0) {
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
