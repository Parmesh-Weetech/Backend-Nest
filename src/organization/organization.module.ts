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

@Module({
  controllers: [OrganizationController],
  providers: [
    OrganizationService,
    {
      provide: ORGANIZATION_REPOSITORY,
      useClass:
        process.env.DATABASE_PROVIDER === 'postgres'
          ? PostgresOrganizationRepository
          : MongoOrganizationRepository,
    },
  ],
  imports: [
    ...(process.env.DATABASE_PROVIDER === 'postgres'
      ? [TypeOrmModule.forFeature([Organization])]
      : []),
    ...(process.env.DATABASE_PROVIDER === 'mongodb'
      ? [
        MongooseModule.forFeature([
          {
            name: OrganizationDocument.name,
            schema: OrganizationSchema,
          },
        ]),
      ]
      : []),
    forwardRef(() => PermissionModule),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
  ],
  exports: [OrganizationService],
})
export class OrganizationModule { }

