import { Exam } from "../entities/Exam";
import { ExamDocument } from "../../infrastructure/database/models/ExamModel";
import { UserDocument } from "../../infrastructure/database/models/UserModel";

export interface ExamRepository {
  createExam(exam: Exam): Promise<Exam>;
  findExamById(id: string): Promise<Exam | null>;
  updateExam(exam: Exam): Promise<Exam | null>;
  getAllExams(): Promise<ExamDocument[]>;
  enrollUser(examId: string, email: string): Promise<UserDocument>;
  saveAnswers(examId: string, email: string, answers: any): Promise<void>;
  calculateExamResults(examId: string, email: string): Promise<number>;
  isUserEnrolledInExam(email: string, examId: string): Promise<boolean>;
  saveExamAttempt(
    email: string,
    examId: string,
    answers: { questionId: string; answer: string }[]
  ): Promise<any>;
}
