import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from "express";
import ms from 'ms';
import { User } from "@schema/user";
import { UsersService } from "@src/users/users.service";

@Injectable()
export class AuthService {
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

  async login(user: User, response: Response) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    const accessSecret = this.configService.get<string>('JWT_SECRET')
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');

    const accessTokenExpire = this.configService.getOrThrow('JWT_EXPIRE');
    const refreshTokenExpire = this.configService.getOrThrow('JWT_REFRESH_EXPIRE');

    const expiresCookieAccessToken = new Date(Date.now() + ms(accessTokenExpire));
    const expiresCookieRefreshToken = new Date(Date.now() + ms(refreshTokenExpire));

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

    response.cookie('AccessToken', accessToken, {
      httpOnly: true,
      expires: expiresCookieAccessToken,
    });

    response.cookie('RefreshToken', refreshToken, {
      httpOnly: true,
      expires: expiresCookieRefreshToken,
    })

    return response.json({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }
}
