import { ExamRepository } from "../../domain/repositories/ExamRepository";
import { Exam } from "../../domain/entities/Exam";
import ExamModel, {
  ExamDocument,
} from "../../infrastructure/database/models/ExamModel";
import UserModel, {
  UserDocument,
} from "../../infrastructure/database/models/UserModel";
import ExamAttemptModel from "../../infrastructure/database/models/ExamAttemptModel";

export class ExamRepositoryImpl implements ExamRepository {
  async createExam(exam: Exam): Promise<Exam> {
    const createdExam = await ExamModel.create(exam);
    return createdExam.toObject() as Exam;
  }

  async addQuestion(examId: string, question: any): Promise<any> {
    return await ExamModel.findByIdAndUpdate(
      examId,
      { $push: { questions: question } },
      { new: true }
    );
  }

  async findExamById(id: string): Promise<Exam | null> {
    return await ExamModel.findById(id);
  }

  async updateExam(exam: Exam): Promise<Exam | null> {
    return await ExamModel.findByIdAndUpdate(exam.id, exam, { new: true });
  }
  async getAllExams(): Promise<ExamDocument[]> {
    try {
      // Retrieve all exams from the database
      const exams = await ExamModel.find();
      return exams.map((exam) => exam.toObject());
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Unable to retrieve exams: ${error.message}`);
      } else {
        throw new Error(`Unable to retrieve exams: An unknown error occurred`);
      }
    }
  }

  async enrollUser(examId: string, userId: string): Promise<UserDocument> {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const exam = await ExamModel.findById(examId);
      if (!exam) {
        throw new Error("Exam not found");
      }

      user.enrolledExams.push(examId);
      await user.save();

      return user; // Return the updated user document
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Unable to enroll user: ${error.message}`);
      } else {
        throw new Error(`Unable to enroll user: An unknown error occurred`);
      }
    }
  }

  async isUserEnrolledInExam(email: string, title: string): Promise<boolean> {
    try {
      const enrollment = await UserModel.findOne({
        email: email,
        title: title,
      });
      return Boolean(enrollment);
    } catch (error) {
      console.error("Error checking enrollment:", error);
      throw new Error("Could not verify enrollment status");
    }
  }

  async saveExamAttempt(
    userId: string,
    examId: string,
    answers: { questionId: string; answer: string }[]
  ): Promise<any> {
    try {
      const attempt = await ExamAttemptModel.create({
        userId,
        examId,
        answers,
        submittedAt: new Date(),
      });
      return attempt;
    } catch (error) {
      console.error("Error saving exam attempt:", error);
      throw new Error("Could not save exam attempt");
    }
  }

  async saveAnswers(
    examId: string,
    userId: string,
    answers: any
  ): Promise<void> {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      user.answers.push({ examId, answers });
      await user.save();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Unable to save answers: ${error.message}`);
      } else {
        throw new Error(`Unable to save answers: An unknown error occurred`);
      }
    }
  }

  async calculateExamResults(examId: string, userId: string): Promise<number> {
    try {
      // Step 1: Fetch the user's answers
      const user: UserDocument | null = await UserModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Find the answers for the specific exam
      const userAnswers = user.answers.find(
        (answer) => answer.examId === examId
      );
      if (!userAnswers) {
        throw new Error("No answers found for this exam");
      }

      // Fetch the exam details
      const exam: ExamDocument | null = await ExamModel.findById(examId);
      if (!exam) {
        throw new Error("Exam not found");
      }

      //Calculate the score based on the type of exam
      let score = 0;
      if (exam.isObjective) {
        // Objective exam: compare each answer with the correct answer
        const correctAnswers = exam.correctAnswers; // Ensure this property is defined in your model
        userAnswers.answers.forEach((answer: any, index: number) => {
          if (answer === correctAnswers[index]) {
            score++;
          }
        });
      } else {
        // Theoretical exam: assume each answer has been manually marked as correct or incorrect by the admin
        userAnswers.answers.forEach((answer: any) => {
          // For each answer, check if it has a `markedCorrect` field set by the admin
          if (answer.markedCorrect === true) {
            score++;
          }
        });
      }

      //Return the calculated score
      return score;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Unable to calculate exam results: ${error.message}`);
      } else {
        throw new Error(
          "Unable to calculate exam results: An unknown error occurred"
        );
      }
    }
  }
}
