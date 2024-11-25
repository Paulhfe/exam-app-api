import { Request, Response } from "express";
import { UserRepositoryImpl } from "../repositories/UserRepositoryImpl";
import { ExamRepositoryImpl } from "../repositories/ExamRepositoryImpl";
import { QuestionRepositoryImpl } from "../repositories/QuestionRepositoryImpl";
import { RegisterUser } from "../../application/useCases/RegisterUser";
import { LoginUser } from "../../application/useCases/LoginUser";
import { requestOTP } from "../services/AuthService";
import { EnrollInExam } from "../../application/useCases/EnrollInExam";
import { TakeExam } from "../../application/useCases/TakeExam";

const userRepository = new UserRepositoryImpl();
const examRepository = new ExamRepositoryImpl();
const questionRepository = new QuestionRepositoryImpl();

export class UserController {
  static async register(req: Request, res: Response) {
    const { email, password, fullName } = req.body;
    const useCase = new RegisterUser(userRepository);
    try {
      const result = await useCase.execute({ email, password, fullName });
      await requestOTP(email); // Trigger OTP request after registration
      res.json(result);
    } catch (error) {
      res.status(500).json({
        message: "An error occurred during registration",
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const useCase = new LoginUser(userRepository);
    try {
      const result = await useCase.execute({ email, password });
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ error: error.message });
      } else {
        res.status(401).json({ error: "An unexpected error occurred." });
      }
    }
  }

  static async enrollInExam(req: Request, res: Response) {
    const { email, examId } = req.body;
    const enrollInExamUseCase = new EnrollInExam(
      userRepository,
      examRepository
    );

    try {
      const result = await enrollInExamUseCase.execute({ email, examId });
      res.json({ result });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while enrolling in the exam",
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  static async takeExam(req: Request, res: Response) {
    const { email, examId } = req.body;

    try {
      const takeExamUseCase = new TakeExam(
        userRepository,
        examRepository,
        questionRepository
      );
      const result = await takeExamUseCase.execute({ email, examId });
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "An unexpected error occurred." });
      }
    }
  }
}
