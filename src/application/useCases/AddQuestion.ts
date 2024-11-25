import { QuestionRepository } from "../../domain/repositories/QuestionRepository";
import { Question } from "../../domain/entities/Question";
import mongoose from "mongoose";

interface AddQuestionRequest {
  questions: {
    examId: string | mongoose.Types.ObjectId;
    questionText: string;
    options?: string[];
    correctAnswer: string;
    isObjective: boolean;
  }[];
}

export class AddQuestions {
  constructor(private questionRepository: QuestionRepository) {}

  async execute(request: AddQuestionRequest): Promise<Question[]> {
    const addedQuestions: Question[] = [];
    for (const questionData of request.questions) {
      const { examId, questionText, options, correctAnswer, isObjective } =
        questionData;

      const examObjectId =
        typeof examId === "string"
          ? new mongoose.Types.ObjectId(examId)
          : examId;
      // Create and add each question
      const question = await this.questionRepository.addQuestion({
        examId: examObjectId,
        questionText,
        options,
        correctAnswer,
        isObjective,
      });

      addedQuestions.push(question);
    }

    return addedQuestions;
  }
}
