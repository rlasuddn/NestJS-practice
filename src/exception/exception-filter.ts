import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { Request, Response } from 'express';

@Catch() // 처리되지 않은 모든 예외를 잡으려 할 때 사용
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: Logger) {}
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    //대부분의 예의는 HttpException을 상속받는 클래스들로 제공한다.
    //HttpException이 아닌 예외는 알 수 없는 에러이므로 InternalServerErrorException
    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
    }

    const response = (exception as HttpException).getResponse();
    const log = {
      timestamp: new Date(),
      url: req.url,
      response,
    };

    this.logger.log(log);
    res.status((exception as HttpException).getStatus()).json(log);
  }
}
