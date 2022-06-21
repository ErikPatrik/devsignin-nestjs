import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // aqui definimos que seja possível detectar as validações nos DTOs, ou seja,
    // cada req que chega nas rotas que usa o DTO para tipar o objeto recebido, o validation Pipe,
    // verifica está de acordo com as validações feitas
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
}
bootstrap();
