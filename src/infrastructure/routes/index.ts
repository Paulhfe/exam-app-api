import express from "express";
import { AuthMiddleware } from "../../adapters/middleware/AuthMiddleware";
import { AdminController } from "../../adapters/controllers/AdminController";
import { UserController } from "../../adapters/controllers/UserController";
import { ExamController } from "../../adapters/controllers/ExamController";
import { QuestionController } from "../../adapters/controllers/QuestionController";

const router = express.Router();

// Admin Routes
router.post(
  "/admin/register",
  async (req, res) => await AdminController.register(req, res)
);
router.post(
  "/admin/login",
  async (req, res) => await AdminController.login(req, res)
);

router.post(
  "/admin/verify",
  async (req, res) => await AdminController.verify(req, res)
);
router.post(
  "/admin/exam/add",
  AuthMiddleware,
  async (req, res) => await AdminController.createExam(req, res)
);
router.post(
  "/admin/question/add",
  AuthMiddleware,
  async (req, res) => await QuestionController.addQuestions(req, res)
);

// User Routes

router.post(
  "/user/register",
  async (req, res) => await UserController.register(req, res)
);
router.post(
  "/user/login",
  async (req, res) => await UserController.login(req, res)
);
router.post(
  "/user/exam/enroll",
  async (req, res) => await UserController.enrollInExam(req, res)
);

router.post(
  "/user/exam/take-exam",
  async (req, res) => await UserController.takeExam(req, res)
);

// Exam Routes
router.post(
  "/user/exam/submit",
  async (req, res) => await ExamController.submitExam(req, res)
);
router.post(
  "/user/exam/view",
  async (req, res) => await ExamController.viewAvailableExams(req, res)
);
router.post(
  "/user/exam/calculate",
  async (req, res) => await ExamController.calculateResults(req, res)
);

export default router;
