import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/AuthService";
import AdminModel from "../../infrastructure/database/models/AdminModel"; // Import the AdminModel
import { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  adminId?: string;
}

export async function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.error("No token found");
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = verifyToken(token) as DecodedToken;
    console.log("Token decoded:", decoded);

    // Check for admin ID and verify in the database
    if (decoded.adminId) {
      AdminModel.findOne({ adminID: decoded.adminId })
        .then((admin) => {
          if (!admin) {
            console.log("Admin not found in the database");
            res.status(403).json({ message: "Access denied" });
            return;
          }
          req.body.user = { adminID: decoded.adminId }; // Attach user data to `req.body.user`
          console.log("Admin verified and added to request:", req.body.user);
          return next();
        })
        .catch((error) => {
          console.error("Error finding admin:", error);
          res.status(500).json({ error: "Database error" });
        });
    } else {
      console.log("No adminId found in decoded token");
      res.status(403).json({ message: "Admin access required" });
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
}
