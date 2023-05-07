import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EmailService } from './email/email.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  LoggerMiddleware,
  LoggerMiddleware2,
} from './common/middlewares/logger.middleware';
import { UsersController } from './users/users.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.production.env'
          : process.env.NODE_ENV === 'stage'
          ? '.stage.env'
          : '.env',
      isGlobal: true,
    }), // 개발환경에 따라 ConfigModule 동적 생성
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'mysql', //데이터베이스 타입
      host: process.env.DB_HOST, //데이터베이스 호스트 주소
      port: 3306, //포트 번호 기본 3306
      username: process.env.DB_USER,
      password: process.env.DB_PW,
      database: 'nestjs_practice', //연결할 데이터 베이스 스키마 이름
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.DB_SYNC === 'true',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, EmailService],
})

//미들웨어 설정
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    // consumer.apply(LoggerMiddleware).forRoutes('*');
    //2개의 미들웨어 적용 (나열된 순서대로 적용) 컨트롤러 클래스를 주어 동작 가능
    consumer
      .apply(LoggerMiddleware, LoggerMiddleware2)
      //특정 엔드포인트, 메서드 로깅 제외
      // .exclude({ path: '/users', method: RequestMethod.GET })
      .forRoutes(UsersController);
  }
}
