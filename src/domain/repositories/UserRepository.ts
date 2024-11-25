import { User } from "../entities/User";

export interface UserRepository {
  createUser(user: User): Promise<User>;
  findUserByEmail(email: string): Promise<User | null>;
  updateUser(user: User): Promise<User | null>;
  findUserById(id: string): Promise<User | null>;
  enrollInExam(email: string, examId: string): Promise<User | void>;
}
