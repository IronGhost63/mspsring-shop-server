import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateProductDto {
  @IsNotEmpty()
  title: string;

  description: string;

  @IsNotEmpty()
  @IsNumber()
  unit_price: number;

  preview_image?: string;

  @IsNotEmpty()
  @IsNumber()
  stock: number;
}
