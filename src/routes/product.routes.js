import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { requireAdmin } from "../middleware/onlyAdminAccess.middleware.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();
router.get("/getAllProducts", getProducts);
router.get("/getProductById/:id", getProductById);

// this routes only for admin
router.post(
  "/addProduct",
  [
    authenticateUser,
    requireAdmin,
    upload.fields([
      { name: "mainImage", maxCount: 1 },
      { name: "supportingImages", maxCount: 3 },
    ]),
  ],
  createProduct,
);
router.put("/updateProduct/:id", requireAdmin, updateProduct);
router.delete("/deleteProduct/:id", requireAdmin, deleteProduct);

export default router;
