import { Module, Global } from '@nestjs/common';
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from "@nestjs/jwt";
import { type StringValue } from "ms";
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.strategy";
import { JwtInterceptor } from "./interceptors/jwt.interceptor";

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<StringValue>('JWT_SECRET_EXPIRE'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    {
      provide: APP_INTERCEPTOR,
      useClass: JwtInterceptor,
    },
  ],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}
