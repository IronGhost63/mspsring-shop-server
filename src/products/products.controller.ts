import { Controller, Query, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public } from "@src/auth/decorators/public.decorator";
import { Roles } from "@src/auth/decorators/role.decorator";
import { RolesGuard } from "@src/auth/guards/role.guard";
import { UserRole } from "@src/enum/userRole";

@Public()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query('order') order: string,
    @Query('cursor') cursor: string,
    @Query('perPage') perPage: number
  ) {
    const criteria = {
      order: order ?? 'asc',
      cursor: cursor ? new Date(cursor) : undefined,
      perPage: perPage ?? 10,
    }

    return this.productsService.findAll( criteria );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
