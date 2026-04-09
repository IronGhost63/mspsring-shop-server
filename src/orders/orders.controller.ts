import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UnauthorizedException  } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { Throttle } from "@nestjs/throttler";
import { CurrentUser } from "@src/auth/decorators/current-user.decorator";
import { OrdersService } from './orders.service';
import { UserOrderDto } from "./dto/user-order.dto";
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtPayload } from "@src/auth/dto/jwt-payload.dto";
import { Roles } from "@src/auth/decorators/role.decorator";
import { RolesGuard } from "@src/auth/guards/role.guard";
import { UserRole } from "@src/enum/userRole";

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  @Throttle({
    default: {
      limit: 6,
      ttl: 60000,
    },
  })
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Post()
  create(
    @Body() userOrder: UserOrderDto,
    @CurrentUser() user: Partial<JwtPayload>
  ) {
    return this.ordersService.create(user, userOrder);
  }

  @Roles(UserRole.ADMIN)
  @Get('/all')
  findAll() {
    return this.ordersService.findAll();
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get()
  findMy(
    @CurrentUser() user: Partial<JwtPayload>
  ) {
    return this.ordersService.findByCustomer(user.id!);
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: Partial<JwtPayload>
  ) {
    if ( user.role === UserRole.USER && user.id !== id ) {
      throw new UnauthorizedException('Not Authorized');
    }

    return this.ordersService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(
    @Param('id') id: string
  ) {
    return this.ordersService.remove(id);
  }
}
