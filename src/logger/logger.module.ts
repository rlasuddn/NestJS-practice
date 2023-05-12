import { Logger, Module } from '@nestjs/common';
import { CustomLogger } from './logger.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from 'src/logger/logger.interceptor';

@Module({
  providers: [
    CustomLogger,
    //로깅 인터셉터 등록
    Logger,
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
  exports: [CustomLogger],
})
export class LoggerModule {}
