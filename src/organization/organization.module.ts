import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { PermissionModule } from '../permission/permission.module';

import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { Organization } from './entities/organization.entity';
import { ORGANIZATION_REPOSITORY } from './organization.repository.interface';
import { PostgresOrganizationRepository } from './postgres-organization.repository';
import { MongoOrganizationRepository } from './mongo-organization.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationDocument, OrganizationSchema } from './schemas/organization.schema';
import { createDatabaseRepositoryProvider } from '../common/providers/repository-selector.provider';

@Module({
  controllers: [OrganizationController],
  providers: [
    OrganizationService,
    PostgresOrganizationRepository,
    MongoOrganizationRepository,
    createDatabaseRepositoryProvider(
      ORGANIZATION_REPOSITORY,
      PostgresOrganizationRepository,
      MongoOrganizationRepository,
    ),
  ],
  imports: [
    TypeOrmModule.forFeature([Organization]),
    MongooseModule.forFeature([
      {
        name: OrganizationDocument.name,
        schema: OrganizationSchema,
      },
    ]),
    forwardRef(() => PermissionModule),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
  ],
  exports: [OrganizationService],
})
export class OrganizationModule { }
