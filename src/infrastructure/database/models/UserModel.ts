import mongoose, { Document, Schema } from "mongoose";

// Define the structure for each answer within the user's answers array
const AnswerSchema = new Schema({
  examId: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
  answers: [
    {
      answerText: { type: String, required: true },
      markedCorrect: { type: Boolean, default: false }, // Allows admin to mark as correct/incorrect
    },
  ],
});

export interface Answer {
  examId: string;
  answers: {
    answerText: string;
    markedCorrect: boolean;
  }[];
}

export interface UserDocument extends Document {
  email: string;
  password: string;
  fullName: string;
  enrolledExams: Array<string>;
  answers: Answer[];
}

const UserSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  enrolledExams: { type: [String], default: [] },
  answers: [AnswerSchema],
});

const UserModel = mongoose.model<UserDocument>("User", UserSchema);
export default UserModel;
