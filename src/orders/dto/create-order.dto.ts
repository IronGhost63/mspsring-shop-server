import { IsNotEmpty, IsUUID, IsArray, IsNumber, IsDate, ValidateNested } from "class-validator";
import { Type } from 'class-transformer';
import { OrderItemDto } from "./order-item.dto";

export class CreateOrderDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsNumber()
  total: number = 0;

  @IsNumber()
  discount: number = 0;

  @IsNumber()
  subtotal: number = 0;

  @IsNotEmpty()
  shippingAddress: string;

  @IsNotEmpty()
  billingAddress: string;

  @Type(() => Date)
  @IsDate()
  created: Date = new Date();

  @Type(() => Date)
  @IsDate()
  modified: Date = new Date();
}
