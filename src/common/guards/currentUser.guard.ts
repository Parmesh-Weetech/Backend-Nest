import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";

import { UserService } from "../../user/user.service";

@Injectable()
export class CurrentUserGuard implements CanActivate {
    constructor(private readonly userService: UserService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        console.log(request.auth)
        if (!request.auth?.sub) {
            throw new UnauthorizedException('Auth payload missing');
        }

        const user = await this.userService.findOneWithRolesAndPermissions(
            request.auth.sub,
        );

        if (!user) {
            throw new NotFoundException('User not found');
        }

        request.currentUser = user.data;

        console.log(user.data)

        return true;
    }
}
