import { CallHandler, ExecutionContext, Injectable, NestInterceptor, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

import { UserService } from "../../user/user.service";
import { Auth } from "../util/auth";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(
        private reflector: Reflector,
        private readonly userService: UserService,
        private readonly auth: Auth
    ) { }

    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();

        const publicRoute = this.reflector.get<boolean>(
            'IS_PUBLIC_KEY',
            context.getHandler()
        );

        if (publicRoute) return next.handle();

        const authorization = request.headers.authorization;
        if(!authorization) throw new UnauthorizedException({ message: "Unauthorized request! " });

        const token = authorization.split(' ')[1];

        const isValid = await this.auth.verify(token);
        if (!isValid) throw new UnauthorizedException({ message: "Token expired!", expired: true });

        const decodedPayload = await this.auth.decode(token);

        if (decodedPayload.sub) {
            const user = await this.userService.findOne(decodedPayload.sub);
            if (!user) throw new NotFoundException({ message: "User not found." });

            request.currentUser = user.data;
        }

        return next.handle();
    }
}