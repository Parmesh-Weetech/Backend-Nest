import session from 'express-session';
import { ConfigService } from '@nestjs/config';

export function createSessionMiddleware(configService: ConfigService) {
    return session({
        name: 'sid',
        secret: configService.get('SESSION_SECRET')!,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 3600000,
            secure: false,
            sameSite: 'lax',
        },
    });
}
