import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT') || 5000;

  app.use(cookieParser());
  app.enableCors({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true,
  });

  await app.listen(PORT, () =>
    console.log(`The server is running on PORT: ${PORT}`),
  );
}

bootstrap();
