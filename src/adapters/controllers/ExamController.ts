import { Request, Response } from "express";
import { ExamRepositoryImpl } from "../repositories/ExamRepositoryImpl";
import { QuestionRepositoryImpl } from "../repositories/QuestionRepositoryImpl";
import { UserRepositoryImpl } from "../repositories/UserRepositoryImpl";
import { CreateExam } from "../../application/useCases/CreateExam";
import { AddQuestions } from "../../application/useCases/AddQuestion";
import { SubmitExam } from "../../application/useCases/SubmitExam";
import { CalculateResults } from "../../application/useCases/CalculateResult";

const examRepository = new ExamRepositoryImpl();
const questionRepository = new QuestionRepositoryImpl();
const userRepository = new UserRepositoryImpl();

export class ExamController {
  static async createExamWithQuestions(req: Request, res: Response) {
    const {
      title,
      description,
      isObjective,
      passingScore,
      isActive,
      duration,
      questions,
      enrollmentCount = 0,
    } = req.body;

    // Create exam first
    const createExamUseCase = new CreateExam(examRepository);
    const createdExam = await createExamUseCase.execute({
      title,
      description,
      isObjective,
      passingScore,
      isActive,
      duration,
      enrollmentCount,
    });

    // Add questions to the created exam
    const addQuestionsUseCase = new AddQuestions(questionRepository);
    try {
      const questionsAdded = await addQuestionsUseCase.execute({
        questions: questions.map((question: any) => ({
          examId: createdExam.id,
          questionText: question.questionText,
          options: question.options,
          correctAnswer: question.correctAnswer,
          isObjective: question.isObjective,
        })),
      });

      res.status(201).json({
        message: "Exam and questions created successfully",
        questionsAdded,
      });
    } catch (error) {
      res.status(500).json({ message: "Error adding questions", error });
    }
  }
  static async viewAvailableExams(req: Request, res: Response) {
    const exams = await examRepository.getAllExams();
    res.json(exams);
  }

  static async submitExam(req: Request, res: Response) {
    const { email, examId, answers } = req.body;

    try {
      const submitExamUseCase = new SubmitExam(
        userRepository,
        examRepository,
        questionRepository
      );

      // Execute the submit exam use case
      const result = await submitExamUseCase.execute({
        email,
        examId,
        answers,
      });

      // Respond with the result
      res.json(result);
    } catch (error) {
      // Error handling
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "An unexpected error occurred." });
      }
    }
  }

  static async calculateResults(req: Request, res: Response) {
    const { email, examId } = req.body;
    const calculateResultsUseCase = new CalculateResults();

    try {
      const result = await calculateResultsUseCase.execute({ email, examId });
      res.json({ result });
    } catch (error) {
      console.error("Error calculating results:", error); // Log the full error
      res.status(500).json({
        message: "An error occurred",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
