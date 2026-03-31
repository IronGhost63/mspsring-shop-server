import { IsNotEmpty, IsUUID } from "class-validator";

export class OrderItemDto {
  @IsNotEmpty()
  @IsUUID()
  product_id: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  unit_price: number;

  @IsNotEmpty()
  quantity: number;
}
