import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AUTH_SERVICE } from '../constants';
import { ClientProxy } from '@nestjs/microservices';

export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    const jwt = req.cookies?.Authorization;
    if (!jwt) {
      return false;
    }

    return this.authClient
      .send({ cmd: 'jwt-auth' }, { Authorization: jwt })
      .pipe(
        tap((response) => {
          context.switchToHttp().getRequest().user = response.user;
        }),
        map(() => true),
        catchError(() => of(false)),
      );
  }
}
