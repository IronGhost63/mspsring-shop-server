import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { OptionsService } from './options.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { Public } from "@src/auth/decorators/public.decorator";
import { Roles } from "@src/auth/decorators/role.decorator";
import { RolesGuard } from "@src/auth/guards/role.guard";
import { JwtInterceptor } from "@src/auth/interceptors/jwt.interceptor";
import { UserRole } from "@src/enum/userRole";

@Public()
@Controller('options')
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles( UserRole.ADMIN)
  @UseInterceptors(JwtInterceptor)
  @Post()
  create(@Body() createOptionDto: CreateOptionDto) {
    return this.optionsService.create(createOptionDto);
  }

  @Get()
  findAll() {
    return this.optionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.optionsService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles( UserRole.ADMIN)
  @UseInterceptors(JwtInterceptor)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOptionDto: UpdateOptionDto) {
    return this.optionsService.update(+id, updateOptionDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles( UserRole.ADMIN)
  @UseInterceptors(JwtInterceptor)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.optionsService.remove(+id);
  }
}
