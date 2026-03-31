import { IsNotEmpty, IsUUID } from "class-validator";
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
