import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { logger3 } from './common/middlewares/logger.middleware';
import { AuthGuard } from './common/guards/auth.guard';
import { CustomLogger } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn', 'log']
        : ['error', 'warn', 'log', 'verbose', 'debug'],
  });

  //커스텀 로거 전역 사용
  // app.useLogger(app.get(CustomLogger));

  //ValidationPipe를 모든 핸들러에 전역으로 설정
  //class-transform 적용을 위해 transform 속성 true
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  //로깅 전역 설정 use()는 클래스를 인수로 받을 수 없어 함수 전달
  app.use(logger3);

  //가드 전역 설정
  // app.useGlobalGuards(new AuthGuard())
  await app.listen(4000);
}
bootstrap();
