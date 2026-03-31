import { IsNotEmpty } from "class-validator";

export class CreateOptionDto {
  @IsNotEmpty()
  key: string;

  @IsNotEmpty()
  value: string;
}
