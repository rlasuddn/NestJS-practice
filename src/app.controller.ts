import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ValidationPipe } from './common/pipes/validation.pipe';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() // DefaultValuePipe 인수의 값에 기본값 설정
  getLists(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    console.log(offset, limit);
  }

  @Get('validation/:id')
  validationPipe(@Param('id', ValidationPipe) id: number) {
    return this.appService.findOne(id);
  }

  @Get('v2/:id') // 객체를 생성하여 전달하면 동작을 원하는 대로 변경 가능. 예로 상태코드
  ParseIntPipe2(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    console.log('controller로 요청이 오는가?');
    return this.appService.findOne(id);
  }

  @Get('v1/:id')
  ParseIntPipe1(@Param('id', ParseIntPipe) id: number) {
    console.log('controller로 요청이 오는가?');
    return this.appService.findOne(id);
  }
}
