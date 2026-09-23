import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
} from "../controllers/user.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/onlyAdminAccess.middleware.js";

const router = express.Router();

router.post("/register_user", createUser);
router.post("/login_user", loginUser);

// only current user route
router.get("/get_user/:id", authenticateUser, getUserById);
router.put("/update_user/:id", authenticateUser, updateUser);
router.delete("/delete_user/:id", authenticateUser, deleteUser);

// only for admin access route
router.get("/get_all_users", requireAdmin, getUsers);

export default router;
