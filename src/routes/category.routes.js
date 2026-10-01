import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

router.post("/add_category", createCategory);
router.get("/get_all_category", getCategories);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategory);
router.delete("/deleteCategory/:id", deleteCategory);

export default router;
