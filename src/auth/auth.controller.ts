import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from "./dto/signin.dto";
import { Public } from "./decorators/public.decorator";

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login( @Body() credential: SignInDto) {
    try {
      const user = await this.authService.validateUser(credential.email, credential.password);
      const accessToken = await this.authService.login(user);

      return {accessToken}
    } catch( error ) {
      throw new BadRequestException(error.message);
    }
  }
}
