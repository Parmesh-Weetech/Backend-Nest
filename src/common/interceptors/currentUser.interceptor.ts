import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { AuthService } from "src/auth/auth.service";
import { PostService } from "src/post/post.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(
        private reflector: Reflector,
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) { }

    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();

        const publicRoute = this.reflector.get<boolean>(
            'IS_PUBLIC_KEY',
            context.getHandler()
        );

        if(publicRoute) return next.handle();

        if (request.session?.userId) {
            const auth = await this.authService.findOne(request.session.userId);

            if (!auth) {
                const user = await this.userService.findOne(request.session.userId);
                if (user) request.currentUser = user;
            }
        }
        
        return next.handle();
    }
}