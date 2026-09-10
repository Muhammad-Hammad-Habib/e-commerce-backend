import prisma from "../lib/prisma.js";
import {
  AppError,
  parseId,
  asyncHandler,
} from "../middleware/error.middleware.js";

const createCart = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    throw AppError("userId is required", 400);
  }

  const cart = await prisma.cart.create({
    data: {
      userId: Number(userId),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: true,
    },
  });

  res.status(201).json({
    success: true,
    data: cart,
  });
});

const getCarts = asyncHandler(async (req, res) => {
  const carts = await prisma.cart.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });

  res.json({
    success: true,
    data: carts,
  });
});

const getCartById = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);

  const cart = await prisma.cart.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart) {
    throw AppError("Cart not found", 404);
  }

  res.json({
    success: true,
    data: cart,
  });
});

const updateCart = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const { userId } = req.body;

  const existing = await prisma.cart.findUnique({
    where: { id },
  });

  if (!existing) {
    throw AppError("Cart not found", 404);
  }

  const cart = await prisma.cart.update({
    where: { id },
    data: {
      userId: userId === undefined ? undefined : Number(userId),
    },
    include: {
      items: true,
    },
  });

  res.json({
    success: true,
    data: cart,
  });
});

const deleteCart = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);

  const existing = await prisma.cart.findUnique({
    where: { id },
    include: {
      items: true,
    },
  });

  if (!existing) {
    throw AppError("Cart not found", 404);
  }

  await prisma.cart.delete({
    where: { id },
  });

  res.json({
    success: true,
    data: existing,
  });
});

export { createCart, getCarts, getCartById, updateCart, deleteCart };
