import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Inject } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { UsersService } from "@src/users/users.service";
import { AuthService } from "@src/auth/auth.service";

@Injectable()
export class JwtInterceptor implements NestInterceptor {
  constructor(
    @Inject(AuthService)
    private authService: AuthService,
    private usersService: UsersService
  ){}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(async (data) => {
        const request = context.switchToHttp().getRequest();
        const user = await this.usersService.findOne(request.user.id);
        const accessToken = await this.authService.login(user);

        return {
          status: 'success',
          timestamp: new Date().toISOString(),
          ...accessToken,
          data,
        }
      }),
    );
  }
}
