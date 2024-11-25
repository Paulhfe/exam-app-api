import { ExamRepository } from "../../domain/repositories/ExamRepository";
import { Exam } from "../../domain/entities/Exam";

interface CreateExamRequest {
  title: string;
  description: string;
  isObjective: boolean;
  passingScore: number;
  isActive: boolean;
  duration: number;
  enrollmentCount: number;
}

export class CreateExam {
  constructor(private examRepository: ExamRepository) {}

  async execute(request: CreateExamRequest): Promise<Exam> {
    const {
      title,
      description,
      isObjective,
      passingScore,
      isActive,
      duration,
      enrollmentCount = 0,
    } = request;

    // Generate a unique ID for the exam
    const examId = `exam_${Date.now()}`;

    const exam = new Exam(
      examId,
      title,
      description,
      isObjective,
      passingScore,
      isActive,
      duration,
      enrollmentCount
    );

    // Save the exam with the generated ID
    await this.examRepository.createExam(exam);

    return exam; // Return the exam with the generated ID
  }
}
