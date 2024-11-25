import mongoose from "mongoose";

const ExamAttemptSchema = new mongoose.Schema({
  email: { type: String, required: true },
  examId: { type: String, required: true },
  answers: [{ questionId: String, answer: String }],
  submittedAt: { type: Date, default: Date.now },
});

const ExamAttemptModel = mongoose.model("ExamAttempt", ExamAttemptSchema);

export default ExamAttemptModel;
