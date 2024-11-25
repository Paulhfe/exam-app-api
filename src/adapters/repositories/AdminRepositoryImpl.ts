import { AdminRepository } from "../../domain/repositories/AdminRepository";
import { Admin } from "../../domain/entities/Admin";
import AdminModel, {
  AdminDocument,
} from "../../infrastructure/database/models/AdminModel";

export class AdminRepositoryImpl implements AdminRepository {
  async createAdmin(admin: Admin): Promise<Admin> {
    return await AdminModel.create(admin);
  }

  async findAdminByEmail(email: string): Promise<Admin | null> {
    return await AdminModel.findOne({ email });
  }

  async findAdminById(adminID: string): Promise<Admin | null> {
    return await AdminModel.findById(adminID);
  }

  async findAdminByEmailAndAdminID(
    email: string,
    adminID: string
  ): Promise<AdminDocument | null> {
    try {
      // Find the admin by email and adminID
      const admin = await AdminModel.findOne({ email, adminID }).exec();
      return admin; // Will return null if no admin found
    } catch (error) {
      console.error("Error finding admin by email and adminID:", error);
      throw new Error("Database error");
    }
  }
}
