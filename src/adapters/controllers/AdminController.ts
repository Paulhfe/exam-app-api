import { Request, Response } from "express";
import { AdminRepositoryImpl } from "../repositories/AdminRepositoryImpl";
import { RegisterAdmin } from "../../application/useCases/RegisterAdmin";
import { CreateExam } from "../../application/useCases/CreateExam";
import { ExamRepositoryImpl } from "../repositories/ExamRepositoryImpl";
import { LoginAdmin } from "../../application/useCases/LoginAdmin"; // Import LoginAdmin use case
import { VerifyAdminLogin } from "../../application/useCases/VerifyAdmin"; // Import VerifyAdmin use case
import { requestOTP } from "../services/AuthService"; // For OTP request

const adminRepository = new AdminRepositoryImpl();
const examRepository = new ExamRepositoryImpl();

export class AdminController {
  static async register(req: Request, res: Response) {
    const { email, password, fullName, adminID } = req.body;
    try {
      const useCase = new RegisterAdmin(adminRepository);
      const result = await useCase.execute({
        email,
        password,
        fullName,
        adminID,
      });
      res.json(result);
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({
        error:
          error instanceof Error ? error.message : "Unexpected error occurred",
      });
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password, adminID } = req.body;

    try {
      // Use LoginAdmin use case to check credentials
      const useCase = new LoginAdmin(adminRepository);
      const result = await useCase.execute({ email, password, adminID });

      console.log("Login successful:", result);

      // If login is successful, request OTP
      await requestOTP(email);

      console.log("OTP sent to email");
      res.status(200).json({ result });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred." });
      }
    }
  }

  static async verify(req: Request, res: Response) {
    const { email, otp } = req.body;

    try {
      // Use VerifyAdmin use case to verify OTP and issue a JWT
      const useCase = new VerifyAdminLogin();
      const result = await useCase.execute({ email, otp });

      res.json({ token: result.token });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred." });
      }
    }
  }

  static async createExam(req: Request, res: Response) {
    const {
      title,
      description,
      isObjective,
      passingScore,
      isActive,
      duration,
      enrollmentCount = 0,
    } = req.body;
    const useCase = new CreateExam(examRepository);
    const result = await useCase.execute({
      title,
      description,
      isObjective,
      passingScore,
      isActive,
      duration,
      enrollmentCount,
    });
    res.json(result);
  }
}

export default AdminController;
