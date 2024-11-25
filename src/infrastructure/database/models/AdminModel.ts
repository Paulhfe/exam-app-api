import mongoose, { Schema, Document } from "mongoose";

export interface AdminDocument extends Document {
  email: string;
  password: string;
  fullName: string;
  adminID: string;
}

const AdminSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  adminID: { type: String, required: true, unique: true },
});

export default mongoose.model<AdminDocument>("Admin", AdminSchema);
