import { Schema, model, Document } from "mongoose";

export interface QuestionDocument extends Document {
  examId: Schema.Types.ObjectId;
  questionText: string;
  options?: string[];
  correctAnswer: string;
  isObjective: boolean;
  _id: Schema.Types.ObjectId;
}

const questionSchema = new Schema<QuestionDocument>({
  examId: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
  questionText: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
  isObjective: { type: Boolean, required: true },
});

const QuestionModel = model<QuestionDocument>("Question", questionSchema);

export default QuestionModel;
