import { Admin } from "../entities/Admin";

export interface AdminRepository {
  createAdmin(admin: Admin): Promise<Admin>;
  findAdminByEmail(email: string): Promise<Admin | null>;
  findAdminById(adminID: string): Promise<Admin | null>;
  findAdminByEmailAndAdminID(
    email: string,
    adminID: string
  ): Promise<Admin | null>;
}
