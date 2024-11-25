import { UserRepository } from "../../domain/repositories/UserRepository";
import { ExamRepository } from "../../domain/repositories/ExamRepository";

interface EnrollInExamRequest {
  email: string;
  examId: string;
}

export class EnrollInExam {
  constructor(
    private userRepository: UserRepository,
    private examRepository: ExamRepository
  ) {}

  async execute(request: EnrollInExamRequest): Promise<string> {
    const { email, examId } = request;

    // Find user by email
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if the exam exists and get its title
    const exam = await this.examRepository.findExamById(examId);
    if (!exam) {
      throw new Error("Exam not found");
    }

    // Check if the user is already enrolled in this exam
    const alreadyEnrolled = user.enrolledExams.includes(exam.title);
    if (alreadyEnrolled) {
      throw new Error("User is already enrolled in this exam");
    }

    // Add the exam to the user's enrolled exams with title
    user.enrolledExams.push(exam.title);
    await this.userRepository.updateUser(user);

    // Increase the enrollment count for the exam
    exam.enrollmentCount += 1;
    await this.examRepository.updateExam(exam);

    return `User with email ${email} enrolled in exam "${exam.title}" successfully.`;
  }
}
