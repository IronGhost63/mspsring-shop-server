import { UserRole } from "@src/enum/userRole";

export class JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}
