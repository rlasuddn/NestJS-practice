import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map, tap } from 'rxjs';

// T는 any 타입, Response는 data속성을 가지는 객체
export interface Response<T> {
  data: T;
}

@Injectable()
//인터셉터는 NestInterceptor 인터페이스를 구현한 클래스이다.
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  //intercept 함수를 구현해야한다.
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<Response<T>> {
    //요청 전 작업
    console.log('before...');

    return (
      next
        .handle()
        //요청 후 작업
        .pipe(
          map((data) => {
            return { data };
          }),
        )
    );
  }
}
