import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request); //false일 경우 403에러 다른 예외 커스텀 가능
  }

  private validateRequest(request: Request) {
    const jwtString = request.headers.authorization.split('Bearer ')[1]; //헤더에서 JWT 파싱
    this.authService.verify(jwtString); //JWT가 서버에서 발급한 것인지 검증
    return true;
  }
}
