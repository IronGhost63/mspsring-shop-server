import { IsNotEmpty, IsNumber } from "class-validator"

export class CreateProductDto {
  @IsNotEmpty()
  title: string;

  description: string;

  @IsNotEmpty()
  @IsNumber()
  unit_price: number;

  @IsNotEmpty()
  @IsNumber()
  stock: number;
}
