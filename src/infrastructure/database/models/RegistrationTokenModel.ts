import mongoose from "mongoose";

const registrationTokenSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const RegistrationTokenModel = mongoose.model(
  "RegistrationToken",
  registrationTokenSchema
);
export default RegistrationTokenModel;
