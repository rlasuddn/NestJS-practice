import { Injectable, Logger, Param, ParseIntPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomLogger } from './logger/logger.service';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly customLogger: CustomLogger,
  ) {}

  getHello(): string {
    console.log(this.configService.get('OPENAI_API_KEY'));
    this.customLogger.error('level:error');
    this.customLogger.warn('level:warn');
    this.customLogger.log('level:log');
    this.customLogger.verbose('level:verbose');
    this.customLogger.debug('level:debug');
    return 'Hello World!';
  }

  findOne(id: number) {
    return id;
  }
}
