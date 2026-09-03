import express from "express";
const router = express.Router();
import productController from "../controller/product.controller.js";
import uploadImage from "../config/imageUpload.js";

// Define your product routes here
router.post(
  "/createproduct",
  uploadImage.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "supportingImages", maxCount: 3 },
  ]),
  productController.createProduct,
);
router.delete("/deleteproduct/:id", productController.deleteProduct);

export default router;
