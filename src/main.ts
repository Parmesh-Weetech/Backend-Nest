import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpException, HttpStatus } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: '*',
      credentials: true,
    });

    await app.listen(process.env.PORT ?? 3001);

    console.log('🚀 Server started successfully');
  } catch (error) {
    console.error("Error starting server: ", error);
    throw new HttpException(
      error.message,
      HttpStatus.INTERNAL_SERVER_ERROR,
      { cause: error },
    );
  }
}
bootstrap();
