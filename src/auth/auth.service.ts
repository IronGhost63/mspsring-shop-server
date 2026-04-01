import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from "@schema/user";
import { UsersService } from "@src/users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
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

    return this.jwtService.sign(payload);
  }
}
