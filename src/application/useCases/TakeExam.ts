import { UserRepository } from "../../domain/repositories/UserRepository";
import { ExamRepository } from "../../domain/repositories/ExamRepository";
import { QuestionRepository } from "../../domain/repositories/QuestionRepository";

interface TakeExamRequest {
  email: string;
  examId: string;
}

export class TakeExam {
  constructor(
    private userRepository: UserRepository,
    private examRepository: ExamRepository,
    private questionRepository: QuestionRepository
  ) {}

  async execute(request: TakeExamRequest) {
    const { email, examId } = request;

    // Check if the user exists and is enrolled
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

    // Retrieve questions
    const questions =
      await this.questionRepository.findQuestionsByExamId(examId);

    return { examId, questions };
  }
}
