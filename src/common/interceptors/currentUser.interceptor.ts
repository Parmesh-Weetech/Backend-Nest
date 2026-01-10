import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UserService } from "../../user/user.service.js";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(
        private reflector: Reflector,
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();

        const publicRoute = this.reflector.get<boolean>(
            'IS_PUBLIC_KEY',
            context.getHandler()
        );

        if (publicRoute) return next.handle();

        const authorization = request.headers.authorization;
        const token = authorization.split(' ')[1];

        const decodedPayload = this.jwtService.decode(token, {
            json: true
        });

        if (decodedPayload.sub && request.session?.orgId) {
            const user = await this.userService.findOne(decodedPayload.sub);

            if (!user) throw new BadRequestException("User not exists!")

            request.currentUser = user;
            request.orgId = request.session?.orgId;
        }

        return next.handle();
    }
}