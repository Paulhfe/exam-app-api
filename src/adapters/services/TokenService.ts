import jwt from "jsonwebtoken";
import RegistrationTokenModel from "../../infrastructure/database/models/RegistrationTokenModel";

export class TokenService {
  static async generateRegistrationToken(adminId: string): Promise<string> {
    const token = jwt.sign({ adminId }, process.env.JWT_SECRET!, {
      expiresIn: "1h", // Set JWT token to expire in 1 hour
    });

    const registrationToken = new RegistrationTokenModel({
      adminId,
      token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
    });

    await registrationToken.save();
    return token;
  }

  static async validateRegistrationToken(
    token: string
  ): Promise<string | null> {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      adminId: string;
    };
    const adminId = decoded.adminId;

    const registrationToken = await RegistrationTokenModel.findOne({ token });
    if (!registrationToken || registrationToken.expiresAt < new Date()) {
      throw new Error("Invalid or expired registration token");
    }

    // Remove the used token from the database
    await registrationToken.deleteOne();
    return adminId;
  }
}
