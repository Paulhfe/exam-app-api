import { Schema } from "mongoose";

export interface User {
  id?: Schema.Types.ObjectId;
  email: string;
  password: string;
  fullName: string;
  profilePicture?: string;
  enrolledExams: Array<string>;
}
