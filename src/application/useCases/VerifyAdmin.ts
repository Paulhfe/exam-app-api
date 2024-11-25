import { verifyOTPAndLogin } from "../../adapters/services/AuthService";

interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export class VerifyAdminLogin {
  async execute(request: VerifyOTPRequest) {
    const { email, otp } = request;

    // Verify OTP and issue JWT
    const token = await verifyOTPAndLogin(email, otp);

    return { token };
  }
}
