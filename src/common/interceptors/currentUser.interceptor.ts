import { CallHandler, ExecutionContext, Injectable, NestInterceptor, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { UserService } from "../../user/user.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(
        private reflector: Reflector,
        private readonly userService: UserService,
    ) { }

    async intercept(context: ExecutionContext, next: CallHandler) {
        const isPublic = this.reflector.get<boolean>(
            'IS_PUBLIC_KEY',
            context.getHandler(),
        );

        if (isPublic) return next.handle();

        const request = context.switchToHttp().getRequest();

        if (!request.auth?.sub) {
            throw new UnauthorizedException('Missing auth context');
        }

        const user = await this.userService.findOne(request.auth.sub);
        if (!user) throw new NotFoundException('User not found');

        request.currentUser = user.data;

        return next.handle();
    }
}