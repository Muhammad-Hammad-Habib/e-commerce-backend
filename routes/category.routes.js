import express from "express";
const router = express.Router();
import categoryController from "../controller/category.controller.js";

// Define your category routes here
router.get("/getcategories", categoryController.getCategories);
router.post("/createcategory", categoryController.createCategory);
router.delete("/deletecategory/:id", categoryController.deleteCategory);

export default router; 
