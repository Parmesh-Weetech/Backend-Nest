import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";

import { OrganizationService } from "../../organization/organization.service";

@Injectable()
export class CurrentOrganizationGuard implements CanActivate {
    constructor(private readonly organizationService: OrganizationService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        if (!request.auth?.sub) {
            throw new UnauthorizedException('Auth payload missing');
        }

        const organization = await this.organizationService.findOne(
            request.auth.orgId,
        );

        if (!organization) {
            throw new NotFoundException('User not found');
        }

        request.organization = organization.data.id;

        return true;
    }
}
