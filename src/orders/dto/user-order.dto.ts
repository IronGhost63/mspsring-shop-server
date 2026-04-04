import { IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class UserOrderItemDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  quantity: number;
}

export class UserOrderDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserOrderItemDto)
  items: UserOrderItemDto[];
}
