import { IsNotEmpty, IsEmail } from "class-validator";
import { UserRole } from "@src/enum/userRole";

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  role: UserRole = UserRole.USER;
}
