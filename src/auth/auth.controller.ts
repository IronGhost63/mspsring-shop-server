import { Controller, Post, UseGuards, Res } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { type Response } from "express";
import { AuthService } from './auth.service';
import { Public } from "./decorators/public.decorator";
import { CurrentUser } from "./decorators/current-user.decorator";
import { schema } from "database/schema";

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    // @Request() req
    @CurrentUser() user: typeof schema.userTable.$inferSelect,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(user, response);
  }

  // @UseGuards(AuthGuard('jwt-refresh'))
  // @Post('refresh')
  // async refresh(
  //   @CurrentUser() user: User,
  // ) {
  //   return await this.authService.login(user);
  // }
}
