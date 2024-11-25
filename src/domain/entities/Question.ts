import mongoose, { Schema } from "mongoose";

export class Question {
  _id?: Schema.Types.ObjectId;
  examId: string | mongoose.Types.ObjectId;
  questionText: string;
  options?: string[];
  correctAnswer?: string;
  isObjective: boolean;

  constructor(
    examId: string,
    questionText: string,
    isObjective: boolean,
    options?: string[],
    correctAnswer?: string
  ) {
    this.examId = examId;
    this.questionText = questionText;
    this.isObjective = isObjective;
    this.options = options;
    this.correctAnswer = correctAnswer;
  }
}
