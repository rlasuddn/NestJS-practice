import { Injectable, Logger, Param, ParseIntPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    console.log(this.configService.get('OPENAI_API_KEY'));
    this.logger.error('level:error');
    this.logger.warn('level:warn');
    this.logger.log('level:log');
    this.logger.verbose('level:verbose');
    this.logger.debug('level:debug');
    return 'Hello World!';
  }

  findOne(id: number) {
    return id;
  }
}
