import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import { CurrentUserInterceptor } from './common/interceptors/currentUser.interceptor.js';
import { UserService } from './user/user.service.js';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.use(session({
      name: "sid",
      secret: "0cdd0ac6",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 3600000,
        secure: false,
        sameSite: "lax"
      }
    }))
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    )
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
      new CurrentUserInterceptor(app.get(Reflector), app.get(UserService))
    );
    await app.listen(process.env.PORT ?? 3000);
  } catch(error: any) {
    console.error('Error starting server:', error);
    console.log(error);
  }
}
bootstrap();