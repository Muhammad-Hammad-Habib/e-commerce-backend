import prisma from "../lib/prisma.js";
import {
  AppError,
  parseId,
  asyncHandler,
} from "../middleware/error.middleware.js";

const createCartItem = asyncHandler(async (req, res) => {
  const { quantity, cartId, productId } = req.body;

  if (!cartId || !productId) {
    throw AppError("cartId and productId are required", 400);
  }

  const cartItem = await prisma.cartItem.create({
    data: {
      quantity: quantity === undefined ? 1 : Number(quantity),
      cartId: Number(cartId),
      productId: Number(productId),
    },
    include: {
      cart: true,
      product: true,
    },
  });

  res.status(201).json({
    success: true,
    data: cartItem,
  });
});

const getCartItems = asyncHandler(async (req, res) => {
  const cartItems = await prisma.cartItem.findMany({
    include: {
      cart: true,
      product: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  res.json({
    success: true,
    data: cartItems,
  });
});

const getCartItemById = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);

  const cartItem = await prisma.cartItem.findUnique({
    where: { id },
    include: {
      cart: true,
      product: true,
    },
  });

  if (!cartItem) {
    throw AppError("Cart item not found", 404);
  }

  res.json({
    success: true,
    data: cartItem,
  });
});

const updateCartItem = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const { quantity, cartId, productId } = req.body;

  const existing = await prisma.cartItem.findUnique({
    where: { id },
  });

  if (!existing) {
    throw AppError("Cart item not found", 404);
  }

  const cartItem = await prisma.cartItem.update({
    where: { id },
    data: {
      quantity: quantity === undefined ? undefined : Number(quantity),
      cartId: cartId === undefined ? undefined : Number(cartId),
      productId: productId === undefined ? undefined : Number(productId),
    },
    include: {
      cart: true,
      product: true,
    },
  });

  res.json({
    success: true,
    data: cartItem,
  });
});

const deleteCartItem = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);

  const existing = await prisma.cartItem.findUnique({
    where: { id },
  });

  if (!existing) {
    throw AppError("Cart item not found", 404);
  }

  await prisma.cartItem.delete({
    where: { id },
  });

  res.json({
    success: true,
    data: existing,
  });
});

export {
  createCartItem,
  getCartItems,
  getCartItemById,
  updateCartItem,
  deleteCartItem,
};
