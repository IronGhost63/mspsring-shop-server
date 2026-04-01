import { BadRequestException, UnauthorizedException, Logger, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { schema } from "database/schema";
import { User } from "@schema/user";
import { UsersService } from "@src/users/users.service";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('Email and Password not match');
    }

    const isMatch: boolean = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Email and Password not match');
    }

    return user;
  }

  async login(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    const accessSecret = this.configService.get<string>('JWT_SECRET')
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');

    const accessTokenExpire = this.configService.getOrThrow('JWT_EXPIRE');
    const refreshTokenExpire = this.configService.getOrThrow('JWT_REFRESH_EXPIRE');

    const accessToken = this.jwtService.sign(payload, {
      secret: accessSecret,
      expiresIn: accessTokenExpire
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: refreshTokenExpire
    });

    await this.usersService.update(user.id, {
      refreshToken: await bcrypt.hash(refreshToken, 10),
    })

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async verifyUserRefreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<Omit<typeof schema.userTable.$inferSelect, 'password'>> {
    try {
      const user = await this.usersService.findOne(userId);

      if ( !user.refreshToken ) {
        throw new UnauthorizedException();
      }

      const refreshTokenMatches = bcrypt.compareSync( refreshToken, user.refreshToken );

      if (!refreshTokenMatches) {
        throw new UnauthorizedException();
      }

      return user;
    } catch (error) {
      this.logger.error('Verify user refresh token error', error);

      throw new UnauthorizedException('Refresh token is not valid');
    }
  }
}
