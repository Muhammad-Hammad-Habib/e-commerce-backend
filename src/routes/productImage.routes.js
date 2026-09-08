import express from "express";
import upload from "../middleware/upload.middleware.js";
import {
  createProductImage,
  getProductImages,
  getProductImageById,
  updateProductImage,
  deleteProductImage,
} from "../controllers/productImage.controller.js";

const router = express.Router();

router.post("/", upload.single("image"), createProductImage);
router.get("/", getProductImages);
router.get("/:id", getProductImageById);
router.put("/:id", upload.single("image"), updateProductImage);
router.delete("/:id", deleteProductImage);

export default router;
