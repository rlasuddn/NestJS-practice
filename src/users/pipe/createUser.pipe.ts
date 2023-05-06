import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CreateUserPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) return value; // metaType이 파이프가 지원하는 타입인지 검사
    // console.log(value, metatype);
    const object = plainToClass(metatype, value); //자바스크립트 객체를 클래스 객체로 변경
    // console.log(object);
    const errors = await validate(object); //객체에 대한 유효성 검사
    // console.log(errors);
    if (errors.length > 0) throw new BadRequestException('Validation failed');

    return value;
  }

  //기본 타입이 아닌 DTO클래스 와 같은 타입일 경우에 true 반환
  private toValidate(metatype: Function): boolean {
    // console.log(metatype);
    const types: Function[] = [String, Boolean, Number, Array, Object];
    // console.log(!types.includes(metatype));
    return !types.includes(metatype);
  }
}
