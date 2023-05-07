import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { logger3 } from './common/middlewares/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //ValidationPipe를 모든 핸들러에 전역으로 설정
  //class-transform 적용을 위해 transform 속성 true
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  //로깅 전역 설정 use()는 클래스를 인수로 받을 수 없어 함수 전달
  app.use(logger3);

  await app.listen(4000);
}
bootstrap();
