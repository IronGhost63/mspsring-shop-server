import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from "cookie-parser";
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  app.useStaticAssets(
    join(__dirname, '../..', 'uploads'),
    {
      prefix: '/public/uploads/',
    }
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
