import { Request, Response } from "express";
import { QuestionRepositoryImpl } from "../repositories/QuestionRepositoryImpl";
import { AddQuestions } from "../../application/useCases/AddQuestion";
import ExamModel from "../../infrastructure/database/models/ExamModel";
import mongoose, { Schema } from "mongoose";

const questionRepository = new QuestionRepositoryImpl();

export class QuestionController {
  static async addQuestions(req: Request, res: Response) {
    console.log("User in request:", req.body.user);
    const { questions, examId } = req.body;

    if (!req.body.user?.adminID) {
      res.status(403).json({ message: "Access denied. Admins only." });
      return;
    }

    console.log("Received examId:", examId);
    if (!mongoose.isValidObjectId(examId)) {
      res.status(400).json({ message: "Invalid exam ID format" });
      return;
    }

    try {
      // Find the exam by examId to ensure it exists
      const exam = await ExamModel.findById(examId);
      if (!exam) {
        res.status(404).json({ message: "Exam not found" });
        return;
      }

      // Attach the examId to each question before adding
      const questionsWithExamId = questions.map((question: any) => ({
        ...question,
        examId: examId, // Add the ObjectId examId to each question
      }));

      const useCase = new AddQuestions(questionRepository);

      // Pass the modified array with examId attached to each question
      const addedQuestions = await useCase.execute({
        questions: questionsWithExamId,
      });

      const questionIds = addedQuestions
        .map((question) => question._id)
        .filter((id): id is Schema.Types.ObjectId => !!id);
      exam.questions.push(...questionIds);
      await exam.save();

      res.status(201).json({
        message: "Questions added successfully",
      });
    } catch (error) {
      console.error("Error adding questions:", error);
      res.status(500).json({ message: "Error adding questions", error });
    }
  }
}
