import { QuestionRepository } from "../../domain/repositories/QuestionRepository";
import { Question } from "../../domain/entities/Question";
import QuestionModel from "../../infrastructure/database/models/QuestionModel";
import mongoose from "mongoose";

export class QuestionRepositoryImpl implements QuestionRepository {
  async addQuestion(question: Question): Promise<Question> {
    if (typeof question.examId === "string") {
      question.examId = new mongoose.Types.ObjectId(question.examId);
    }
    const createdQuestion = await QuestionModel.create(question);
    return this.convertObjectIdToString(createdQuestion);
  }

  async findQuestionsByExamId(examId: string): Promise<Question[]> {
    const examObjectId = new mongoose.Types.ObjectId(examId);
    const questions = await QuestionModel.find({ examId: examObjectId });
    return questions.map((question) => this.convertObjectIdToString(question));
  }

  async findQuestionById(questionId: string): Promise<Question | null> {
    const question = await QuestionModel.findById(questionId);
    return question ? this.convertObjectIdToString(question) : null;
  }

  private convertObjectIdToString(question: any): Question {
    return {
      ...question.toObject(),
      examId: question.examId.toString(),
    };
  }
}
