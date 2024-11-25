import { authenticator } from "otplib";
import jwt from "jsonwebtoken";
import { EmailService } from "./EmailService";
import AdminModel from "../../infrastructure/database/models/AdminModel";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const OTP_SECRET = process.env.OTP_SECRET;
const EMAIL_HOST = process.env.EMAIL_HOST;
const emailService = new EmailService();

if (!JWT_SECRET || !OTP_SECRET || !EMAIL_HOST) {
  throw new Error("Missing environment variables");
}

authenticator.options = { step: 300 };

// Generate JWT function
function generateAccessToken(adminId: string) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
  }

  return jwt.sign({ adminId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION || "1h", // Session token, no refresh
  });
}

export async function requestOTP(email: string) {
  try {
    const otp = authenticator.generate(OTP_SECRET!); // OTP Logic
    console.log("Generated OTP for email:", otp);
    const subject = "Your OTP Code";
    const text = `Your OTP is ${otp}`;

    // Call sendMail with the correct arguments
    const info = await emailService.sendMail(email, subject, text);

    console.log("OTP sent:", info);
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP");
  }
}

// Verify OTP and Issue JWT on successful login
export async function verifyOTPAndLogin(email: string, otp: string) {
  if (!otp) throw new Error("OTP is required.");

  console.log("Received OTP for verification:", otp);

  const isValid = authenticator.check(otp, OTP_SECRET!);
  console.log("Is OTP valid?", isValid);
  if (!isValid) throw new Error("Invalid OTP.");

  const admin = await AdminModel.findOne({ email });
  if (!admin) throw new Error("Admin not found.");

  // Issue JWT token
  return generateAccessToken(admin.adminID.toString());
}

// Verify JWT function
export function verifyToken(token: string) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log("Decoded token:", decoded); // Confirm structure includes adminID
  return decoded;
}
