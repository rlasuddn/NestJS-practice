import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  name: string; //1글자 이상 20글자 이하 문자열

  @IsEmail()
  email: string; //이메일 형식

  password: string;
}
