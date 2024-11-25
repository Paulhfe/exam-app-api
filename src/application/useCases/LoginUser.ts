import { UserRepository } from "../../domain/repositories/UserRepository";
import jwt from "jsonwebtoken";

interface LoginUserRequest {
  email: string;
  password: string;
}

export class LoginUser {
  constructor(private userRepository: UserRepository) {}

  async execute(request: LoginUserRequest) {
    const { email, password } = request;

    // Verify user and password
    const user = await this.userRepository.findUserByEmail(email);
    if (!user || user.password !== password) {
      throw new Error("Invalid credentials");
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRATION || "15m",
    });

    return { user, token };
  }
}
