import { AppError, asyncHandler } from "./error.middleware.js";

const requireAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw AppError("Authentication required", 401);
  }

  if (req.user.role !== "ADMIN") {
    throw AppError("Admin access required", 403);
  }
  console.log(req.user)
  next();
});

export { requireAdmin };
