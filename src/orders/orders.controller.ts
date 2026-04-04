import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { Throttle } from "@nestjs/throttler";
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Roles } from "@src/auth/decorators/role.decorator";
import { RolesGuard } from "@src/auth/guards/role.guard";
import { JwtInterceptor } from "@src/auth/interceptors/jwt.interceptor";
import { UserRole } from "@src/enum/userRole";

@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(JwtInterceptor)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Throttle({
    default: {
      limit: 6,
      ttl: 60000,
    },
  })
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
