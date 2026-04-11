import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Setup global components like CORS, validation pipes
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strips away non-whitelisted params
    transform: true  // Automatically transforms payloads to be objects typed according to their DTO classes
  }));

  await app.listen(3000);
  console.log(`Backend is running on: http://localhost:3000`);
}
bootstrap();
