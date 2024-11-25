import { AdminRepository } from "../../domain/repositories/AdminRepository";

interface LoginAdminRequest {
  email: string;
  password: string;
  adminID: string;
}

export class LoginAdmin {
  constructor(private adminRepository: AdminRepository) {}

  async execute(request: LoginAdminRequest) {
    const { email, password, adminID } = request;

    const admin = await this.adminRepository.findAdminByEmailAndAdminID(
      email,
      adminID
    );
    if (!admin) {
      throw new Error("Invalid credentials");
    }
    if (admin.password !== password) {
      throw new Error("Invalid credentials");
    }

    return {
      adminDetails: admin,
      message: "OTP has been sent to your email for verification",
    };
  }
}
