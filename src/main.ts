import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import { CurrentUserInterceptor } from './common/interceptors/currentUser.interceptor';
import { UserService } from './user/user.service';
import { PostService } from './post/post.service';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
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
    new ClassSerializerInterceptor(app.get(Reflector))
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
