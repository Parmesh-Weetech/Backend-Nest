import { Controller, Post } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { User } from '../user/entities/user.entity';

@Controller('logging')
export class LoggingController {
    @Post()
    async createLog(@CurrentUser() user: User) {

    }
}
