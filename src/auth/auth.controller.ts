import { Controller, Post, Res, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from './auth.service';
import { Public } from "./decorators/public.decorator";

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Res({ passthrough: true }) response,
    @Request() req
  ) {
    return this.authService.login(req.user, response);
  }
}
