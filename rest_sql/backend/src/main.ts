import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    // credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.BACKEND_PORT;
  await app.listen(port, () => {
    console.log(`RUNNING ON PORT ${port} ✅`);
  });
}
bootstrap();
