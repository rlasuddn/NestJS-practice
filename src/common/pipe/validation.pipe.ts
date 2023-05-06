import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

// value 현재 파이프에 전달된 인수
// metadata: 현재 파이프에 전달된 인수의 메타데이터

/**
 * ArgumentMetadata
 * type - 파이프에 전달된 인수가 본문인지, 쿼리 매개변수인지, 매개변수인지, 커스텀 매개변수인지를 나타낸다.
 * metadata - 라우트 핸들러에 정의된 인수의 타입을 알려준다. 핸들러에서 타입 생략 또는 바닐라 자바스크립트 사용시 undefined.
 * data - 데커레이터에 전달된 문자열, 즉, 매개변수의 이름.
 */

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(value); // 5
    console.log(metadata); // { metatype: [Function: Number], type: 'param', data: 'id' }
    return value;
  }
}
