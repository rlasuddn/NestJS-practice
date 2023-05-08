import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  error(message: any, stack?: string, context?: string) {
    super.error.apply(this, arguments);
    this.doSomething();
  }

  private doSomething() {
    //로깅 관련 부가 로직
    //ex. DB 저장
  }
}
