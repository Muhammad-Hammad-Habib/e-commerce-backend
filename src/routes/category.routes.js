import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoriesForFilter,
} from "../controllers/category.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/onlyAdminAccess.middleware.js";

const router = express.Router();

router.get("/getAllCategoriesForFilter", getCategoriesForFilter);

router.post("/add_category", [authenticateUser, requireAdmin], createCategory);
router.get(
  "/getAllCategories",
  [authenticateUser, requireAdmin],
  getCategories,
);
router.get("/:id", [authenticateUser, requireAdmin], getCategoryById);
router.put("/:id", [authenticateUser, requireAdmin], updateCategory);
router.delete(
  "/deleteCategory/:id",
  [authenticateUser, requireAdmin],
  deleteCategory,
);

export default router;
