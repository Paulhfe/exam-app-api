import { UserRepository } from "../../domain/repositories/UserRepository";
import { requestOTP } from "../../adapters/services/AuthService"; // Import specific function

interface RegisterUserRequest {
  email: string;
  password: string;
  fullName: string;
  enrolledExams?: string[];
}

export class RegisterUser {
  constructor(private userRepository: UserRepository) {}

  async execute(request: RegisterUserRequest) {
    const { email, password, fullName, enrolledExams = [] } = request;

    // Encrypt password, save user
    const user = await this.userRepository.createUser({
      email,
      password,
      fullName,
      enrolledExams,
    });

    // // Send OTP to the newly registered user
    // await requestOTP(email); // Trigger OTP request

    return { user };
  }
}
