import { AdminRepository } from "../../domain/repositories/AdminRepository";

interface RegisterAdminRequest {
  email: string;
  password: string;
  fullName: string;
  adminID: string;
}

export class RegisterAdmin {
  constructor(private adminRepository: AdminRepository) {}

  async execute({ email, password, fullName, adminID }: RegisterAdminRequest) {
    try {
      const existingAdmin = await this.adminRepository.findAdminByEmail(email);
      if (existingAdmin) {
        throw new Error("Admin already exists with this email.");
      }

      const admin = await this.adminRepository.createAdmin({
        email,
        password,
        fullName,
        adminID,
      });

      return admin;
    } catch (error) {
      console.error("Error in RegisterAdmin use case:", error);
      throw error;
    }
  }
}
