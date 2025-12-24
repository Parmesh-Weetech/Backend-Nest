import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.ts';

async function bootstrap() {
    const app = await NestFactory.create(AppModule); // tells NestJS to create an application instance based on your AppModule

    await app.listen(3000)
}

bootstrap();