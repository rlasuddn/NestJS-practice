import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { NotIn } from 'src/common/decorators/notIn';

export class CreateUserDto {
  // @Transform((params) => {
  //   console.log(params);
  //   return params.value.trim();
  // })

  @Transform(({ value }) => {
    return value.trim(); // 문자열 공백 제거
  })

  //커스텀 데코레이터
  @NotIn('password', {
    message: 'password는 name과 같은 문자열을 포함할 수 없습니다.',
  })

  //2글자 이상 30글자 이하 문자열
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  readonly name: string;

  //30글자 이하 문자열 이메일 형식
  @IsString()
  @IsEmail()
  @MaxLength(60)
  readonly email: string;

  //영문 대소문자와 숫자 또는 특수문자로 이뤄진 8자 이상 30자 이하 문자열
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  readonly password: string;
}
