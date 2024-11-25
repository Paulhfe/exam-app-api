import mongoose, { Document, Schema } from "mongoose";

const ExamSchema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  isObjective: { type: Boolean, required: true },
  passingScore: { type: Number, required: true },
  isActive: { type: Boolean, default: false },
  enrollmentCount: { type: Number, default: 0 },
  questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  duration: {
    type: Number,
    required: true,
  },
});

export interface ExamDocument extends Document {
  title: string;
  description: string;
  isObjective: boolean;
  passingScore: number;
  isActive: boolean;
  enrollmentCount: number;
  correctAnswers: string[];
  questions: Schema.Types.ObjectId[];
  duration: number;
}

const ExamModel = mongoose.model<ExamDocument>("Exam", ExamSchema);

export default ExamModel;
