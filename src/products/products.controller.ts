import { Controller, Query, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from "@nestjs/platform-express";
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
  @UseInterceptors(FileInterceptor('preview_image'))
  @Roles(UserRole.ADMIN)
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() cover: Express.Multer.File
  ) {
    const payload = new CreateProductDto();

    payload.title = createProductDto.title;
    payload.description = createProductDto.description;
    payload.unit_price = createProductDto.unit_price;
    payload.stock = createProductDto.stock;

    if ( cover ) {
      payload.preview_image = cover.filename;
    }

    return this.productsService.create(payload);
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
