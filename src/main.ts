import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ValidationPipe } from './common/pipe/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //ValidationPipe를 모든 핸들러에 전역으로 설정
  // app.useGlobalPipes(new ValidationPipe)
  await app.listen(4000);
}
bootstrap();
