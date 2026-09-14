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

const router = express.Router();

router.post("/register_user", createUser);
router.get("/get_all_users", getUsers);
router.get("/get_user/:id", getUserById);
router.put("/update_user/:id", updateUser);
router.delete("/delete_user/:id", deleteUser);

router.post("/login_user", authenticateUser, loginUser);

export default router;
