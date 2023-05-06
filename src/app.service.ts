import { Injectable, Param, ParseIntPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}
  getHello(): string {
    console.log(this.configService.get('OPENAI_API_KEY'));
    return 'Hello World!';
  }

  findOne(id: number) {
    return id;
  }
}
