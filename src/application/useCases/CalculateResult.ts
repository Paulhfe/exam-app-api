import { ExamRepository } from "../../domain/repositories/ExamRepository";
import ExamAttemptModel from "../../infrastructure/database/models/ExamAttemptModel";
import ExamModel from "../../infrastructure/database/models/ExamModel";
import { QuestionDocument } from "../../infrastructure/database/models/QuestionModel";

interface CalculateResultsRequest {
  examId: string;
  email: string;
}

export class CalculateResults {
  async execute(request: CalculateResultsRequest): Promise<number> {
    const { examId, email } = request;

    // Fetch the exam details
    const exam = await ExamModel.findById(examId).populate("questions");
    if (!exam) {
      throw new Error("Exam not found");
    }

    // Fetch the user's attempt for this exam
    const examAttempt = await ExamAttemptModel.findOne({ examId, email });
    if (!examAttempt) {
      throw new Error("Exam attempt not found for this user");
    }

    // Calculate the score
    let score = 0;

    // Use type assertion to specify the type of exam.questions
    const questions = exam.questions as unknown as QuestionDocument[];

    examAttempt.answers.forEach((submittedAnswer) => {
      const correctQuestion = questions.find(
        (question: any) =>
          question.id && question._id.toString() === submittedAnswer.questionId
      );
      if (
        correctQuestion &&
        correctQuestion.correctAnswer === submittedAnswer.answer
      ) {
        score++;
      } else {
        console.warn("No question found for:", submittedAnswer.questionId);
      }
    });

    return exam.questions.length > 0
      ? (score / exam.questions.length) * 100
      : 0;
  }
}
