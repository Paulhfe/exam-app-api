import { Question } from "../entities/Question";

export interface QuestionRepository {
  addQuestion(question: Question): Promise<Question>;
  findQuestionById(questionId: string): Promise<Question | null>;
  findQuestionsByExamId(examId: string): Promise<Question[]>;
}
