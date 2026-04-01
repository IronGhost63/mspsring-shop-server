import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, UseInterceptors, BadRequestException } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { Throttle } from '@nestjs/throttler';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from "@src/auth/decorators/role.decorator";
import { RolesGuard } from "@src/auth/guards/role.guard";
import { JwtInterceptor } from "@src/auth/interceptors/jwt.interceptor";
import { UserRole } from "@src/enum/userRole";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Throttle({
    default: {
      limit: 3,
      ttl: 60000,
    },
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards( AuthGuard('jwt') )
  @UseInterceptors( JwtInterceptor )
  @Get()
  async findAll( @Request() req ) {
    if ( req.user.role === UserRole.ADMIN ) {
      return await this.usersService.findAll();
    } else {
      const currentUser = await this.usersService.findOne(req.user.id);

      return [
        currentUser,
      ];
    }
  }

  @UseGuards( AuthGuard('jwt') )
  @UseInterceptors( JwtInterceptor )
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards( AuthGuard('jwt') )
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req
  ) {
    if ( req.user.role === UserRole.ADMIN || req.user.id === id) {
      return this.usersService.update(id, updateUserDto);
    } else {
      throw new BadRequestException('Unable to update user data')
    }
  }

  @UseGuards( AuthGuard('jwt'), RolesGuard )
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
