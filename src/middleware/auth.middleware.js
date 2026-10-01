import jwt, { decode } from "jsonwebtoken";
import { AppError, asyncHandler } from "./error.middleware.js";

const authenticateUser = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw AppError("Authentication token is required", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // console.log(decode)
    next();
  } catch (error) {
    throw AppError("Invalid or expired token", 401);
  }
});

export { authenticateUser };
