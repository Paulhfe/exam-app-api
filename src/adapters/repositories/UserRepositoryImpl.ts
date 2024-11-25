import { UserRepository } from "../../domain/repositories/UserRepository";
import { User } from "../../domain/entities/User";
import UserModel from "../../infrastructure/database/models/UserModel";

export class UserRepositoryImpl implements UserRepository {
  async createUser(user: User): Promise<User> {
    return await UserModel.create(user);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await UserModel.findOne({ email });
  }

  async updateUser(user: User): Promise<User | null> {
    return await UserModel.findByIdAndUpdate(user.id, user, { new: true });
  }

  async findUserById(id: string): Promise<User | null> {
    return await UserModel.findById(id);
  }

  async enrollInExam(userId: string, examId: string): Promise<void> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Add the examId to the enrolledExams array if it's not already present
    if (!user.enrolledExams.includes(examId)) {
      user.enrolledExams.push(examId);
      await user.save(); // Save the updated user document
    }
  }
}
