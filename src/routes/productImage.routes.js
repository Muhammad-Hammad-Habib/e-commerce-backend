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

router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "supportingImages", maxCount: 3 },
  ]),
  createProductImage,
);
router.get("/", getProductImages);
router.get("/:id", getProductImageById);
router.put(
  "/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  updateProductImage,
);
router.delete("/:id", deleteProductImage);

export default router;
