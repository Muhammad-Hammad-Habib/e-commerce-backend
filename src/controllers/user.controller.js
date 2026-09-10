import prisma from "../lib/prisma.js";
import {
  AppError,
  parseId,
  asyncHandler,
} from "../middleware/error.middleware.js";

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

  if (!name || !email || !password || !phone) {
    throw AppError("User name, email, password, and phone are required", 400);
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
      phone,
      role,
    },
    select: userWithoutPassword,
  });

  res.status(201).json({
    success: true,
    data: user,
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      ...userWithoutPassword,
      addresses: true,
      cart: true,
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
      cart: {
        include: {
          items: true,
        },
      },
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

export { createUser, getUsers, getUserById, updateUser, deleteUser };
