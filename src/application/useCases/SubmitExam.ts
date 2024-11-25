import { ExamRepository } from "../../domain/repositories/ExamRepository";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { QuestionRepository } from "../../domain/repositories/QuestionRepository";

interface SubmitExamRequest {
  email: string;
  examId: string;
  answers: { questionId: string; answer: string }[];
}

export class SubmitExam {
  constructor(
    private userRepository: UserRepository,
    private examRepository: ExamRepository,
    private questionRepository: QuestionRepository
  ) {}

  async execute(request: SubmitExamRequest) {
    const { email, examId, answers } = request;

    // Check user and enrollment
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) throw new Error("User not found");

    // Verify that the exam exists
    const exam = await this.examRepository.findExamById(examId);
    if (!exam) {
      throw new Error("Exam not found");
    }

    // Check if the user is enrolled in the exam
    const isEnrolled = user.enrolledExams.includes(exam.title); // Adjust this to match your structure
    if (!isEnrolled) {
      throw new Error("User is not enrolled in this exam");
    }

    // Validate answers
    const validAnswers = [];
    for (const { questionId, answer } of answers) {
      const question =
        await this.questionRepository.findQuestionById(questionId);
      if (!question || question.examId !== examId) {
        throw new Error(`Invalid question ID: ${questionId}`);
      }
      validAnswers.push({ questionId, answer });
    }

    // Save answers in a new exam attempt record
    const examAttempt = await this.examRepository.saveExamAttempt(
      email,
      examId,
      validAnswers
    );

    return { message: "Exam submitted successfully", examAttempt };
  }
}
