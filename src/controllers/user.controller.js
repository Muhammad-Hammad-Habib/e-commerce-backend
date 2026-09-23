import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  AppError,
  parseId,
  asyncHandler,
} from "../middleware/error.middleware.js";
import { response } from "express";

const userWithoutPassword = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  console.log(req.body);
  if (!name || !email || !password || !phone) {
    throw AppError("User name, email, password, and phone are required", 400);
  }
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (existingUser) {
    const i = AppError("Email is already registered", 409);
    throw i;
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(process.env.BCRYPT_SALT_ROUNDS),
  );
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      role,
    },
    select: userWithoutPassword,
  });

  if (!user) {
    throw AppError("Failed to create user", 500);
  }

  res.status(201).json({
    success: true,
    data: user,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw AppError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw AppError("Invalid email or password", 401);
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );
  // 5. Remove password from response
  const { password: _password, ...userWithoutPassword } = user;

  // res.redirect()

  res.json({
    success: true,
    data: userWithoutPassword,
    token,
    role: user.role,
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      ...userWithoutPassword,
      addresses: true,
      // cart: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  res.json({
    success: true,
    data: users,
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      ...userWithoutPassword,
      addresses: true,
      orders: true,
    },
  });

  if (!user) {
    throw AppError("User not found", 404);
  }

  res.json({
    success: true,
    data: user,
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const { name, email, password, phone, role } = req.body;

  const existing = await prisma.user.findUnique({
    where: { id },
  });

  if (!existing) {
    throw AppError("User not found", 404);
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      name,
      email,
      password,
      phone,
      role,
    },
    select: userWithoutPassword,
  });

  res.json({
    success: true,
    data: user,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);

  const existing = await prisma.user.findUnique({
    where: { id },
    select: userWithoutPassword,
  });

  if (!existing) {
    throw AppError("User not found", 404);
  }

  await prisma.user.delete({
    where: { id },
  });

  res.json({
    success: true,
    data: existing,
  });
});

export { createUser, loginUser, getUsers, getUserById, updateUser, deleteUser };
