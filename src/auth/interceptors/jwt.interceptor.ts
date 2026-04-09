import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Inject } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import ms from "ms";
import { UsersService } from "@src/users/users.service";
import { AuthService } from "@src/auth/auth.service";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";

@Injectable()
export class JwtInterceptor implements NestInterceptor {
  constructor(
    @Inject(AuthService)
    private authService: AuthService,
    private usersService: UsersService,
    private configService: ConfigService
  ){}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map(async (data) => {
        const request = context.switchToHttp().getRequest();

        if ( !request.user ) {
          return {
            message: 'success',
            timestamp: new Date().toISOString(),
            data: await data,
          }
        }

        const user = await this.usersService.findOne(request.user.id);
        const accessToken = await this.authService.login(user, response);
        const accessTokenExpire = this.configService.getOrThrow('JWT_EXPIRE');

        return {
          message: 'success',
          timestamp: new Date().toISOString(),
          accessExpire: new Date(Date.now() + ms(accessTokenExpire)),
          data: await data,
        }
      }),
    );
  }
}
